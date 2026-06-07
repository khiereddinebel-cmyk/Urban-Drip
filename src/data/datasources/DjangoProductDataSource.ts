import { ProductModel } from '../models/ProductModel';
import { ProductRemoteDataSource } from './ProductRemoteDataSource';
import { getApiBaseUrl } from '../../shared/utils/imageUtils';

export class DjangoProductDataSource implements ProductRemoteDataSource {
    private async fetchApi(endpoint: string, options: RequestInit = {}) {
        const apiBase = getApiBaseUrl();
        const cleanBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
        const response = await fetch(`${cleanBase}/api${endpoint}`, {
            cache: 'no-store',
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    private mapImage(url: string | null): string {
        if (!url) return '';
        
        let path = url;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            try {
                const parsed = new URL(url);
                if (
                    parsed.hostname === 'localhost' || 
                    parsed.hostname === '127.0.0.1' || 
                    parsed.hostname === '0.0.0.0'
                ) {
                    path = parsed.pathname;
                } else {
                    return url; // Keep external or production hosts (e.g., Railway, custom domain)
                }
            } catch (e) {
                // fallback
            }
        }
        
        // Handle paths that might be missing the leading slash or /media/
        let cleanUrl = path.startsWith('/') ? path : `/${path}`;
        
        // If it's a media file but doesn't have /media/ prefix, add it
        // This is common when Django returns paths relative to MEDIA_ROOT
        if (!cleanUrl.startsWith('/media/')) {
            cleanUrl = `/media${cleanUrl}`;
        }
        
        const apiBase = getApiBaseUrl();
        const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
        return `${base}${cleanUrl}`;
    }

    private mapDjangoToModel(item: any): { id: string; data: ProductModel } {
        return {
            id: item.id.toString(),
            data: {
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                brand: item.brand_name || 'N/A',
                category: item.category_name || 'N/A',
                isExclusive: item.is_active, // mapping is_active to exclusive for now if needed, or just false
                viewCount: 0,
                sizes: (item.sizes || []).map((sz: any) => ({
                    size: sz.size || sz.size_eu || '',
                    eu: sz.eu || sz.size_eu || '',
                    cm: sz.cm || sz.size_cm || ''
                })),
                colors: item.colors || [],
                images: Array.from(
                    new Set([
                        ...(item.image ? [this.mapImage(item.image)] : []),
                        ...(item.main_image ? [this.mapImage(item.main_image)] : []),
                        ...(item.images || []).map((img: any) => {
                            if (typeof img === 'string') return this.mapImage(img);
                            return this.mapImage(img.image || img);
                        })
                    ])
                ),
                createdAt: item.created_at,
            }
        };
    }

    async getLastDropProducts(limit: number): Promise<{ id: string; data: ProductModel }[]> {
        const data = await this.fetchApi(`/products/?latest_drops=true`);
        const products = data.results || data;
        return products.slice(0, limit).map(this.mapDjangoToModel.bind(this));
    }

    async getMostViewedProducts(limit: number): Promise<{ id: string; data: ProductModel }[]> {
        const data = await this.fetchApi(`/products/?most_viewed=true`);
        const products = data.results || data;
        return products.slice(0, limit).map(this.mapDjangoToModel.bind(this));
    }

    async getProductsByBrand(brandSlug: string): Promise<{ id: string; data: ProductModel }[]> {
        const data = await this.fetchApi(`/products/?brand=${brandSlug}`);
        const products = data.results || data;
        return products.map(this.mapDjangoToModel.bind(this));
    }

    async getProductById(id: string): Promise<{ id: string; data: ProductModel } | null> {
        try {
            const data = await this.fetchApi(`/products/${id}/`);
            return this.mapDjangoToModel(data);
        } catch (error) {
            return null;
        }
    }

    async incrementViewCount(productId: string): Promise<void> {
        // Not implemented in simplified models
    }

    async getProductsByCategory(categorySlug: string): Promise<{ id: string; data: ProductModel }[]> {
        const data = await this.fetchApi(`/products/?category=${categorySlug}`);
        const products = data.results || data;
        return products.map(this.mapDjangoToModel.bind(this));
    }

    async getBrandBySlug(slug: string): Promise<any> {
        try {
            const data = await this.fetchApi(`/brands/`);
            const brands = data.results || data;
            const brand = brands.find((b: any) => b.slug === slug);
            if (!brand) return null;
            return {
                id: brand.slug,
                name: brand.name,
                logo: this.mapImage(brand.logo_image || brand.logo),
                banner: this.mapImage(brand.banner_image),
                cover: this.mapImage(brand.cover_image),
                title: brand.title || brand.name,
                subtitle: brand.subtitle || '',
                description: brand.description || ''
            };
        } catch (error) {
            return null;
        }
    }

    async getCategoryBySlug(slug: string): Promise<any> {
        try {
            const data = await this.fetchApi(`/categories/`);
            const categories = data.results || data;
            const category = categories.find((c: any) => c.slug === slug);
            if (!category) return null;
            return {
                id: category.slug,
                name: category.name,
                logo: this.mapImage(category.logo_image),
                banner: this.mapImage(category.banner_image || category.image),
                cover: this.mapImage(category.cover_image),
                title: category.title || category.name,
                subtitle: category.subtitle || '',
                description: category.description || ''
            };
        } catch (error) {
            return null;
        }
    }

    async getAllBrands(): Promise<{ id: string; data: any }[]> {
        const data = await this.fetchApi('/brands/');
        const brands = data.results || data;
        return brands.map((b: any) => ({
            id: b.slug,
            data: {
                name: b.name,
                logo: this.mapImage(b.logo_image || b.logo),
                cover: this.mapImage(b.cover_image),
            }
        }));
    }

    async getBanners(page: string): Promise<any[]> {
        try {
            const data = await this.fetchApi(`/banners/?page=${page}`);
            const banners = data.results || data;
            return banners.map((b: any) => ({
                id: b.id,
                title: b.title,
                image: this.mapImage(b.image),
                link: b.link,
                page: b.page
            }));
        } catch (error) {
            return [];
        }
    }

    async getCarouselImages(): Promise<any[]> {
        try {
            const data = await this.fetchApi('/carousel/');
            const images = data.results || data;
            return images.map((img: any) => ({
                id: img.id,
                title: img.title || '',
                image: this.mapImage(img.image),
                link: img.button_link || ''
            }));
        } catch (error) {
            return [];
        }
    }
}
