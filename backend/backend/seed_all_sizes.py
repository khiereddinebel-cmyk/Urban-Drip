import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product, Category, ProductSize

def seed():
    mv_cat, _ = Category.objects.get_or_create(slug='most-viewed', defaults={'name': 'Most Viewed'})
    ld_cat, _ = Category.objects.get_or_create(slug='latest-drops', defaults={'name': 'Latest Drops'})
    
    products = Product.objects.all()
    print(f"Starting seed for {products.count()} products...")
    
    for p in products:
        # Add to special categories
        p.categories.add(mv_cat)
        p.categories.add(ld_cat)
        
        # Add sizes if missing
        if p.variants.count() == 0:
            ProductSize.objects.create(product=p, size='42', cm='27')
            ProductSize.objects.create(product=p, size='43', cm='27.5')
            ProductSize.objects.create(product=p, size='44', cm='28')
            print(f"Seeded sizes for {p.name}")
        else:
            print(f"{p.name} already has {p.variants.count()} variations.")
            
    print("Seed complete.")

if __name__ == '__main__':
    seed()
