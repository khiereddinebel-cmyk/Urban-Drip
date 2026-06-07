export function getProductImageUrl(img: string | undefined | null): string {
    if (!img) {
        return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23cccccc'>IMAGE</text></svg>";
    }
    
    let path = img;
    // If it's a full URL, check if it contains a local/internal host that needs replacement
    if (img.startsWith('http://') || img.startsWith('https://')) {
        try {
            const parsed = new URL(img);
            if (
                parsed.hostname === 'localhost' || 
                parsed.hostname === '127.0.0.1' || 
                parsed.hostname === '0.0.0.0' || 
                parsed.pathname.startsWith('/media/') ||
                parsed.hostname.includes('railway')
            ) {
                path = parsed.pathname;
            } else {
                return img; // Keep external hosts (e.g., Unsplash, Firebase)
            }
        } catch (e) {
            // fallback
        }
    }
    
    // Handle paths that might be missing the leading slash
    let cleanUrl = path.startsWith('/') ? path : `/${path}`;
    
    // If it doesn't have /media/ prefix, add it
    if (!cleanUrl.startsWith('/media/')) {
        cleanUrl = `/media${cleanUrl}`;
    }
    
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    // Remove trailing slash if exists in apiBase
    const cleanBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    
    return `${cleanBase}${cleanUrl}`;
}
