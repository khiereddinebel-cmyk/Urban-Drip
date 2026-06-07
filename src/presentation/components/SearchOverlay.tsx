import Link from 'next/link';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '../../domain/entities/Product';
import { getProductImageUrl } from '../../shared/utils/imageUtils';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset search state when overlay opens/closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setProducts([]);
        } else {
            // Auto focus the input field when opened
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Fetch matching products from API when search term changes
    useEffect(() => {
        if (!isOpen || !searchTerm.trim()) {
            setProducts([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/products/?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) throw new Error('Search failed');
                const data = await response.json();
                const results = data.results || data;
                
                const mapped: Product[] = results.map((item: any) => {
                    const imgUrls: string[] = [];
                    if (item.image) imgUrls.push(getProductImageUrl(item.image));
                    if (item.main_image) imgUrls.push(getProductImageUrl(item.main_image));
                    if (item.images && Array.isArray(item.images)) {
                        item.images.forEach((img: any) => {
                            if (typeof img === 'string') imgUrls.push(getProductImageUrl(img));
                            else if (img && img.image) imgUrls.push(getProductImageUrl(img.image));
                        });
                    }
                    if (imgUrls.length === 0) {
                        imgUrls.push("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23cccccc'>IMAGE</text></svg>");
                    }
                    return {
                        id: item.id.toString(),
                        name: item.name,
                        price: parseFloat(item.price),
                        images: imgUrls,
                        brand: item.brand_name || item.brand?.name || '',
                        category: item.category_name || item.category?.name || 'Sneakers',
                        description: item.description || '',
                        isExclusive: item.is_exclusive || false,
                        viewCount: item.view_count || 0,
                        createdAt: item.created_at,
                        sizes: (item.sizes || []).map((s: any) => ({
                            size: s.size,
                            cm: s.cm
                        })),
                        colors: item.colors || []
                    };
                }).slice(0, 5);
                
                setProducts(mapped);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, isOpen]);

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Generate dynamic suggestions based on matching products
    const suggestions = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const q = searchTerm.trim().toLowerCase();
        const set = new Set<string>();
        
        // Find correct case of query if matching product exists
        const exactMatch = products.find(p => p.name.toLowerCase().includes(q));
        if (exactMatch) {
            const idx = exactMatch.name.toLowerCase().indexOf(q);
            set.add(exactMatch.name.substring(idx, idx + q.length));
        } else {
            set.add(searchTerm.trim());
        }

        // Add matching keywords
        products.forEach(p => {
            const nameLower = p.name.toLowerCase();
            if (nameLower.includes('mule')) set.add(`${q} mule`);
            if (nameLower.includes('gel')) set.add(`${q} gel`);
            if (nameLower.includes('kayano')) set.add(`${q} gel kayano 14`);
            if (nameLower.includes('1130')) set.add(`${q} gel 1130`);
            if (nameLower.includes('1130') && nameLower.includes('mule')) set.add(`${q} gel 1130 mule`);
            if (nameLower.includes('campus')) set.add(`${q} campus`);
            if (nameLower.includes('samba')) set.add(`${q} samba`);
            if (nameLower.includes('gazelle')) set.add(`${q} gazelle`);
            if (nameLower.includes('spezial')) set.add(`${q} spezial`);
        });

        // Split product names for incremental search suggestions
        products.forEach(p => {
            const nameParts = p.name.toLowerCase().replace(/-/g, ' ').split(/\s+/);
            const qIdx = nameParts.findIndex(part => part === q || part.startsWith(q));
            if (qIdx !== -1) {
                let current = nameParts[qIdx];
                for (let i = qIdx + 1; i < Math.min(qIdx + 4, nameParts.length); i++) {
                    current = current + ' ' + nameParts[i];
                    set.add(current);
                }
            }
        });

        return Array.from(set).slice(0, 6);
    }, [searchTerm, products]);

    const renderSuggestionText = (suggestion: string, query: string) => {
        const sLower = suggestion.toLowerCase();
        const qLower = query.trim().toLowerCase();
        if (sLower.startsWith(qLower)) {
            const queryPart = suggestion.substring(0, qLower.length);
            const boldPart = suggestion.substring(qLower.length);
            return (
                <span style={{ fontSize: '15px', textTransform: 'lowercase', fontFamily: 'var(--font-sans)' }}>
                    <span style={{ fontWeight: 400, color: '#888' }}>{queryPart}</span>
                    <span style={{ fontWeight: 700, color: '#111' }}>{boldPart}</span>
                </span>
            );
        }
        return <span style={{ fontWeight: 700, color: '#111', fontSize: '15px', fontFamily: 'var(--font-sans)' }}>{suggestion}</span>;
    };

    const PLACEHOLDER_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23cccccc'>IMAGE</text></svg>";

    if (!isOpen) return null;

    return (
        <div 
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: 9999, 
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                overflowY: 'auto'
            }}
            onClick={onClose}
        >
            <div 
                style={{ 
                    backgroundColor: 'white', 
                    width: '100%', 
                    maxWidth: '800px',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: '1.5px solid #000',
                    overflowY: 'auto'
                }}
                className="w-full md:max-w-[800px] h-auto rounded-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Desktop Close X Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        right: '-45px',
                        top: '0',
                        background: 'none',
                        border: 'none',
                        color: '#000000',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    className="hidden md:flex"
                    aria-label="Close"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Search Bar Header */}
                <div style={{
                    borderBottom: '1.5px solid #eee',
                    height: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 24px',
                    backgroundColor: 'white'
                }}>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ 
                                fontSize: '10px', 
                                fontWeight: 700, 
                                textTransform: 'uppercase', 
                                color: '#888888',
                                letterSpacing: '1px',
                                fontFamily: 'var(--font-sans)',
                                marginBottom: '2px'
                            }}>
                                Search
                            </label>
                            
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                                <input 
                                    ref={inputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        border: 'none', 
                                        outline: 'none', 
                                        fontSize: '22px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        fontFamily: 'var(--font-sans)',
                                        backgroundColor: 'transparent',
                                        color: '#000',
                                        paddingRight: '45px'
                                    }}
                                    placeholder=""
                                />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm('')}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '4px'
                                        }}
                                        aria-label="Clear text"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" fill="#f3f4f6" stroke="none"></circle>
                                            <line x1="15" y1="9" x2="9" y2="15" stroke="#4b5563" strokeLinecap="round"></line>
                                            <line x1="9" y1="9" x2="15" y2="15" stroke="#4b5563" strokeLinecap="round"></line>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Divider Line */}
                        <div style={{ height: '30px', width: '1px', backgroundColor: '#e5e7eb' }}></div>

                        {/* Search Magnifying Glass Icon / Close */}
                        <button 
                            onClick={onClose} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            aria-label="Close search"
                        >
                            <span className="hidden md:block">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                                    <circle cx="10.5" cy="10.5" r="7.5"></circle>
                                    <path d="M21 21l-5.2-5.2"></path>
                                </svg>
                            </span>
                            <span className="md:hidden">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Suggestions & Products Columns */}
                <div style={{ flex: 1, padding: '24px', width: '100%' }}>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Suggestions Column */}
                        <div className="w-full md:w-[260px] md:border-r md:border-gray-200 md:pr-6">
                            <h3 style={{ 
                                fontSize: '11px', 
                                fontWeight: 700, 
                                color: '#999', 
                                textTransform: 'uppercase', 
                                letterSpacing: '1px',
                                marginBottom: '15px',
                                fontFamily: 'var(--font-sans)'
                            }}>
                                SUGGESTIONS
                            </h3>
                            <div className="flex flex-col gap-3.5">
                                {suggestions.map((s, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => setSearchTerm(s)}
                                        className="cursor-pointer hover:opacity-85 transition-opacity"
                                    >
                                        {renderSuggestionText(s, searchTerm)}
                                    </div>
                                ))}
                                {suggestions.length === 0 && searchTerm.trim() !== '' && (
                                    <p style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-sans)' }}>No suggestions found</p>
                                )}
                            </div>
                        </div>

                        {/* Products Column */}
                        <div className="flex-1">
                            <h3 style={{ 
                                fontSize: '11px', 
                                fontWeight: 700, 
                                color: '#999', 
                                textTransform: 'uppercase', 
                                letterSpacing: '1px',
                                marginBottom: '15px',
                                fontFamily: 'var(--font-sans)'
                            }}>
                                PRODUCTS
                            </h3>
                            <div className="flex flex-col gap-5">
                                {loading ? (
                                    <p style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-sans)' }}>Searching products...</p>
                                ) : (
                                    products.map((product) => (
                                        <Link 
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            onClick={onClose}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '15px', 
                                                textDecoration: 'none',
                                                color: 'black',
                                                transition: 'opacity 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.75'}
                                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            <div style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                backgroundColor: '#f9f9f9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                borderRadius: '4px',
                                                border: '1px solid #eaeaea'
                                            }} className="shrink-0">
                                                <img
                                                    src={product.images[0] || PLACEHOLDER_SVG} 
                                                    alt={product.name} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                                                    onError={(e) => {
                                                        e.currentTarget.src = PLACEHOLDER_SVG;
                                                    }}
                                                />
                                            </div>
                                            <span style={{ 
                                                fontSize: '14px', 
                                                fontWeight: 700,
                                                fontFamily: 'var(--font-sans)',
                                                color: '#000',
                                                lineHeight: '1.4'
                                            }}>
                                                {product.name}
                                            </span>
                                        </Link>
                                    ))
                                )}
                                {!loading && products.length === 0 && searchTerm.trim() !== '' && (
                                    <p style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-sans)' }}>No products match your search</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Search Trigger */}
                {searchTerm.trim() && (
                    <div 
                        onClick={onClose}
                        style={{ 
                            borderTop: '1px solid #eee', 
                            padding: '15px 24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)',
                            width: '100%',
                            backgroundColor: 'white'
                        }}
                    >
                        <span style={{ fontSize: '15px', fontWeight: 700 }}>
                            Search for &ldquo;{searchTerm}&rdquo;
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}
