import os
import django
import sys
from django.utils.text import slugify

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import Brand, Category, SiteSettings, HomepageSection

def seed():
    print("Seeding new CMS settings, brands, categories and sections...")

    # 1. Site Settings (Singleton)
    settings_obj = SiteSettings.objects.first()
    if not settings_obj:
        settings_obj = SiteSettings.objects.create(
            site_name="Urban Drip",
            homepage_title="Urban Drip",
            homepage_subtitle="Exclusive Sneakers & Streetwear",
            show_logo_text=False  # Hide by default as requested
        )
        print("Site settings initialized.")
    else:
        print("Site settings already exists.")

    # 2. Brands
    brands_to_seed = [
        "New Balance", "ASICS", "ONITSUKA TIGER", "PUMA", "UGG", "NIKE JORDAN", "ADIDAS"
    ]
    for brand_name in brands_to_seed:
        slug = slugify(brand_name)
        brand, created = Brand.objects.get_or_create(
            slug=slug,
            defaults={
                "name": brand_name,
                "active": True,
                "display_order": 0
            }
        )
        if created:
            print(f"Created brand: {brand_name}")
        else:
            print(f"Brand {brand_name} already exists.")

    # 3. Categories
    categories_to_seed = [
        "Men", "Women", "Kids", "Accessories"
    ]
    for cat_name in categories_to_seed:
        slug = slugify(cat_name)
        cat, created = Category.objects.get_or_create(
            slug=slug,
            defaults={
                "name": cat_name,
                "active": True,
                "display_order": 0
            }
        )
        if created:
            print(f"Created category: {cat_name}")
        else:
            print(f"Category {cat_name} already exists.")

    # 4. Homepage Sections
    sections_to_seed = [
        {"name": "Latest Drops", "slug": "latest_drops", "section_type": "latest_drops"},
        {"name": "Most Viewed Products", "slug": "most_viewed", "section_type": "most_viewed"},
        {"name": "Featured Products", "slug": "featured", "section_type": "featured"},
    ]
    for section_info in sections_to_seed:
        section, created = HomepageSection.objects.get_or_create(
            slug=section_info["slug"],
            defaults={
                "name": section_info["name"],
                "section_type": section_info["section_type"],
                "active": True,
                "display_order": 0
            }
        )
        if created:
            print(f"Created homepage section: {section_info['name']}")
        else:
            print(f"Homepage section {section_info['name']} already exists.")

    print("CMS seeding complete!")

if __name__ == "__main__":
    seed()
