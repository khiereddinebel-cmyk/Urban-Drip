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
    queryset = Brand.objects.filter(active=True).order_by('display_order', 'name')
    serializer_class = BrandSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(active=True).order_by('display_order', 'name')
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).order_by('-created_at')
        brand = self.request.query_params.get('brand')
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        latest_drops = self.request.query_params.get('latest_drops')
        most_viewed = self.request.query_params.get('most_viewed')
        
        if brand:
            queryset = queryset.filter(brand__slug=brand)
        if category:
            queryset = queryset.filter(category__slug=category)
        if featured is not None:
            is_featured = featured.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(featured=is_featured)
        if latest_drops and latest_drops.lower() == 'true':
            queryset = queryset.filter(is_latest_drop=True)
        if most_viewed and most_viewed.lower() == 'true':
            queryset = queryset.filter(is_most_viewed=True)
            
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

    def initialize_request(self, request, *args, **kwargs):
        self.request_method = request.method
        return super().initialize_request(request, *args, **kwargs)

    def get_permissions(self):
        from rest_framework.permissions import AllowAny
        if self.action == 'create':
            return [AllowAny()]
        from rest_framework.permissions import IsAdminUser
        return [IsAdminUser()]

    def get_authenticators(self):
        method = getattr(self, 'request_method', None)
        if method == 'POST':
            # Bypass session authentication and CSRF checks for public order submission
            return []
        from rest_framework.authentication import TokenAuthentication
        return [TokenAuthentication()]

    def create(self, request, *args, **kwargs):
        import logging
        from rest_framework import serializers
        logger = logging.getLogger(__name__)
        logger.info(f"Incoming checkout request. Payload: {request.data}")
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Checkout validation failed: {serializer.errors}")
            error_msgs = []
            for field, errors in serializer.errors.items():
                if isinstance(errors, list):
                    error_msgs.append(f"{field}: {' '.join([str(e) for e in errors])}")
                else:
                    error_msgs.append(f"{field}: {errors}")
            error_reason = "; ".join(error_msgs)
            return Response({"success": False, "error": error_reason}, status=400)
            
        try:
            order = serializer.save()
            response_serializer = self.get_serializer(order)
            data = response_serializer.data
            data["success"] = True
            logger.info(f"Checkout successful. Order details: {data}")
            return Response(data, status=201)
        except serializers.ValidationError as e:
            error_detail = e.detail
            if isinstance(error_detail, dict):
                error_msgs = []
                for field, errors in error_detail.items():
                    if isinstance(errors, list):
                        error_msgs.append(f"{field}: {' '.join([str(e) for e in errors])}")
                    else:
                        error_msgs.append(f"{field}: {errors}")
                error_reason = "; ".join(error_msgs)
            elif isinstance(error_detail, list):
                error_reason = " ".join([str(x) for x in error_detail])
            else:
                error_reason = str(error_detail)
            logger.error(f"Checkout validation failed during save: {error_reason}")
            return Response({"success": False, "error": error_reason}, status=400)
        except Exception as e:
            logger.exception(f"Checkout exception occurred during order saving: {e}")
            return Response({"success": False, "error": str(e)}, status=500)

import os
from django.http import JsonResponse
from django.conf import settings

def inspect_media(request):
    media_root = settings.MEDIA_ROOT
    files_list = []
    if os.path.exists(media_root):
        for root, dirs, files in os.walk(media_root):
            for file in files:
                rel_path = os.path.relpath(os.path.join(root, file), media_root)
                files_list.append(rel_path)
    return JsonResponse({
        'media_root': str(media_root),
        'exists': os.path.exists(media_root),
        'files': files_list,
        'base_dir': str(settings.BASE_DIR),
        'cwd': os.getcwd(),
    })
