import urllib.request
import json

try:
    response = urllib.request.urlopen("http://127.0.0.1:8000/api/products/?exclusive=true")
    data = json.loads(response.read().decode())
    count = len(data) if isinstance(data, list) else len(data.get('results', data))
    print(f"SUCCESS: Found {count} products.")
except Exception as e:
    print(f"FAILURE: {e}")
