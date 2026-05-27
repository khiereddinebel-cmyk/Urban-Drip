from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BrandViewSet, CategoryViewSet, ProductViewSet, ProductImageViewSet,
    HeroSliderViewSet, HomepageBannerViewSet, BannerViewSet,
    SiteSettingsViewSet, HomepageSectionViewSet, CarouselImageViewSet,
    OrderViewSet
)

router = DefaultRouter()
router.register(r'brands', BrandViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'product-images', ProductImageViewSet)
router.register(r'hero-sliders', HeroSliderViewSet)
router.register(r'homepage-banners', HomepageBannerViewSet)
router.register(r'banners', BannerViewSet)
router.register(r'site-settings', SiteSettingsViewSet, basename='site-settings')
router.register(r'homepage-sections', HomepageSectionViewSet)
router.register(r'carousel', CarouselImageViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
