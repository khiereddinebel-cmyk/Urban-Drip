from django.contrib import admin
from django.utils.html import format_html
from .models import Brand, Category, Product, ProductSize, CarouselImage, Banner, Order, OrderItem, Wilaya, Baladiya

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('logo_preview_list', 'name', 'title', 'active', 'display_order', 'is_active')
    list_editable = ('active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'title')
    
    readonly_fields = ('logo_preview', 'banner_preview', 'cover_preview', 'created_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'title', 'subtitle', 'description', 'active', 'display_order', 'created_at')
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

    def logo_preview_list(self, obj):
        if obj.logo_image:
            return format_html('<img src="{}" style="height: 35px; width: 35px; object-fit: contain; border-radius: 4px;" />', obj.logo_image.url)
        return "No Logo"
    logo_preview_list.short_description = "Logo"

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
    list_display = ('logo_preview_list', 'name', 'title', 'active', 'display_order', 'is_active')
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

    def logo_preview_list(self, obj):
        if obj.logo_image:
            return format_html('<img src="{}" style="height: 35px; width: 35px; object-fit: contain; border-radius: 4px;" />', obj.logo_image.url)
        return "No Logo"
    logo_preview_list.short_description = "Logo"

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
    list_display = ('image_preview', 'name', 'brand', 'category', 'price', 'stock', 'stock_indicator', 'featured', 'is_latest_drop', 'is_most_viewed', 'is_active')
    list_editable = ('price', 'stock', 'featured', 'is_latest_drop', 'is_most_viewed', 'is_active')
    list_filter = ('brand', 'category', 'featured', 'is_latest_drop', 'is_most_viewed', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    inlines = [ProductSizeInline]
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 40px; width: 40px; object-fit: contain; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Image"

    def stock_indicator(self, obj):
        if obj.stock < 5:
            color = '#e74c3c' # red
        elif obj.stock < 10:
            color = '#e67e22' # orange
        else:
            color = '#2ecc71' # green
        return format_html('<strong style="color: {};">● {}</strong>', color, obj.stock)
    stock_indicator.short_description = 'Stock Alert'
    stock_indicator.admin_order_field = 'stock'


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'page', 'is_active')
    list_editable = ('is_active',)
    list_filter = ('page', 'is_active')

@admin.register(CarouselImage)
class CarouselImageAdmin(admin.ModelAdmin):
    list_display = ('image_preview', 'title', 'subtitle', 'display_order', 'active')
    list_editable = ('display_order', 'active')
    readonly_fields = ('image_preview_detail',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 40px; width: 60px; object-fit: contain; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Image"

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 200px; max-width: 400px; object-fit: contain;" />', obj.image.url)
        return "No image uploaded"
    image_preview_detail.short_description = "Current Image Preview"


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'status', 'payment_status', 'total_price', 'created_at')
    list_editable = ('status', 'payment_status')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('order_number', 'id', 'customer_email', 'customer_phone')
    inlines = [OrderItemInline]
    readonly_fields = ('created_at', 'order_number')


# Wilaya and Baladiya models kept in database but hidden from admin sidebar
# admin.site.register(Wilaya)
# admin.site.register(Baladiya)

