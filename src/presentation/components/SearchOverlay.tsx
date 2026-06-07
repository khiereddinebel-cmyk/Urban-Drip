import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product } from '../../domain/entities/Product';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
}

export default function SearchOverlay({ isOpen, onClose, searchTerm }: SearchOverlayProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !searchTerm.trim()) {
            setProducts([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                // Fetch directly for search overlay speed
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/products/?search=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();
                const results = data.results || data;
                
                const mapped: Product[] = results.map((item: any) => ({
                    id: item.id.toString(),
                    name: item.name,
                    price: parseFloat(item.price),
                    images: (item.images || []).map((img: any) => {
                        const url = img.image || '';
                        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}${url.startsWith('/') ? '' : '/'}${url}`;
                    }),
                    brand: item.brand_name,
                    category: item.category_name || 'Sneakers',
                    description: item.description,
                    isExclusive: item.is_exclusive,
                    viewCount: item.view_count || 0,
                    createdAt: item.created_at,
                    sizes: (item.sizes || []).map((s: any) => ({
                        size: s.size,
                        cm: s.cm
                    })),
                    colors: item.colors || []
                })).slice(0, 5);
                
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

    if (!isOpen) return null;

    const query = searchTerm.trim().toLowerCase();
    
    // Filtered products for the right column
    const filteredProducts = products;

    // Generate suggestions based on product names
    const suggestions = products.map(p => p.name).slice(0, 6);

    return (
        <div 
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: 99, 
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '145px' // Adjust based on header height
            }}
            onClick={onClose}
        >
            <div 
                style={{ 
                    backgroundColor: 'white', 
                    width: '100%', 
                    maxWidth: '1200px', 
                    margin: '0 auto',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', padding: '30px 40px', minHeight: '300px' }}>
                    {/* Left Column: Suggestions */}
                    <div style={{ flex: '0 0 350px', borderRight: '1px solid #eee', paddingRight: '40px' }}>
                        <h3 style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            color: '#999', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1px',
                            marginBottom: '25px',
                            fontFamily: 'var(--font-sans)'
                        }}>
                            Suggestions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {suggestions.map((s, i) => {
                                const startsWithQuery = s.toLowerCase().startsWith(query);
                                return (
                                    <div 
                                        key={i} 
                                        style={{ 
                                            fontSize: '15px', 
                                            cursor: 'pointer',
                                            fontFamily: 'var(--font-sans)',
                                            color: '#333'
                                        }}
                                    >
                                        {startsWithQuery ? (
                                            <>
                                                <span style={{ fontWeight: 400 }}>{s.substring(0, query.length)}</span>
                                                <span style={{ fontWeight: 700 }}>{s.substring(query.length)}</span>
                                            </>
                                        ) : (
                                            <span style={{ fontWeight: 700 }}>{s}</span>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Brand Suggestion (e.g. NIKE / ADIDAS) */}
                            {query && (
                                <div style={{ 
                                    marginTop: '10px',
                                    fontSize: '16px', 
                                    fontWeight: 900, 
                                    textTransform: 'uppercase',
                                    fontFamily: 'var(--font-sans)',
                                    color: 'black'
                                }}>
                                    {query}
                                </div>
                            )}

                            {suggestions.length === 0 && query !== '' && (
                                <p style={{ fontSize: '14px', color: '#999' }}>No suggestions found</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Products */}
                    <div style={{ flex: 1, paddingLeft: '40px' }}>
                        <h3 style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            color: '#999', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1px',
                            marginBottom: '25px',
                            fontFamily: 'var(--font-sans)'
                        }}>
                            Products
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {filteredProducts.map((product) => (
                                <Link 
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    onClick={onClose}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '20px', 
                                        textDecoration: 'none',
                                        color: 'black',
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    <div style={{ 
                                        width: '50px', 
                                        height: '50px', 
                                        backgroundColor: '#f9f9f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <Image 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            width={50} 
                                            height={50} 
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    <span style={{ 
                                        fontSize: '15px', 
                                        fontWeight: 600,
                                        fontFamily: 'var(--font-sans)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {product.name}
                                    </span>
                                </Link>
                            ))}
                            {filteredProducts.length === 0 && query !== '' && (
                                <p style={{ fontSize: '14px', color: '#999' }}>No products match your search</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {query && (
                    <div style={{ 
                        borderTop: '1px solid #eee', 
                        padding: '20px 40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '16px', fontWeight: 600 }}>Search for "{searchTerm}"</span>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}
