from rest_framework import serializers
from .models import (
    Brand, Category, Product, ProductImage, ProductSize, HeroSlider,
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
        if not obj.cover_image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image.url

    def get_banner(self, obj):
        if not obj.banner_image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.banner_image.url)
        return obj.banner_image.url

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

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ('id', 'size_eu', 'size_cm', 'stock')

class ProductSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    main_image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    sizes = ProductSizeSerializer(many=True, read_only=True)
    
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
    button_text = serializers.SerializerMethodField()
    button_link = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ('id', 'title', 'image', 'link', 'page', 'is_active', 'button_text', 'button_link')

    def get_button_text(self, obj):
        from .models import BannerCTA
        cta = BannerCTA.objects.first()
        return cta.button_text if (cta and cta.button_text) else "EXPLORE NEW RELEASES"

    def get_button_link(self, obj):
        from .models import BannerCTA
        cta = BannerCTA.objects.first()
        link = cta.button_link if (cta and cta.button_link) else "/latest-drops"
        if link and link != '/' and link.endswith('/'):
            link = link[:-1]
        return link

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

    def validate(self, attrs):
        # Step 2: Validate required fields are present and not empty
        required_fields = ['customer_name', 'customer_phone', 'shipping_address', 'wilaya', 'baladiya', 'delivery_type']
        for field in required_fields:
            if not attrs.get(field):
                raise serializers.ValidationError({field: f"Le champ {field} est requis. / Field {field} is required."})

        items_data = attrs.get('items', [])
        if not items_data:
            raise serializers.ValidationError({"items": "Order must contain at least one item."})
            
        for idx, item in enumerate(items_data):
            product = item.get('product')
            quantity = item.get('quantity', 1)
            
            if not product:
                raise serializers.ValidationError({"items": f"Invalid product at index {idx}."})
            if not product.is_active:
                raise serializers.ValidationError({"items": f"Product '{product.name}' is no longer active."})
            if quantity <= 0:
                raise serializers.ValidationError({"items": f"Invalid quantity for '{product.name}'."})
                
        return attrs

    def create(self, validated_data):
        from django.db import transaction
        from .models import Product

        # Step 8: Use transactions to reduce stock and prevent overselling
        with transaction.atomic():
            items_data = validated_data.pop('items')
            order = Order.objects.create(**validated_data)
            
            for item_data in items_data:
                product = item_data['product']
                quantity = item_data['quantity']
                
                # Lock product row to prevent race conditions
                prod_lock = Product.objects.select_for_update().get(pk=product.pk)
                
                if prod_lock.stock < quantity:
                    raise serializers.ValidationError(
                        f"Stock insuffisant pour '{product.name}' (Demandé: {quantity}, Disponible: {prod_lock.stock})."
                    )
                    
                prod_lock.stock -= quantity
                prod_lock.save()
                
                OrderItem.objects.create(order=order, **item_data)
            
        # Trigger notifications safely post-save
        try:
            from .services.notifications import send_order_notifications
            send_order_notifications(order)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error calling send_order_notifications in OrderSerializer: {e}")
            
        return order
