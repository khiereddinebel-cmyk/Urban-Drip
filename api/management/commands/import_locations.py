from django.core.management.base import BaseCommand
import json
import os
from api.models import Wilaya, Baladiya, Product, ProductSize

class Command(BaseCommand):
    help = 'Imports Wilayas, Baladiyas, and ProductSizes safely from datadump.json'

    def handle(self, *args, **options):
        # Find datadump.json path
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        dump_path = os.path.join(base_dir, 'datadump.json')

        if not os.path.exists(dump_path):
            self.stdout.write(self.style.ERROR(f"datadump.json not found at {dump_path}"))
            return

        self.stdout.write(self.style.NOTICE(f"Loading data from {dump_path}..."))

        try:
            with open(dump_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Filter records
            wilaya_records = [r for r in data if r.get('model') == 'api.wilaya']
            baladiya_records = [r for r in data if r.get('model') == 'api.baladiya']
            size_records = [r for r in data if r.get('model') == 'api.productsize']

            self.stdout.write(self.style.NOTICE(f"Parsed {len(wilaya_records)} Wilayas, {len(baladiya_records)} Baladiyas, and {len(size_records)} ProductSizes."))

            # 1. Import Wilayas
            self.stdout.write("Importing Wilayas...")
            wilaya_map = {} # maps pk in dump to Wilaya object
            for w in wilaya_records:
                pk = w['pk']
                fields = w['fields']
                wilaya, created = Wilaya.objects.get_or_create(
                    code=fields['code'],
                    defaults={
                        'name': fields['name'],
                        'name_ar': fields.get('name_ar', '')
                    }
                )
                if not created:
                    # Ensure name_ar is updated if empty
                    if fields.get('name_ar') and not wilaya.name_ar:
                        wilaya.name_ar = fields['name_ar']
                        wilaya.save()
                wilaya_map[pk] = wilaya

            self.stdout.write(self.style.SUCCESS(f"Wilayas import complete. Cached {len(wilaya_map)} Wilayas."))

            # 2. Import Baladiyas
            self.stdout.write("Importing Baladiyas/Communes...")
            baladiya_count = 0
            for b in baladiya_records:
                fields = b['fields']
                w_pk = fields['wilaya']
                wilaya = wilaya_map.get(w_pk)
                if not wilaya:
                    continue
                
                baladiya, created = Baladiya.objects.get_or_create(
                    wilaya=wilaya,
                    name=fields['name'],
                    defaults={
                        'name_ar': fields.get('name_ar', '')
                    }
                )
                if not created:
                    if fields.get('name_ar') and not baladiya.name_ar:
                        baladiya.name_ar = fields['name_ar']
                        baladiya.save()
                
                baladiya_count += 1
                if baladiya_count % 300 == 0:
                    self.stdout.write(f"Imported {baladiya_count} Baladiyas...")

            self.stdout.write(self.style.SUCCESS(f"Successfully imported/verified {baladiya_count} Baladiyas."))

            # 3. Import Product Sizes
            self.stdout.write("Importing Product Sizes...")
            size_count = 0
            for s in size_records:
                fields = s['fields']
                prod_id = fields['product']
                try:
                    product = Product.objects.get(id=prod_id)
                except Product.DoesNotExist:
                    continue

                ProductSize.objects.get_or_create(
                    product=product,
                    size=fields['size'],
                    defaults={
                        'cm': fields.get('cm', '')
                    }
                )
                size_count += 1

            self.stdout.write(self.style.SUCCESS(f"Successfully imported/verified {size_count} ProductSizes."))

            # 4. Fallback/Ensure sizes for all active products
            self.stdout.write("Verifying that all products have sizes...")
            default_sizes = [
                {"size": "36", "cm": "22.5"},
                {"size": "37", "cm": "23.5"},
                {"size": "38", "cm": "24"},
                {"size": "39", "cm": "25"},
                {"size": "40", "cm": "25.5"},
                {"size": "41", "cm": "26"},
                {"size": "42", "cm": "26.5"},
                {"size": "43", "cm": "27.5"},
                {"size": "44", "cm": "28"},
            ]
            fixed_count = 0
            for product in Product.objects.all():
                if product.variants.count() == 0:
                    for size_info in default_sizes:
                        ProductSize.objects.create(
                            product=product,
                            size=size_info["size"],
                            cm=size_info["cm"]
                        )
                    fixed_count += 1
                    self.stdout.write(f"Created default sizes for product: {product.name}")
            
            if fixed_count > 0:
                self.stdout.write(self.style.SUCCESS(f"Added default sizes to {fixed_count} products with missing sizes."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error during import: {e}"))
