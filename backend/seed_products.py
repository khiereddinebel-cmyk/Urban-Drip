import os
import sys
import django
import random

# Setup paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Category, Brand, Product, ProductImage

def create_dummy_products():
    print("Creating dummy products...")
    
    # Get categories and brands
    categories = Category.objects.all()
    brands = Brand.objects.all()
    
    if not categories or not brands:
        print("Error: No categories or brands found. Please run test_data_setup.py first.")
        return

    # Create dummy products for each category
    for cat in categories:
        for i in range(3):
            brand = random.choice(brands)
            name = f"{brand.name} {cat.name} {i+1}"
            slug = f"{brand.slug}-{cat.slug}-{i+1}-{random.randint(100, 999)}"
            
            p, created = Product.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': name,
                    'brand': brand,
                    'category': cat,
                    'description': f"Premium quality {name} for style enthusiasts.",
                    'price': random.randint(12000, 25000),
                    'cost_price': random.randint(8000, 11000),
                    'stock_quantity': random.randint(5, 50),
                    'is_exclusive': random.choice([True, False]),
                    'sizes': [38, 39, 40, 41, 42, 43],
                    'colors': ["Black", "White", "Navy"]
                }
            )
            print(f"{'Created' if created else 'Updated'} Product: {p.name}")

    print("[SUCCESS] Dummy products created!")

if __name__ == "__main__":
    create_dummy_products()
