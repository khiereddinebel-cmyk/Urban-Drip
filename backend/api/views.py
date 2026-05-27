from rest_framework import viewsets
from rest_framework.response import Response
from .models import (
    Brand, Category, Product, ProductImage, HeroSlider,
    HomepageBanner, Banner, SiteSettings, HomepageSection,
    CarouselImage, Order
)
from .serializers import (
    BrandSerializer, CategorySerializer, ProductSerializer, ProductImageSerializer,
    HeroSliderSerializer, HomepageBannerSerializer, BannerSerializer,
    SiteSettingsSerializer, HomepageSectionSerializer, CarouselImageSerializer,
    OrderSerializer
)

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.filter(active=True).order_by('display_order')
    serializer_class = BrandSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(active=True).order_by('display_order')
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).order_by('-created_at')
        brand = self.request.query_params.get('brand')
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        
        if brand:
            queryset = queryset.filter(brand__slug=brand)
        if category:
            queryset = queryset.filter(category__slug=category)
        if featured is not None:
            is_featured = featured.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(featured=is_featured)
            
        return queryset

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all().order_by('display_order')
    serializer_class = ProductImageSerializer

class HeroSliderViewSet(viewsets.ModelViewSet):
    queryset = HeroSlider.objects.filter(active=True).order_by('display_order')
    serializer_class = HeroSliderSerializer

class HomepageBannerViewSet(viewsets.ModelViewSet):
    queryset = HomepageBanner.objects.filter(active=True).order_by('display_order')
    serializer_class = HomepageBannerSerializer

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(is_active=True)
    serializer_class = BannerSerializer

    def get_queryset(self):
        queryset = Banner.objects.filter(is_active=True)
        page = self.request.query_params.get('page')
        if page:
            queryset = queryset.filter(page=page)
        return queryset

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer

    # Helper method to make fetching the active settings easier
    def list(self, request, *args, **kwargs):
        settings_obj = SiteSettings.objects.first()
        if not settings_obj:
            # Create a default instance if none exists
            settings_obj = SiteSettings.objects.create(
                site_name="Urban Drip",
                homepage_title="Urban Drip",
                homepage_subtitle="Exclusive Sneakers & Streetwear"
            )
        serializer = self.get_serializer(settings_obj)
        return Response(serializer.data)

class HomepageSectionViewSet(viewsets.ModelViewSet):
    queryset = HomepageSection.objects.filter(active=True).order_by('display_order')
    serializer_class = HomepageSectionSerializer

    def get_queryset(self):
        queryset = HomepageSection.objects.filter(active=True).order_by('display_order')
        slug = self.request.query_params.get('slug')
        if slug:
            queryset = queryset.filter(slug=slug)
        return queryset

class CarouselImageViewSet(viewsets.ModelViewSet):
    queryset = CarouselImage.objects.filter(active=True).order_by('display_order')
    serializer_class = CarouselImageSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
