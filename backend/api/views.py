from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Category, Brand, Product, CarouselImage, Order, Wilaya, Baladiya
from .serializers import CategorySerializer, BrandSerializer, ProductSerializer, CarouselImageSerializer, OrderSerializer, WilayaSerializer, BaladiyaSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('email') # Use email as username
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'email': user.email
        }
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email
            }
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class WilayaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Wilaya.objects.all().order_by('code')
    serializer_class = WilayaSerializer

class BaladiyaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Baladiya.objects.all().order_by('name')
    serializer_class = BaladiyaSerializer
    
    def get_queryset(self):
        queryset = Baladiya.objects.all()
        wilaya_code = self.request.query_params.get('wilaya_code')
        if wilaya_code:
            queryset = queryset.filter(wilaya__code=wilaya_code)
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.all()
        slug = self.request.query_params.get('slug')
        if slug:
            queryset = queryset.filter(slug=slug)
        return queryset

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

    def get_queryset(self):
        queryset = Brand.objects.all()
        slug = self.request.query_params.get('slug')
        if slug:
            queryset = queryset.filter(slug=slug)
        return queryset

class CarouselImageViewSet(viewsets.ModelViewSet):
    queryset = CarouselImage.objects.filter(is_active=True)
    serializer_class = CarouselImageSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all().prefetch_related('categories', 'images', 'variants')
        category_slug = self.request.query_params.get('category')
        brand_slug = self.request.query_params.get('brand')
        is_exclusive = self.request.query_params.get('exclusive')
        is_most_viewed = self.request.query_params.get('most_viewed')

        if category_slug:
            queryset = queryset.filter(categories__slug=category_slug)
        if brand_slug:
            queryset = queryset.filter(brand__slug=brand_slug)
        
        from django.db.models import Q
        if is_exclusive:
            queryset = queryset.filter(Q(is_exclusive=True) | Q(categories__slug='latest-drops')).distinct()
        if is_most_viewed:
            queryset = queryset.filter(Q(is_most_viewed=True) | Q(categories__slug='most-viewed')).distinct()
            
        return queryset

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admin can see all orders, normal users only see their own
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        # Securely attach the active session user as the strict owner of the order bypassable by UI
        serializer.save(user=self.request.user)

