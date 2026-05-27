from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Brand, Category, Product, ProductImage, HeroSlider,
    HomepageBanner, Banner, SiteSettings, HomepageSection,
    CarouselImage, Order, OrderItem
)

# Inline for Product Gallery images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'image_preview', 'alt_text', 'display_order')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Preview"

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'logo_preview', 'banner_preview', 'active', 'display_order')
    list_editable = ('active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    readonly_fields = ('logo_preview_detail', 'banner_preview_detail')

    def logo_preview(self, obj):
        if obj.logo_image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.logo_image.url)
        return "-"
    logo_preview.short_description = "Logo"

    def banner_preview(self, obj):
        if obj.banner_image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.banner_image.url)
        return "-"
    banner_preview.short_description = "Banner"

    def logo_preview_detail(self, obj):
        if obj.logo_image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.logo_image.url)
        return "No Image"
    logo_preview_detail.short_description = "Logo Preview"

    def banner_preview_detail(self, obj):
        if obj.banner_image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.banner_image.url)
        return "No Image"
    banner_preview_detail.short_description = "Banner Preview"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'image_preview', 'banner_preview', 'active', 'display_order')
    list_editable = ('active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    readonly_fields = ('image_preview_detail', 'banner_preview_detail')

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Image"

    def banner_preview(self, obj):
        if obj.banner_image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.banner_image.url)
        return "-"
    banner_preview.short_description = "Banner"

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    image_preview_detail.short_description = "Image Preview"

    def banner_preview_detail(self, obj):
        if obj.banner_image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.banner_image.url)
        return "No Image"
    banner_preview_detail.short_description = "Banner Preview"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'stock_badge', 'total_sales', 'total_views', 'featured', 'is_active')
    list_editable = ('price', 'featured', 'is_active')
    list_filter = ('brand', 'category', 'featured', 'is_active')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    readonly_fields = ('total_sales', 'total_views', 'image_preview')
    fieldsets = (
        ('General Details', {
            'fields': ('name', 'slug', 'description', 'price', 'is_active')
        }),
        ('Categorization', {
            'fields': ('brand', 'category')
        }),
        ('Inventory Control', {
            'fields': ('stock', 'low_stock_threshold')
        }),
        ('Cover Image', {
            'fields': ('image', 'image_preview')
        }),
        ('Metrics & Analytics', {
            'fields': ('featured', 'trending_score', 'total_sales', 'total_views')
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Cover Image"
    image_preview.short_description = "Cover Preview"

    def stock_badge(self, obj):
        if obj.stock <= 0:
            return format_html('<span style="color: #e74c3c; font-weight: bold; background: #fadbd8; padding: 4px 8px; border-radius: 4px;">OUT OF STOCK</span>')
        elif obj.stock <= obj.low_stock_threshold:
            return format_html('<span style="color: #e67e22; font-weight: bold; background: #fdebd0; padding: 4px 8px; border-radius: 4px;">LOW STOCK ({})</span>', obj.stock)
        return format_html('<span style="color: #27ae60; font-weight: bold; background: #d4efdf; padding: 4px 8px; border-radius: 4px;">IN STOCK ({})</span>', obj.stock)
    stock_badge.short_description = "Inventory Status"

@admin.register(HeroSlider)
class HeroSliderAdmin(admin.ModelAdmin):
    list_display = ('title', 'slide_preview', 'active', 'display_order', 'created_at')
    list_editable = ('active', 'display_order')
    readonly_fields = ('slide_preview_detail',)

    def slide_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    slide_preview.short_description = "Slide Preview"

    def slide_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    slide_preview_detail.short_description = "Preview"

@admin.register(HomepageBanner)
class HomepageBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'banner_preview', 'active', 'display_order')
    list_editable = ('active', 'display_order')
    readonly_fields = ('banner_preview_detail',)

    def banner_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    banner_preview.short_description = "Preview"

    def banner_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    banner_preview_detail.short_description = "Preview"

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'homepage_title', 'show_logo_text', 'maintenance_mode')
    readonly_fields = ('logo_preview', 'favicon_preview')
    fieldsets = (
        ('Identity & Branding', {
            'fields': ('site_name', 'logo', 'logo_preview', 'favicon', 'favicon_preview', 'footer_logo', 'show_logo_text')
        }),
        ('SEO Metadata', {
            'fields': ('homepage_title', 'homepage_subtitle')
        }),
        ('Support & Socials', {
            'fields': ('support_email', 'support_phone', 'instagram_url', 'facebook_url', 'tiktok_url')
        }),
        ('Maintenance Mode', {
            'fields': ('maintenance_mode', 'maintenance_message')
        }),
    )

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height: 80px; width: auto; border-radius: 4px;" />', obj.logo.url)
        return "No Logo Uploaded"
    logo_preview.short_description = "Logo Preview"

    def favicon_preview(self, obj):
        if obj.favicon:
            return format_html('<img src="{}" style="max-height: 32px; width: auto;" />', obj.favicon.url)
        return "No Favicon Uploaded"
    favicon_preview.short_description = "Favicon Preview"

    # Restriction to keep it a singleton
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(HomepageSection)
class HomepageSectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'section_type', 'active', 'display_order', 'product_count')
    list_editable = ('active', 'display_order')
    filter_horizontal = ('products',)

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = "Products Linked"

@admin.register(CarouselImage)
class CarouselImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'carousel_preview', 'active', 'display_order')
    list_editable = ('active', 'display_order')
    readonly_fields = ('carousel_preview_detail',)

    def carousel_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    carousel_preview.short_description = "Preview"

    def carousel_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    carousel_preview_detail.short_description = "Preview"

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]
    readonly_fields = ('order_number', 'created_at')
