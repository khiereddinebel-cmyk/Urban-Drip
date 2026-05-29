from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Brand(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    logo_image = models.ImageField(upload_to="brands/", null=True, blank=True)
    banner_image = models.ImageField(upload_to="brands/covers/", null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    banner_image = models.ImageField(upload_to="categories/covers/", null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to="products/", null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="products", null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products", null=True, blank=True)
    stock = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    low_stock_threshold = models.IntegerField(default=5)
    total_sales = models.IntegerField(default=0)
    total_views = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    trending_score = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ProductSize(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=10)
    cm = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} - Size {self.size}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/gallery/")
    alt_text = models.CharField(max_length=200, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"Image for {self.product.name} ({self.id})"

class HeroSlider(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="slider/")
    mobile_image = models.ImageField(upload_to="slider/mobile/", null=True, blank=True)
    button_text = models.CharField(max_length=50, blank=True, null=True)
    button_link = models.CharField(max_length=255, blank=True, null=True)
    active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class HomepageBanner(models.Model):
    title = models.CharField(max_length=200, blank=True, null=True)
    subtitle = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to="banners/")
    active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return self.title or f"Banner {self.id}"

# Retained for backwards compatibility if needed, or fallback
class Banner(models.Model):
    PAGE_CHOICES = [
        ("home", "Home"),
        ("brand", "Brand"),
        ("category", "Category"),
    ]
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to="banners/")
    link = models.CharField(max_length=255, blank=True, null=True)
    page = models.CharField(max_length=20, choices=PAGE_CHOICES, default="home")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default="Urban Drip")
    homepage_title = models.CharField(max_length=200, default="Urban Drip")
    homepage_subtitle = models.CharField(max_length=200, default="Exclusive Sneakers & Streetwear")
    logo = models.ImageField(upload_to="site/logo/", null=True, blank=True)
    favicon = models.ImageField(upload_to="site/favicon/", null=True, blank=True)
    footer_logo = models.ImageField(upload_to="site/logo/", null=True, blank=True)
    show_logo_text = models.BooleanField(default=False)
    maintenance_mode = models.BooleanField(default=False)
    maintenance_message = models.TextField(blank=True, null=True)
    support_email = models.EmailField(blank=True, null=True)
    support_phone = models.CharField(max_length=20, blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    tiktok_url = models.URLField(blank=True, null=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.site_name

class HomepageSection(models.Model):
    SECTION_TYPES = [
        ('latest_drops', 'Latest Drops'),
        ('featured', 'Featured'),
        ('most_viewed', 'Most Viewed'),
        ('trending', 'Trending'),
        ('manual_selection', 'Manual Selection'),
    ]
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    section_type = models.CharField(max_length=50, choices=SECTION_TYPES, default='manual_selection')
    products = models.ManyToManyField(Product, related_name="homepage_sections", blank=True)
    active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class CarouselImage(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    subtitle = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to="carousel/")
    button_text = models.CharField(max_length=50, blank=True, null=True)
    button_link = models.CharField(max_length=255, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title or f"Carousel Image {self.id}"

# Keep Wilaya and Baladiya tables in the database schema (hidden/unused in UI)
class Wilaya(models.Model):
    code = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self): 
        return f"{self.code} - {self.name}"

class Baladiya(models.Model):
    wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name='baladiyas')
    name = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self): 
        return f"{self.name} ({self.wilaya.name})"

class Order(models.Model):
    order_number = models.CharField(max_length=20, unique=True, blank=True)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    wilaya = models.CharField(max_length=100, blank=True, null=True)
    baladiya = models.CharField(max_length=100, blank=True, null=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    delivery_type = models.CharField(max_length=20, default='home')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, default="Pending")
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = f"UD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self): 
        return f"Order {self.order_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    size = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self): 
        return f"{self.quantity} x {self.product.name if self.product else 'N/A'}"
