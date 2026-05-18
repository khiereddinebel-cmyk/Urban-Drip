import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Brand, Category

def seed_brands():
    brands = [
        'New Balance',
        'Onitsuka Tiger',
        'Puma',
        'Asics',
        'Nike',
        'Ugg',
        'Adidas',
        'Jordan'
    ]
    for brand_name in brands:
        Brand.objects.get_or_create(name=brand_name)
    print(f"Successfully seeded {len(brands)} brands.")

def seed_categories():
    categories = [
        'Sneakers',
        'Streetwear',
        'Accessories',
        'Latest Drops'
    ]
    for cat_name in categories:
        Category.objects.get_or_create(name=cat_name)
    print(f"Successfully seeded {len(categories)} categories.")

if __name__ == "__main__":
    seed_brands()
    seed_categories()
