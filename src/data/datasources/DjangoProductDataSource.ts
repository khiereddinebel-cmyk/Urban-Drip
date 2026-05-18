import { ProductModel } from '../models/ProductModel';
import { ProductRemoteDataSource } from './ProductRemoteDataSource';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api`;

export class DjangoProductDataSource implements ProductRemoteDataSource {
    private async fetchApi(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
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
        if (url.startsWith('http')) return url;
        
        // Handle paths that might be missing the leading slash or /media/
        let cleanUrl = url.startsWith('/') ? url : `/${url}`;
        
        // If it's a media file but doesn't have /media/ prefix, add it
        // This is common when Django returns paths relative to MEDIA_ROOT
        if (!cleanUrl.startsWith('/media/')) {
            cleanUrl = `/media${cleanUrl}`;
        }
        
        return `http://127.0.0.1:8000${cleanUrl}`;
    }

    private mapDjangoToModel(item: any): { id: string; data: ProductModel } {
        return {
            id: item.id.toString(),
            data: {
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                brand: item.brand_name,
                category: item.category_name,
                isExclusive: item.is_exclusive,
                viewCount: item.view_count || 0,
                sizes: (item.sizes || []).map((s: any) => ({
                    size: s.size,
                    eu: s.eu,
                    cm: s.cm
                })),
                colors: item.colors || [],
                images: item.images.map((img: any) => this.mapImage(img.image)),
                createdAt: item.created_at,
            }
        };
    }

    async getLastDropProducts(limit: number): Promise<{ id: string; data: ProductModel }[]> {
        const data = await this.fetchApi(`/products/?exclusive=true&limit=${limit}`);
        return data.results ? data.results.map(this.mapDjangoToModel.bind(this)) : data.map(this.mapDjangoToModel.bind(this));
    }

    async getMostViewedProducts(limit: number): Promise<{ id: string; data: ProductModel }[]> {
        const data = await this.fetchApi(`/products/?most_viewed=true&limit=${limit}`);
        return data.results ? data.results.map(this.mapDjangoToModel.bind(this)) : data.map(this.mapDjangoToModel.bind(this));
    }

    async getProductsByBrand(brandId: string): Promise<{ id: string; data: ProductModel }[]> {
        const data = await this.fetchApi(`/products/?brand=${brandId}`);
        return data.results ? data.results.map(this.mapDjangoToModel.bind(this)) : data.map(this.mapDjangoToModel.bind(this));
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
        await this.fetchApi(`/products/${productId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ view_count_increment: 1 }),
        });
    }

    async getProductsByCategory(category: string): Promise<{ id: string; data: ProductModel }[]> {
        const data = await this.fetchApi(`/products/?category=${category}`);
        return data.results ? data.results.map(this.mapDjangoToModel.bind(this)) : data.map(this.mapDjangoToModel.bind(this));
    }

    async getBrandBySlug(slug: string): Promise<any> {
        try {
            const data = await this.fetchApi(`/brands/?slug=${slug}`);
            const brand = data.results ? data.results[0] : (Array.isArray(data) ? data[0] : data);
            if (!brand) return null;
            return {
                id: brand.slug,
                name: brand.name,
                logo: this.mapImage(brand.logo),
                banner: this.mapImage(brand.banner)
            };
        } catch (error) {
            return null;
        }
    }

    async getCategoryBySlug(slug: string): Promise<any> {
        try {
            const data = await this.fetchApi(`/categories/?slug=${slug}`);
            const category = data.results ? data.results[0] : (Array.isArray(data) ? data[0] : data);
            if (!category) return null;
            return {
                id: category.slug,
                name: category.name,
                image: this.mapImage(category.image),
                banner: this.mapImage(category.banner)
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
                logo: this.mapImage(b.logo),
                coverImage: this.mapImage(b.cover_image),
                banner: this.mapImage(b.banner),
            }
        }));
    }
}
