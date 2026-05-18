import csv
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
from django.urls import path
from django.template.response import TemplateResponse
from django.contrib import messages
from django.contrib.admin import AdminSite
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from rest_framework.authtoken.admin import TokenAdmin
from rest_framework.authtoken.models import Token
from .models import Category, Brand, Product, ProductImage, ProductSize, CarouselImage, Order, OrderItem, InventoryLog, Notification
from .services.orders import change_order_status
from .services.reports import get_sales_overview, get_daily_reports, get_monthly_reports, get_customer_analytics
from .services.google_sheets import export_orders_to_sheets

# --- Admin Site Configuration ---
class UrbanDripAdminSite(AdminSite):
    site_header = 'Urban Drip Administration'
    site_title = 'Urban Drip Admin'
    index_title = 'Store Management'

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['sales_overview'] = get_sales_overview()
        extra_context['latest_notifications'] = Notification.objects.all()[:5]
        return super().index(request, extra_context)

admin_site = UrbanDripAdminSite(name='urban_drip_admin')

# Register Auth models for maximum security
admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
admin_site.register(Token, TokenAdmin)

# --- Model Admins ---

@admin.register(Category, site=admin_site)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Brand, site=admin_site)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(CarouselImage, site=admin_site)
class CarouselImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    list_editable = ('order', 'is_active')

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 3

@admin.register(Product, site=admin_site)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'brand', 'categories_display', 'price', 'unit_profit_display', 'stock_display', 'inventory_value_display', 'created_by')
    list_filter = ('brand', 'categories', 'is_exclusive', 'created_by')

    def categories_display(self, obj):
        return ", ".join([c.name for c in obj.categories.all()])
    categories_display.short_description = "Categories"
    search_fields = ('name', 'sku', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductSizeInline]
    readonly_fields = ('view_count',)
    
    def stock_display(self, obj):
        color = "green"
        if obj.stock_quantity < 5:
            color = "red"
        return format_html('<span style="color: {}; font-weight: bold;">{}</span>', color, obj.stock_quantity)
    stock_display.short_description = "Stock"

    def unit_profit_display(self, obj):
        profit = obj.price - obj.cost_price
        color = "#27ae60" if profit > 0 else "#e74c3c"
        profit_str = "{:,.2f} DA".format(profit)
        return format_html('<span style="color: {}; font-weight: 500;">{}</span>', color, profit_str)
    unit_profit_display.short_description = "Unit Profit"

    def inventory_value_display(self, obj):
        return "{:,.2f} DA".format(obj.inventory_value)
    inventory_value_display.short_description = "Inv. Value"

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    readonly_fields = ('subtotal_display', 'profit_display')
    fields = ('product', 'quantity', 'price', 'cost_price', 'subtotal_display', 'profit_display')
    
    def subtotal_display(self, obj):
        return "{:,.2f} DA".format(obj.subtotal)
    subtotal_display.short_description = "Subtotal"

    def profit_display(self, obj):
        return "{:,.2f} DA".format(obj.profit)
    profit_display.short_description = "Profit"

@admin.register(Order, site=admin_site)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'user', 'total_price_badge', 'order_profit_display', 'status_badge', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at', 'user')
    search_fields = ('order_number', 'customer_name', 'customer_phone')
    inlines = [OrderItemInline]
    readonly_fields = ('order_number', 'total_items', 'total_price', 'order_profit', 'created_at')
    
    actions = ['export_to_csv', 'export_to_google_sheets']

    def save_model(self, request, obj, form, change):
        if change:
            original_order = Order.objects.get(pk=obj.pk)
            if original_order.status != obj.status:
                change_order_status(obj, obj.status)
        super().save_model(request, obj, form, change)

    def status_badge(self, obj):
        colors = {
            'Pending': '#f39c12',
            'Confirmed': '#3498db',
            'Processing': '#9b59b6',
            'Assigned': '#8e44ad',
            'Shipped': '#2c3e50',
            'Delivered': '#27ae60',
            'Cancelled': '#e74c3c',
        }
        color = colors.get(obj.status, '#7f8c8d')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 10px; border-radius: 12px; font-weight: bold; font-size: 0.75rem; text-transform: uppercase;">{}</span>',
            color, obj.status
        )
    status_badge.short_description = "Status"

    def total_price_badge(self, obj):
        price_str = "{:,.2f} DA".format(obj.total_price)
        return format_html('<span style="font-weight: bold; color: #2c3e50;">{}</span>', price_str)
    total_price_badge.short_description = "Total"

    def order_profit_display(self, obj):
        profit_str = "+{:,.2f} DA".format(obj.order_profit)
        return format_html('<span style="color: #27ae60; font-weight: 500;">{}</span>', profit_str)
    order_profit_display.short_description = "Profit"

    def export_to_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders_export.csv"'
        writer = csv.writer(response)
        writer.writerow(['Order #', 'Customer', 'Product', 'Qty', 'Price', 'Total', 'Date'])
        for order in queryset:
            for item in order.items.all():
                writer.writerow([
                    order.order_number,
                    order.customer_name,
                    item.product.name if item.product else "N/A",
                    item.quantity,
                    item.price,
                    item.subtotal,
                    order.created_at
                ])
        return response
    export_to_csv.short_description = "Export to CSV"

    def export_to_google_sheets(self, request, queryset):
        success, message = export_orders_to_sheets(queryset)
        if success:
            self.message_user(request, message, messages.SUCCESS)
        else:
            self.message_user(request, message, messages.ERROR)
    export_to_google_sheets.short_description = "Export selected orders to Google Sheets"

    # Analytics Dashboard Custom View
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('analytics/', self.admin_site.admin_view(self.analytics_view), name='order-analytics'),
        ]
        return custom_urls + urls

    def analytics_view(self, request):
        context = dict(
           self.admin_site.each_context(request),
           sales_overview=get_sales_overview(),
           daily_reports=get_daily_reports()[:30],
           monthly_reports=get_monthly_reports(),
           customer_stats=get_customer_analytics()[:10],
           title="Business Management Dashboard"
        )
        return TemplateResponse(request, "admin/analytics.html", context)

@admin.register(InventoryLog, site=admin_site)
class InventoryLogAdmin(admin.ModelAdmin):
    list_display = ('product', 'change_type', 'quantity_changed', 'previous_stock', 'new_stock', 'reason', 'created_at')
    list_filter = ('change_type', 'created_at', 'product')
    search_fields = ('product__name', 'reason')
    readonly_fields = ('product', 'change_type', 'quantity_changed', 'previous_stock', 'new_stock', 'reason', 'created_at')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(Notification, site=admin_site)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('message', 'is_read', 'order', 'created_at')
    list_filter = ('is_read', 'created_at')
    list_editable = ('is_read',)
    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(request, "Selected notifications marked as read.")
    mark_as_read.short_description = "Mark selected as read"
