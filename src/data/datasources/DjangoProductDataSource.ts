import { ProductModel } from '../models/ProductModel';
import { ProductRemoteDataSource } from './ProductRemoteDataSource';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const BASE_URL = `${API_BASE_URL}/api`;

export class DjangoProductDataSource implements ProductRemoteDataSource {
    private async fetchApi(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
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
        if (url.startsWith('http')) return url;
        
        // Ensure path starts with /
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        return `${API_BASE_URL}${cleanPath}`;
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
                sizes: [], // Sizes removed in simplified model
                colors: [], // Colors removed in simplified model
                images: item.image ? [this.mapImage(item.image)] : [],
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
}
