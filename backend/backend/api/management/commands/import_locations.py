from django.core.management.base import BaseCommand
import json
import urllib.request
from api.models import Wilaya, Baladiya

class Command(BaseCommand):
    help = 'Imports all 1541 Algerian communes from GitHub JSON data'

    def handle(self, *args, **options):
        url = "https://raw.githubusercontent.com/othmanus/algeria-cities/master/json/algeria_cities.json"
        self.stdout.write(self.style.NOTICE(f"Downloading data from {url}..."))
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urllib.request.urlopen(req)
            data = json.loads(response.read().decode('utf-8'))
            
            self.stdout.write(self.style.SUCCESS(f"Found {len(data)} entries. Starting import..."))
            
            created_count = 0
            wilaya_cache = {}

            for item in data:
                # Normalize wilaya code to matched existing 2-digit codes if any
                w_code = str(item['wilaya_code']).zfill(2)
                w_name = item['wilaya_name_ascii']
                w_name_ar = item.get('wilaya_name', '')
                
                if w_code not in wilaya_cache:
                    wilaya, _ = Wilaya.objects.get_or_create(
                        code=w_code,
                        defaults={'name': w_name, 'name_ar': w_name_ar}
                    )
                    wilaya_cache[w_code] = wilaya
                
                wilaya = wilaya_cache[w_code]
                
                Baladiya.objects.get_or_create(
                    wilaya=wilaya,
                    name=item['commune_name_ascii'],
                    defaults={'name_ar': item.get('commune_name', '')}
                )
                created_count += 1
                if created_count % 100 == 0:
                    self.stdout.write(f"Imported {created_count} communes...")
                    
            self.stdout.write(self.style.SUCCESS(f"Success! Imported {created_count} communes for 58 wilayas."))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error during import: {e}"))
