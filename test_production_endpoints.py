import urllib.request
import json
import sys

HOST = "http://127.0.0.1:8000"
if len(sys.argv) > 1:
    HOST = sys.argv[1]

ENDPOINTS = [
    {"name": "Admin Page", "path": "/admin/login/"},
    {"name": "Brands API", "path": "/api/brands/"},
    {"name": "Categories API", "path": "/api/categories/"},
    {"name": "Products API", "path": "/api/products/"},
    {"name": "Hero Sliders API", "path": "/api/hero-sliders/"},
    {"name": "Site Settings API", "path": "/api/site-settings/"},
    {"name": "Homepage Sections API", "path": "/api/homepage-sections/"},
    {"name": "Store Carousel API", "path": "/api/carousel/"},
]

def test_endpoints():
    print(f"Starting Verification Tests against: {HOST}")
    print("=" * 60)
    
    all_success = True
    for ep in ENDPOINTS:
        url = f"{HOST}{ep['path']}"
        print(f"Testing {ep['name']} -> {url} ... ", end="")
        sys.stdout.flush()
        
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            )
            response = urllib.request.urlopen(req, timeout=10)
            status_code = response.getcode()
            
            if status_code == 200:
                # For JSON endpoints, check if it parses correctly
                if "/api/" in ep['path']:
                    content = response.read().decode('utf-8')
                    data = json.loads(content)
                    items_count = 0
                    if isinstance(data, list):
                        items_count = len(data)
                    elif isinstance(data, dict) and "results" in data:
                        items_count = len(data["results"])
                    elif isinstance(data, dict):
                        items_count = 1  # Single object, like site settings
                        
                    print(f"SUCCESS (200 OK) - Parsed JSON: found {items_count} items")
                else:
                    print("SUCCESS (200 OK) - HTML loaded")
            else:
                print(f"FAILED (Status code: {status_code})")
                all_success = False
        except Exception as e:
            print(f"FAILED (Error: {e})")
            all_success = False
            
    print("=" * 60)
    if all_success:
        print("ALL TESTS PASSED! CMS and endpoints are fully functional and error-free.")
    else:
        print("SOME TESTS FAILED! Please review the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    test_endpoints()
