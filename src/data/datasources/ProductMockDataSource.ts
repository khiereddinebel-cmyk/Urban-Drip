import { ProductModel } from '../models/ProductModel';
import { ProductRemoteDataSource } from './ProductRemoteDataSource';
import { mockProducts } from '../../shared/data/mockProducts';

export class ProductMockDataSource implements ProductRemoteDataSource {
    async getLastDropProducts(limit: number): Promise<{ id: string; data: ProductModel }[]> {
        // Filter for exclusive products or very recent ones
        const filtered = mockProducts.filter(p => p.isExclusive);
        return filtered.slice(0, limit).map(p => ({
            id: p.id,
            data: { ...p, createdAt: new Date().toISOString() } as ProductModel
        }));
    }

    async getMostViewedProducts(limit: number): Promise<{ id: string; data: ProductModel }[]> {
        const sorted = [...mockProducts].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        return sorted.slice(0, limit).map(p => ({
            id: p.id,
            data: { ...p, createdAt: new Date().toISOString() } as ProductModel
        }));
    }

    async getProductsByBrand(brandId: string): Promise<{ id: string; data: ProductModel }[]> {
        const filtered = mockProducts.filter(p => p.brand.toLowerCase() === brandId.toLowerCase());
        return filtered.map(p => ({
            id: p.id,
            data: { ...p, createdAt: new Date().toISOString() } as ProductModel
        }));
    }

    async getProductById(id: string): Promise<{ id: string; data: ProductModel } | null> {
        const product = mockProducts.find(p => p.id === id);
        if (!product) return null;
        return {
            id: product.id,
            data: { ...product, createdAt: new Date().toISOString() } as ProductModel
        };
    }

    async incrementViewCount(productId: string): Promise<void> {
        // Mock doesn't actually persist
        return Promise.resolve();
    }

    async getProductsByCategory(category: string): Promise<{ id: string; data: ProductModel }[]> {
        const filtered = mockProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
        return filtered.map(p => ({
            id: p.id,
            data: { ...p, createdAt: new Date().toISOString() } as ProductModel
        }));
    }

    async getAllBrands(): Promise<{ id: string; data: any }[]> {
        // Return some dummy brands for the mock
        return [
            { id: 'nike', data: { name: 'Nike', logo: '/images/brands/nike.png', coverImage: '' } },
            { id: 'adidas', data: { name: 'Adidas', logo: '/images/brands/adidas.png', coverImage: '' } },
            { id: 'jordan', data: { name: 'Jordan', logo: '/images/brands/jordan.png', coverImage: '' } }
        ];
    }
}
