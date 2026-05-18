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

const replacement = "${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}";

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Clean up messed up strings in case there are nested or bad templates
    content = content.replace(/\\\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/127\.0\.0\.1:8000'\}/g, "http://127.0.0.1:8000");
    content = content.replace(/\\\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\\\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/127\.0\.0\.1:8000'\}'\}/g, "http://127.0.0.1:8000");
    content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/127\.0\.0\.1:8000'\}'\}/g, "http://127.0.0.1:8000");

    // Replace all with standard
    content = content.replace(/'http:\/\/127\.0\.0\.1:8000([^']*)'/g, "`" + replacement + "$1`");
    content = content.replace(/http:\/\/127\.0\.0\.1:8000/g, replacement);

    fs.writeFileSync(file, content);
});
console.log('Done cleaning');
