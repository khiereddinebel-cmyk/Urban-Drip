from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, ProductSize, CarouselImage, Order, OrderItem, Wilaya, Baladiya

class WilayaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wilaya
        fields = '__all__'

class BaladiyaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Baladiya
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image', 'is_main']

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['size', 'cm']

class CarouselImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselImage
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    category_name = serializers.SerializerMethodField()
    sizes = ProductSizeSerializer(many=True, read_only=True, source='variants')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'brand', 'brand_name', 'categories', 
            'category_name', 'description', 'price', 'old_price', 
            'sizes', 'is_exclusive', 'is_most_viewed', 
            'view_count', 'images', 'created_at'
        ]

    def get_category_name(self, obj):
        return ", ".join([c.name for c in obj.categories.all()]) or "Uncategorized"

class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'size', 'price', 'cost_price', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email', 
            'customer_phone', 'shipping_address', 'status', 
            'payment_status', 'total_items', 'total_price', 
            'created_at', 'items'
        ]
        read_only_fields = ['order_number', 'total_items', 'total_price']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        total_price = 0
        total_items = 0
        
        for item_data in items_data:
            item = OrderItem.objects.create(order=order, **item_data)
            total_price += item.subtotal
            total_items += item.quantity
            
        order.total_price = total_price
        order.total_items = total_items
        order.save()
        return order
