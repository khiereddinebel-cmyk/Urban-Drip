from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, BrandViewSet, ProductViewSet, CarouselImageViewSet, OrderViewSet, WilayaViewSet, BaladiyaViewSet, register_user, login_user

router = DefaultRouter()
router.register(r'wilayas', WilayaViewSet)
router.register(r'baladiyas', BaladiyaViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'products', ProductViewSet)
router.register(r'carousel-images', CarouselImageViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
]
