import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product, Category

def migrate():
    # 1. Create special categories
    cat_latest, _ = Category.objects.get_or_create(
        name='Latest Drops', 
        defaults={'slug': 'latest-drops'}
    )
    cat_viewed, _ = Category.objects.get_or_create(
        name='Most Viewed', 
        defaults={'slug': 'most-viewed'}
    )
    
    print(f"Categories ready: {cat_latest.name}, {cat_viewed.name}")

    # 2. Migrate products
    products = Product.objects.all()
    print(f"Found {products.count()} products to migrate.")
    
    for p in products:
        # Move old category to categories M2M
        if p.old_category:
            p.categories.add(p.old_category)
        
        # Add to special categories based on flags
        if p.is_exclusive:
            p.categories.add(cat_latest)
        if p.is_most_viewed:
            p.categories.add(cat_viewed)
            
        print(f"Migrated: {p.name}")

if __name__ == '__main__':
    migrate()
