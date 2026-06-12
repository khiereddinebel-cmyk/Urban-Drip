from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import Brand, Category, Product, ProductImage, ProductSize, CarouselImage, Banner, Order, OrderItem, Wilaya, Baladiya, BannerCTA

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

class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ('image_preview', 'name', 'brand', 'category', 'price', 'discount_price', 'stock', 'stock_indicator', 'featured', 'is_latest_drop', 'is_most_viewed', 'is_active')
    list_editable = ('price', 'discount_price', 'stock', 'featured', 'is_latest_drop', 'is_most_viewed', 'is_active')
    list_filter = ('brand', 'category', 'featured', 'is_latest_drop', 'is_most_viewed', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    inlines = [ProductImageInline, ProductSizeInline]
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

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
    list_display = ('title', 'page', 'is_active')
    list_editable = ('is_active',)
    list_filter = ('page', 'is_active')

    def changelist_view(self, request, extra_context=None):
        from .models import BannerCTA
        extra_context = extra_context or {}
        
        # Load or create singleton BannerCTA
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

