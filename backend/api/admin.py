from django.contrib import admin
from django.utils.html import format_html
from .models import Brand, Category, Product, ProductSize, Banner, Order, OrderItem, Wilaya, Baladiya

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'active', 'display_order', 'is_active')
    list_editable = ('active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'title')
    
    readonly_fields = ('logo_preview', 'banner_preview', 'cover_preview')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'title', 'subtitle', 'description', 'active', 'display_order')
        }),
        ('BRAND LOGO', {
            'description': 'Small logo beside title on brand collection page (usually transparent PNG/WebP)',
            'fields': ('logo_image', 'logo_preview'),
        }),
        ('BRAND BANNER', {
            'description': 'Top hero image spanning full width on brand collection page',
            'fields': ('banner_image', 'banner_preview'),
        }),
        ('HOMEPAGE COVER IMAGE', {
            'description': 'Image representing this brand in the grid card on the homepage',
            'fields': ('cover_image', 'cover_preview'),
        }),
        ('Legacy / Backward Compatibility', {
            'classes': ('collapse',),
            'fields': ('logo', 'is_active'),
        }),
    )

    def logo_preview(self, obj):
        if obj.logo_image:
            return format_html('<img src="{}" style="max-height: 80px; max-width: 200px; object-fit: contain;" />', obj.logo_image.url)
        return "No logo uploaded"
    logo_preview.short_description = "Current Logo Preview"

    def banner_preview(self, obj):
        if obj.banner_image:
            return format_html('<img src="{}" style="max-height: 120px; max-width: 400px; object-fit: contain;" />', obj.banner_image.url)
        return "No banner uploaded"
    banner_preview.short_description = "Current Banner Preview"

    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="max-height: 120px; max-width: 200px; object-fit: contain;" />', obj.cover_image.url)
        return "No cover uploaded"
    cover_preview.short_description = "Current Cover Preview"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'active', 'display_order', 'is_active')
    list_editable = ('active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'title')
    
    readonly_fields = ('logo_preview', 'banner_preview', 'cover_preview')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'title', 'subtitle', 'description', 'active', 'display_order')
        }),
        ('CATEGORY LOGO', {
            'description': 'Small logo beside title on category collection page (usually transparent PNG/WebP)',
            'fields': ('logo_image', 'logo_preview'),
        }),
        ('CATEGORY BANNER', {
            'description': 'Top hero image spanning full width on category collection page',
            'fields': ('banner_image', 'banner_preview'),
        }),
        ('HOMEPAGE COVER IMAGE', {
            'description': 'Image representing this category in the grid card on the homepage',
            'fields': ('cover_image', 'cover_preview'),
        }),
        ('Legacy / Backward Compatibility', {
            'classes': ('collapse',),
            'fields': ('image', 'is_active'),
        }),
    )

    def logo_preview(self, obj):
        if obj.logo_image:
            return format_html('<img src="{}" style="max-height: 80px; max-width: 200px; object-fit: contain;" />', obj.logo_image.url)
        return "No logo uploaded"
    logo_preview.short_description = "Current Logo Preview"

    def banner_preview(self, obj):
        if obj.banner_image:
            return format_html('<img src="{}" style="max-height: 120px; max-width: 400px; object-fit: contain;" />', obj.banner_image.url)
        return "No banner uploaded"
    banner_preview.short_description = "Current Banner Preview"

    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="max-height: 120px; max-width: 200px; object-fit: contain;" />', obj.cover_image.url)
        return "No cover uploaded"
    cover_preview.short_description = "Current Cover Preview"

class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'stock', 'is_latest_drop', 'is_most_viewed', 'is_active')
    list_editable = ('price', 'stock', 'is_latest_drop', 'is_most_viewed', 'is_active')
    list_filter = ('brand', 'category', 'is_latest_drop', 'is_most_viewed', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    inlines = [ProductSizeInline]

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'page', 'is_active')
    list_editable = ('is_active',)
    list_filter = ('page', 'is_active')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]

# Wilaya and Baladiya models kept in database but hidden from admin sidebar
# admin.site.register(Wilaya)
# admin.site.register(Baladiya)

