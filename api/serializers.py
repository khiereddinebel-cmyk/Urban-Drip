from rest_framework import serializers
from .models import (
    Brand, Category, Product, ProductImage, HeroSlider,
    HomepageBanner, Banner, SiteSettings, HomepageSection,
    CarouselImage, Order, OrderItem
)

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'alt_text', 'display_order')

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
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

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
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
