from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import (
    Brand, Category, Product, ProductImage, ProductSize, HeroSlider,
    HomepageBanner, Banner, SiteSettings, HomepageSection,
    CarouselImage, Order, OrderItem, BannerCTA
)

class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

class MultipleImageField(forms.ImageField):
    def clean(self, data, initial=None):
        if isinstance(data, (list, tuple)):
            if not data:
                return super().clean(None, initial)
            # Validate each image file individually to make sure all are valid images
            cleaned_data = [super(MultipleImageField, self).clean(d, initial) for d in data]
            # Return the first one (for the model's single image field)
            return cleaned_data[0]
        return super().clean(data, initial)

class ProductAdminForm(forms.ModelForm):
    image = MultipleImageField(
        widget=MultipleFileInput(attrs={'multiple': True}),
        required=False,
        label="Image / Gallery Upload",
        help_text="Upload one or multiple images at the same time. The first image will be set as the main cover image, and the rest will be added to the product gallery."
    )

    class Meta:
        model = Product
        fields = '__all__'

# Inline for Product Gallery images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'image_preview', 'alt_text', 'display_order')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 80px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Preview"

# Inline for Product Sizes
class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 3
    fields = ('size', 'cm')

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'logo_preview', 'banner_preview', 'active', 'display_order')
    list_editable = ('active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    readonly_fields = ('logo_preview_detail', 'banner_preview_detail')

    def logo_preview(self, obj):
        if obj and obj.logo_image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.logo_image.url)
        return "-"
    logo_preview.short_description = "Logo"

    def banner_preview(self, obj):
        if obj and obj.banner_image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.banner_image.url)
        return "-"
    banner_preview.short_description = "Banner"

    def logo_preview_detail(self, obj):
        if obj and obj.logo_image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.logo_image.url)
        return "No Image"
    logo_preview_detail.short_description = "Logo Preview"

    def banner_preview_detail(self, obj):
        if obj and obj.banner_image:
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
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Image"

    def banner_preview(self, obj):
        if obj and obj.banner_image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.banner_image.url)
        return "-"
    banner_preview.short_description = "Banner"

    def image_preview_detail(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    image_preview_detail.short_description = "Image Preview"

    def banner_preview_detail(self, obj):
        if obj and obj.banner_image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.banner_image.url)
        return "No Image"
    banner_preview_detail.short_description = "Banner Preview"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ('name', 'brand', 'category', 'price', 'stock_badge', 'total_sales', 'total_views', 'featured', 'is_active')
    list_editable = ('price', 'featured', 'is_active')
    list_filter = ('brand', 'category', 'featured', 'is_active')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductSizeInline]
    readonly_fields = ('total_sales', 'total_views', 'image_preview')

    def save_model(self, request, obj, form, change):
        files = request.FILES.getlist('image')
        if files:
            obj.image = files[0]
        super().save_model(request, obj, form, change)
        
        # Save subsequent files to gallery
        if len(files) > 1:
            for i, file in enumerate(files[1:], start=1):
                ProductImage.objects.create(
                    product=obj,
                    image=file,
                    display_order=i
                )

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
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Cover Image"
    image_preview.short_description = "Cover Preview"

    def stock_badge(self, obj):
        if not obj:
            return "-"
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
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    slide_preview.short_description = "Slide Preview"

    def slide_preview_detail(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    slide_preview_detail.short_description = "Preview"

@admin.register(HomepageBanner)
class HomepageBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'banner_preview', 'active', 'display_order')
    list_editable = ('active', 'display_order')
    readonly_fields = ('banner_preview_detail',)

    def banner_preview(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    banner_preview.short_description = "Preview"

    def banner_preview_detail(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    banner_preview_detail.short_description = "Preview"

class BannerCTAForm(forms.ModelForm):
    internal_link_page = forms.MultipleChoiceField(
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'internal-link-checkbox'}),
        required=False,
        label="Internal Link Page",
        help_text="Select an internal URL from the list of available pages. The button will link to the selected URL. The 'Button Link' is independent of the button text. Only one selection can be active."
    )

    field_order = ['button_text', 'internal_link_page', 'button_link']

    class Meta:
        model = BannerCTA
        fields = ('button_text', 'button_link')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        choices = [
            ('/latest-drops', '/latest-drops'),
            ('/most-viewed', '/most-viewed'),
        ]
        try:
            from .models import Brand
            for b in Brand.objects.all().order_by('name'):
                choices.append((f'/brand/{b.slug}', f'/brand/{b.slug}'))
        except Exception:
            pass

        try:
            from .models import Category
            for c in Category.objects.all().order_by('name'):
                choices.append((f'/category/{c.slug}', f'/category/{c.slug}'))
        except Exception:
            pass

        self.fields['internal_link_page'].choices = choices

        if self.instance and self.instance.pk and self.instance.button_link:
            val = self.instance.button_link
            if val != '/' and val.endswith('/'):
                val = val[:-1]
            choices_vals = [c[0] for c in choices]
            if val in choices_vals:
                self.initial['internal_link_page'] = [val]

    def clean(self):
        cleaned_data = super().clean()
        internal_link_pages = cleaned_data.get('internal_link_page')
        if internal_link_pages:
            if len(internal_link_pages) > 1:
                raise forms.ValidationError("Only one selection can be active.")
            link = internal_link_pages[0]
            if link != '/' and link.endswith('/'):
                link = link[:-1]
            cleaned_data['button_link'] = link
        else:
            button_link = cleaned_data.get('button_link')
            if button_link and button_link != '/' and button_link.endswith('/'):
                cleaned_data['button_link'] = button_link[:-1]
        return cleaned_data

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'page', 'image_preview', 'is_active')
    list_editable = ('is_active',)
    list_filter = ('page', 'is_active')
    readonly_fields = ('image_preview_detail',)

    def image_preview(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"

    def image_preview_detail(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    image_preview_detail.short_description = "Preview"

    def changelist_view(self, request, extra_context=None):
        from .models import BannerCTA
        extra_context = extra_context or {}
        cta_obj, created = BannerCTA.objects.get_or_create(id=1)
        
        if request.method == "POST" and request.POST.get('save_cta') == '1':
            cta_form = BannerCTAForm(request.POST, instance=cta_obj)
            if cta_form.is_valid():
                cta_form.save()
                from django.contrib import messages
                messages.success(request, "Banner Call to Action saved successfully.")
                from django.shortcuts import redirect
                return redirect(request.path)
        else:
            cta_form = BannerCTAForm(instance=cta_obj)
            
        extra_context['cta_form'] = cta_form
        return super().changelist_view(request, extra_context=extra_context)

    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        from .models import BannerCTA
        extra_context = extra_context or {}
        cta_obj, created = BannerCTA.objects.get_or_create(id=1)
        
        if request.method == "POST" and request.POST.get('save_cta') == '1':
            cta_form = BannerCTAForm(request.POST, instance=cta_obj)
            if cta_form.is_valid():
                cta_form.save()
                from django.contrib import messages
                messages.success(request, "Banner Call to Action saved successfully.")
                from django.shortcuts import redirect
                return redirect(request.path)
        else:
            cta_form = BannerCTAForm(instance=cta_obj)
            
        extra_context['cta_form'] = cta_form
        return super().changeform_view(request, object_id, form_url, extra_context)

    class Media:
        js = ('admin/js/banner_cta.js',)

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
        if obj and obj.logo:
            return format_html('<img src="{}" style="max-height: 80px; width: auto; border-radius: 4px;" />', obj.logo.url)
        return "No Logo Uploaded"
    logo_preview.short_description = "Logo Preview"

    def favicon_preview(self, obj):
        if obj and obj.favicon:
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
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 2px;" />', obj.image.url)
        return "-"
    carousel_preview.short_description = "Preview"

    def carousel_preview_detail(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-height: 150px; width: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"
    carousel_preview_detail.short_description = "Preview"

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ('product', 'size', 'quantity', 'price')
    readonly_fields = ('product', 'size', 'quantity', 'price')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'wilaya', 'baladiya', 'delivery_type', 'delivery_fee', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at', 'wilaya')
    inlines = [OrderItemInline]
    readonly_fields = ('order_number', 'created_at')
    fieldsets = (
        ('Customer Info', {
            'fields': ('customer_name', 'customer_email', 'customer_phone', 'user')
        }),
        ('Shipping & Location', {
            'fields': ('shipping_address', 'wilaya', 'baladiya', 'delivery_type', 'delivery_fee')
        }),
        ('Order Status & Price', {
            'fields': ('order_number', 'status', 'total_price', 'created_at')
        }),
    )
