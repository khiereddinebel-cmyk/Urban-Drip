import os
import sys
import shutil
import django
from django.core.files import File

print("--- STARTING TEST DATA SETUP SCRIPT ---")

# 1. Setup paths so the script can find 'api' and 'core'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# 2. Configure Django Settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# 3. Initialize Django
try:
    django.setup()
except Exception as e:
    print(f"Error initializing Django: {e}")
    sys.exit(1)

from api.models import Category, Brand, Product, ProductImage, CarouselImage

def get_file_path(filename):
    """Returns the absolute path of an image in public/images"""
    # Assuming the project structure is:
    # urban-drip/
    #   backend/
    #     test_data_setup.py
    #   public/
    #     images/
    public_images_dir = os.path.join(os.path.dirname(BASE_DIR), 'public', 'images')
    path = os.path.join(public_images_dir, filename)
    if os.path.exists(path):
        return path
    
    # Check in banners subfolder
    banner_path = os.path.join(public_images_dir, 'banners', filename)
    if os.path.exists(banner_path):
        return banner_path
        
    return None

def save_image_to_field(instance, field_name, filename):
    """Copies a file from public/images to media/ and saves it to the model field"""
    if not filename:
        return
        
    file_path = get_file_path(filename)
    if not file_path:
        print(f"Warning: File {filename} not found in public/images")
        return

    # Open the file and save it to the field
    with open(file_path, 'rb') as f:
        getattr(instance, field_name).save(filename, File(f), save=True)

def setup_initial_data():
    """
    Populates the database with the 'perfect' version data.
    """
    print("Restoring 'perfect' version data...")

    # 1. Create Categories
    categories_data = [
        {"name": "Men", "slug": "men", "banner": "MEN COLLECTION.png"},
        {"name": "Women", "slug": "women", "banner": "Women collection.png"},
        {"name": "Kids", "slug": "kids", "banner": "kids.png"},
        {"name": "Accessories", "slug": "accessories", "banner": "ACC.png"},
    ]

    for cat_info in categories_data:
        cat, created = Category.objects.get_or_create(slug=cat_info['slug'], defaults={'name': cat_info['name']})
        if cat_info.get('banner'):
            save_image_to_field(cat, 'banner', cat_info['banner'])
        print(f"{'Created' if created else 'Updated'} Category: {cat.name}")

    # 2. Brands
    # Animation images are used as covers
    brands_data = [
        {"name": "Nike", "slug": "nike", "logo": "nike.png", "cover": "nike.png", "banner": "nike-banner.jpg"},
        {"name": "Adidas", "slug": "adidas", "logo": "adidas.png", "cover": "adidas.png", "banner": "adidas-collection-hero.png"},
        {"name": "Jordan", "slug": "jordan", "logo": "jordan.png", "cover": "jordan.png", "banner": "jordan_hero_banner.png"},
        {"name": "New Balance", "slug": "new-balance", "logo": "new-balance.png", "cover": "new-balance.png", "banner": "new balance hero banner.webp"},
        {"name": "Asics", "slug": "asics", "logo": "asics.png", "cover": "asics.png", "banner": "ASICS HERO BANNER.png"},
        {"name": "Puma", "slug": "puma", "logo": "puma.png", "cover": "puma.png", "banner": "puma-v2.png"},
        {"name": "Vans®", "slug": "vans", "logo": "vans logo.webp", "cover": "VANS.jpg", "banner": "vans baannner.png"},
        {"name": "UGG", "slug": "ugg", "logo": "ugg.png", "cover": "ugg.png", "banner": "ugg.png"},
        {"name": "Onitsuka Tiger", "slug": "onitsuka-tiger", "logo": "onitsuka-tiger.png", "cover": "onitsuka-tiger.png", "banner": "Onitsuka-Tiger-Banner-1024x536.png"},
    ]

    for brand_info in brands_data:
        brand, created = Brand.objects.get_or_create(slug=brand_info['slug'], defaults={'name': brand_info['name']})
        if brand_info.get('logo'): save_image_to_field(brand, 'logo', brand_info['logo'])
        if brand_info.get('cover'): save_image_to_field(brand, 'cover_image', brand_info['cover'])
        if brand_info.get('banner'): save_image_to_field(brand, 'banner', brand_info['banner'])
        print(f"{'Registered' if created else 'Updated'} Brand: {brand.name}")

    # 3. Carousel Images
    carousel_data = [
        {"title": "Store View 1", "image": "store-carousel-1.png", "order": 1},
        {"title": "Store View 2", "image": "store-carousel-2.png", "order": 2},
        {"title": "Store View 3", "image": "store-carousel-3.png", "order": 3},
    ]

    for img_info in carousel_data:
        carousel, created = CarouselImage.objects.get_or_create(title=img_info['title'], defaults={'display_order': img_info['order']})
        save_image_to_field(carousel, 'image', img_info['image'])
        print(f"{'Created' if created else 'Updated'} Carousel: {carousel.title}")

    print("\n[SUCCESS] Perfect version data restored! Admin panel is fully linked.")

if __name__ == "__main__":
    setup_initial_data()
