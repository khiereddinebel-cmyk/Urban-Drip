const fs = require('fs');
const files = [
    'src/presentation/components/Sidebar.tsx',
    'src/presentation/pages/Home.tsx',
    'src/presentation/components/Header.tsx',
    'src/presentation/components/CODForm.tsx',
    'src/presentation/components/SearchOverlay.tsx',
    'src/data/datasources/DjangoProductDataSource.ts',
    'src/presentation/components/LoginSidebar.tsx'
];
const bgUrl = "process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'";

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace standalone http://127.0.0.1:8000
    // cases: 'http://127.0.0.1:8000/api/brands/' => `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/brands/`
    content = content.replace(/'http:\/\/127\.0\.0\.1:8000([^']*)'/g, "`\\${" + bgUrl + "}$1`");
    
    // cases: `http://127.0.0.1:8000/api/products/?search=${encodeURIComponent(searchTerm)}` => `${...}...`
    content = content.replace(/http:\/\/127\.0\.0\.1:8000/g, "\\${" + bgUrl + "}");
    
    // Cleanup double ${} nesting that might happen in already template literals in case it replaces over it
    content = content.replace(/\$\{\$\{/g, '${');
    content = content.replace(/\}\}/g, '}');
    
    fs.writeFileSync(file, content);
});
console.log('Done');
