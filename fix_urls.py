import os
import re

files = [
    'src/presentation/components/Sidebar.tsx',
    'src/presentation/pages/Home.tsx',
    'src/presentation/components/Header.tsx',
    'src/presentation/components/CODForm.tsx',
    'src/presentation/components/SearchOverlay.tsx',
    'src/data/datasources/DjangoProductDataSource.ts',
    'src/presentation/components/LoginSidebar.tsx'
]

replacement_expression = "`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}`"
inner_expression = "${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}"

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # handle cases with single quotes: 'http://127.0.0.1:8000...' => `${...}...`
    # Replace single quote strings that start with http://127.0.0.1:8000 with a template literal
    def quote_repl(m):
        path = m.group(1)
        return f"`{inner_expression}{path}`"
        
    content = re.sub(r"'http://127\.0\.0\.1:8000([^']*)'", quote_repl, content)
    
    # Handle paths already in template literals (`http://127.0.0.1:8000...`)
    content = re.sub(r'http://127\.0\.0\.1:8000', inner_expression, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done python substitution")
