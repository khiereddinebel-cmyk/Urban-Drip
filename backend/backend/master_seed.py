import os
import django
import sys
import random

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import Category, Brand, Product, ProductImage, CarouselImage
from django.core.files import File
from django.utils.text import slugify

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_ROOT = os.path.join(os.path.dirname(BASE_DIR), "public", "images")


def get_image_file(path_parts):
    full_path = os.path.join(IMAGE_ROOT, *path_parts)
    if os.path.exists(full_path):
        return File(open(full_path, "rb"), name=os.path.basename(full_path))
    # print(f"Warning: Image not found at {full_path}")
    return None


def seed_everything():
    print("Starting Master Seed process...")

    # 1. Categories
    categories_data = [
        {"name": "Men", "image": "MEN COLLECTION.png", "banner": "banner test.png"},
        {"name": "Women", "image": "Women collection.png", "banner": "banner test.png"},
        {"name": "Kids", "image": "kids.png", "banner": "banner test.png"},
        {"name": "Accessories", "image": "ACC.png", "banner": "banner test.png"},
    ]

    cats = {}
    for c_data in categories_data:
        obj, created = Category.objects.get_or_create(
            slug=slugify(c_data["name"]), defaults={"name": c_data["name"]}
        )
        img = get_image_file([c_data["image"]])
        if img:
            try:
                obj.image.save(c_data["image"], img, save=True)
            except:
                pass

        banner = get_image_file([c_data["banner"]])
        if banner:
            try:
                obj.banner.save(c_data["banner"], banner, save=True)
            except:
                pass

        cats[c_data["name"]] = obj
        print(f"Category {obj.name} ready.")

    # 2. Brands
    brands_data = [
        {"name": "Nike", "logo": "NIKE LOGO.png", "banner": "Nike banner.png"},
        {
            "name": "Adidas",
            "logo": "ADIDAS LG.webp",
            "banner": "adidas-collection-hero.png",
        },
        {
            "name": "Jordan",
            "logo": "Jumpman_logo.svg.png",
            "banner": "jordan_hero_banner.png",
        },
        {
            "name": "Asics",
            "logo": "asics-logo-png-transparent.png",
            "banner": "ASICS HERO.jpg",
        },
        {
            "name": "New Balance",
            "logo": "NEW B LGO.png",
            "banner": "new balance hero banner.webp",
        },
        {"name": "Puma", "logo": "PUMA LOGO.png", "banner": "PUMA BNNER.jpg"},
        {
            "name": "Onitsuka Tiger",
            "logo": "ASSS.png",
            "banner": "Onitsuka-Tiger-Banner-1024x536.png",
        },
        {"name": "UGG", "logo": "UGG.jfif", "banner": "UGG BANNER.jpg"},
    ]

    brands = {}
    for b_data in brands_data:
        obj, created = Brand.objects.get_or_create(
            slug=slugify(b_data["name"]), defaults={"name": b_data["name"]}
        )
        logo = get_image_file([b_data["logo"]])
        if logo:
            try:
                obj.logo.save(b_data["logo"], logo, save=True)
            except:
                pass

        banner = get_image_file([b_data["banner"]])
        if banner:
            try:
                obj.banner.save(b_data["banner"], banner, save=True)
            except:
                pass

        brands[b_data["name"]] = obj
        print(f"Brand {obj.name} ready.")

    # 3. Carousel
    carousel_files = [
        "store-carousel-1.png",
        "store-carousel-2.png",
        "store-carousel-3.png",
    ]
    for i, filename in enumerate(carousel_files):
        img = get_image_file([filename])
        if img:
            CarouselImage.objects.create(title=f"Store View {i+1}", image=img, order=i)

    # 4. Products (Scanning public/images/Products/)
    product_base = os.path.join(IMAGE_ROOT, "Products")
    if os.path.exists(product_base):
        for brand_dir in os.listdir(product_base):
            # Try to match brand dir name with brand names
            brand_obj = brands.get(brand_dir)
            if not brand_obj:
                for b in brands.values():
                    if b.name.lower() == brand_dir.lower():
                        brand_obj = b
                        break

            if not brand_obj:
                continue

            brand_path = os.path.join(product_base, brand_dir)
            if not os.path.isdir(brand_path):
                continue

            # Map subfolders or files
            for p_file in os.listdir(brand_path):
                if not p_file.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                    continue

                name = os.path.splitext(p_file)[0]
                slug = slugify(name)

                # Check if product exists
                p_obj, created = Product.objects.get_or_create(
                    slug=slug,
                    defaults={
                        "name": name,
                        "brand": brand_obj,
                        "category": cats.get("Men", list(cats.values())[0]),
                        "description": f"High premium quality {name} available now at Urban Drip.",
                        "price": random.randint(12000, 25000),
                        "cost_price": random.randint(8000, 11000),
                        "stock_quantity": random.randint(5, 20),
                        "sizes": [
                            {"eu": 36, "cm": 22.5},
                            {"eu": 37, "cm": 23.5},
                            {"eu": 38, "cm": 24},
                            {"eu": 39, "cm": 25},
                            {"eu": 40, "cm": 25.5},
                            {"eu": 41, "cm": 26},
                            {"eu": 42, "cm": 26.5},
                            {"eu": 43, "cm": 27.5},
                            {"eu": 44, "cm": 28},
                        ],
                        "colors": ["Black", "White", "Blue"],
                        "is_exclusive": random.choice([True, False]),
                        "is_most_viewed": random.choice([True, False]),
                    },
                )

                # Create ProductImage
                if not p_obj.images.exists():
                    img_file = get_image_file(["Products", brand_dir, p_file])
                    if img_file:
                        try:
                            ProductImage.objects.create(
                                product=p_obj, image=img_file, is_main=True
                            )
                            print(f"Product {name} image linked.")
                        except:
                            pass

                # print(f"Product {name} ready.")

    print("Master Seed Complete!")


if __name__ == "__main__":
    seed_everything()
