import os

files = [
    'src/presentation/components/Sidebar.tsx',
    'src/presentation/pages/Home.tsx',
    'src/presentation/components/Header.tsx',
    'src/presentation/components/CODForm.tsx',
    'src/presentation/components/SearchOverlay.tsx',
    'src/data/datasources/DjangoProductDataSource.ts',
    'src/presentation/components/LoginSidebar.tsx'
]

replacement_url = "${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}"

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Exact string replacements for safety
    content = content.replace(
        "'http://127.0.0.1:8000/api/brands/'",
        f"`{replacement_url}/api/brands/`"
    )
    content = content.replace(
        "'http://127.0.0.1:8000/api/categories/'",
        f"`{replacement_url}/api/categories/`"
    )
    content = content.replace(
        "'http://127.0.0.1:8000/api/carousel-images/'",
        f"`{replacement_url}/api/carousel-images/`"
    )
    content = content.replace(
        "`http://127.0.0.1:8000/api/baladiyas/?wilaya_code=${wilayaCode}`",
        f"`{replacement_url}/api/baladiyas/?wilaya_code=${{wilayaCode}}`"
    )
    content = content.replace(
        "'http://127.0.0.1:8000/api/orders/'",
        f"`{replacement_url}/api/orders/`"
    )
    content = content.replace(
        "`http://127.0.0.1:8000/api/products/?search=${encodeURIComponent(searchTerm)}`",
        f"`{replacement_url}/api/products/?search=${{encodeURIComponent(searchTerm)}}`"
    )
    content = content.replace(
        "`http://127.0.0.1:8000/api/${endpoint}`",
        f"`{replacement_url}/api/${{endpoint}}`"
    )
    content = content.replace(
        "const BASE_URL = 'http://127.0.0.1:8000/api';",
        f"const BASE_URL = `{replacement_url}/api`;"
    )
    content = content.replace(
        "return `http://127.0.0.1:8000${url.startsWith('/') ? '' : '/'}${url}`;",
        f"return `{replacement_url}${{url.startsWith('/') ? '' : '/'}}${{url}}`;"
    )
    content = content.replace(
        "return url.startsWith('http') ? url : `http://127.0.0.1:8000${url.startsWith('/') ? '' : '/'}${url}`;",
        f"return url.startsWith('http') ? url : `{replacement_url}${{url.startsWith('/') ? '' : '/'}}${{url}}`;"
    )
    content = content.replace(
        "return `http://127.0.0.1:8000${cleanUrl}`;",
        f"return `{replacement_url}${{cleanUrl}}`;"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Replacement complete")
