from rest_framework import viewsets
from .models import Brand, Category, Product, Banner, Order
from .serializers import BrandSerializer, CategorySerializer, ProductSerializer, BannerSerializer, OrderSerializer

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        brand = self.request.query_params.get('brand')
        category = self.request.query_params.get('category')
        if brand:
            queryset = queryset.filter(brand__slug=brand)
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(is_active=True)
    serializer_class = BannerSerializer

    def get_queryset(self):
        queryset = Banner.objects.filter(is_active=True)
        page = self.request.query_params.get('page')
        if page:
            queryset = queryset.filter(page=page)
        return queryset

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
