from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone


class Wilaya(models.Model):
    code = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Baladiya(models.Model):
    wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name='baladiyas')
    name = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.wilaya.name})"


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    banner = models.ImageField(upload_to="category_banners/", null=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to="brands/", null=True, blank=True)
    cover_image = models.ImageField(upload_to="brands/covers/", null=True, blank=True)
    banner = models.ImageField(upload_to="brand_banners/", null=True, blank=True)

    def __str__(self):
        return self.name


class CarouselImage(models.Model):
    title = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to="carousel/")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title or f"Carousel Image {self.id}"


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=50, unique=True, null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="products")
    # Change category to ManyToManyField to allow multiple categories (e.g. Nike + Latest Drops)
    categories = models.ManyToManyField(
        Category, related_name="all_products", blank=True
    )
    # Temporary field for data migration
    old_category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="old_products", blank=True
    )
    description = models.TextField()

    # Pricing and Inventory
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    # Keeping 'price' for backward compatibility or using selling_price instead?
    # Let's keep 'price' field as selling_price used in frontend but update it in admin
    price = models.DecimalField(
        max_digits=10, decimal_places=2
    )  # This is the selling price
    old_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    stock_quantity = models.PositiveIntegerField(default=0)

    # Ownership
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="created_products")

    is_exclusive = models.BooleanField(default=False)
    is_most_viewed = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def product_profit(self):
        return self.price - self.cost_price

    @property
    def inventory_value(self):
        return self.cost_price * self.stock_quantity

    def __str__(self):
        return self.name


class ProductSize(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=10)
    cm = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"{self.size} ({self.cm} cm)"


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="products/")
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.product.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Processing", "Processing"),
        ("Assigned", "Assigned"),
        ("Shipped", "Shipped"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("Unpaid", "Unpaid"),
        ("Paid", "Paid"),
        ("Refunded", "Refunded"),
    ]

    order_number = models.CharField(max_length=20, unique=True, blank=True)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()

    # Link to User for security
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default="Unpaid"
    )

    total_items = models.PositiveIntegerField(default=0)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    order_profit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate a unique order number like ORD-YYYYMMDD-XXXX
            date_part = timezone.now().strftime("%Y%m%d")
            import random

            random_part = random.randint(1000, 9999)
            self.order_number = f"ORD-{date_part}-{random_part}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number}"

    class Meta:
        ordering = ["-created_at"]


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    size = models.CharField(max_length=20, null=True, blank=True)
    price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )  # Selling price at time of order
    cost_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )  # Cost price at time of order

    @property
    def subtotal(self):
        if self.price is not None and self.quantity is not None:
            return self.price * self.quantity
        return 0

    @property
    def profit(self):
        if (
            self.price is not None
            and self.cost_price is not None
            and self.quantity is not None
        ):
            return (self.price - self.cost_price) * self.quantity
        return 0

    def save(self, *args, **kwargs):
        if self.product:
            if self.price is None:
                self.price = self.product.price
            if self.cost_price is None:
                self.cost_price = self.product.cost_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name if self.product else 'Unknown Product'}"


class InventoryLog(models.Model):
    CHANGE_TYPES = [
        ("SALE", "Sale"),
        ("RESTOCK", "Restock"),
        ("MANUAL", "Manual Adjustment"),
    ]
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="inventory_logs"
    )
    change_type = models.CharField(max_length=20, choices=CHANGE_TYPES)
    quantity_changed = models.IntegerField()  # Negative for sales, positive for restock
    previous_stock = models.PositiveIntegerField()
    new_stock = models.PositiveIntegerField()
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} ({self.change_type}: {self.quantity_changed}) at {self.created_at}"


class Notification(models.Model):
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

    class Meta:
        ordering = ["-created_at"]
