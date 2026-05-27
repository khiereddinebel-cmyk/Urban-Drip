import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Brand, Category

def seed_brands():
    brands_data = [
        {"name": "New Balance", "slug": "new-balance"},
        {"name": "Asics", "slug": "asics"},
        {"name": "Onitsuka Tiger", "slug": "onitsuka-tiger"},
        {"name": "Puma", "slug": "puma"},
        {"name": "Ugg", "slug": "ugg"},
        {"name": "Nike Jordan", "slug": "nike-jordan"},
        {"name": "Adidas", "slug": "adidas"},
    ]
    
    print("Seeding Brands...")
    for b_data in brands_data:
        brand, created = Brand.objects.get_or_create(
            slug=b_data["slug"],
            defaults={
                "name": b_data["name"],
                "title": b_data["name"],
                "active": True,
            }
        )
        if created:
            print(f"Created brand: {brand.name}")
        else:
            # Update active if it already existed
            brand.active = True
            brand.save()
            print(f"Verified brand exists: {brand.name}")

def seed_categories():
    categories_data = [
        {"name": "Latest Drops", "slug": "latest-drops"},
        {"name": "Most Viewed", "slug": "most-viewed"},
        {"name": "Men", "slug": "men"},
        {"name": "Women", "slug": "women"},
        {"name": "Kids", "slug": "kids"},
        {"name": "Accessories", "slug": "accessories"},
    ]
    
    print("Seeding Categories...")
    for c_data in categories_data:
        category, created = Category.objects.get_or_create(
            slug=c_data["slug"],
            defaults={
                "name": c_data["name"],
                "title": c_data["name"],
                "active": True,
            }
        )
        if created:
            print(f"Created category: {category.name}")
        else:
            category.active = True
            category.save()
            print(f"Verified category exists: {category.name}")

if __name__ == "__main__":
    seed_brands()
    seed_categories()
    print("CMS seeding complete!")
