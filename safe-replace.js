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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // First, strictly replace exact quoted strings
    content = content.replace(/'http:\/\/127\.0\.0\.1:8000/g, "`\\${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}");
    // This will result in: "`\${process.env...}/api/brands/'" 
    // We need to fix the trailing single quote to a backtick. But let's just do an exact split/join to be safe
    content = content.split("'http://127.0.0.1:8000/api/brands/'").join("`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/brands/`");
    content = content.split("'http://127.0.0.1:8000/api/categories/'").join("`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/categories/`");
    content = content.split("'http://127.0.0.1:8000/api/carousel-images/'").join("`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/carousel-images/`");
    content = content.split("'http://127.0.0.1:8000/api/orders/', {").join("`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/orders/`, {");
    content = content.split("'http://127.0.0.1:8000/api';").join("`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api`;");
    content = content.split("`http://127.0.0.1:8000").join("`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}");

    fs.writeFileSync(file, content);
});
console.log('Clean replacement complete');
