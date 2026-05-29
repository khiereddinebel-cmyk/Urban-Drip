from rest_framework import serializers
from .models import (
    Brand, Category, Product, ProductImage, ProductSize, HeroSlider,
    HomepageBanner, Banner, SiteSettings, HomepageSection,
    CarouselImage, Order, OrderItem, Wilaya, Baladiya
)

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'alt_text', 'display_order')

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ('id', 'size', 'cm')

class WilayaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wilaya
        fields = '__all__'

class BaladiyaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Baladiya
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    banner = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = '__all__'

    def get_logo(self, obj):
        if not obj.logo_image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.logo_image.url)
        return obj.logo_image.url

    def get_cover_image(self, obj):
        if not obj.banner_image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.banner_image.url)
        return obj.banner_image.url

    def get_banner(self, obj):
        return self.get_cover_image(obj)

class CategorySerializer(serializers.ModelSerializer):
    banner = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_banner(self, obj):
        if not obj.banner_image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.banner_image.url)
        return obj.banner_image.url

class ProductSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    main_image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    sizes = ProductSizeSerializer(many=True, read_only=True, source='variants')
    
    class Meta:
        model = Product
        fields = '__all__'

    def get_main_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_images(self, obj):
        request = self.context.get('request')
        urls = []
        for img in obj.images.all().order_by('display_order', 'id'):
            if img.image:
                url = img.image.url
                if request:
                    url = request.build_absolute_uri(url)
                urls.append(url)
        return urls

class HeroSliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlider
        fields = '__all__'

class HomepageBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageBanner
        fields = '__all__'

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class HomepageSectionSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = HomepageSection
        fields = '__all__'

class CarouselImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselImage
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'quantity', 'price', 'size')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
