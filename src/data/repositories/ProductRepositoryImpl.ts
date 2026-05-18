import { Product } from '../../domain/entities/Product';
import { Brand } from '../../domain/entities/Brand';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ProductRemoteDataSource } from '../datasources/ProductRemoteDataSource';
import { mapProductModelToEntity } from '../models/ProductModel';

export class ProductRepositoryImpl implements ProductRepository {
    constructor(private remoteDataSource: ProductRemoteDataSource) { }

    async getLastDropProducts(limit: number = 10): Promise<Product[]> {
        const data = await this.remoteDataSource.getLastDropProducts(limit);
        return data.map((item) => mapProductModelToEntity(item.id, item.data));
    }

    async getMostViewedProducts(limit: number = 10): Promise<Product[]> {
        const data = await this.remoteDataSource.getMostViewedProducts(limit);
        return data.map((item) => mapProductModelToEntity(item.id, item.data));
    }

    async getProductsByBrand(brandId: string): Promise<Product[]> {
        const data = await this.remoteDataSource.getProductsByBrand(brandId);
        return data.map((item) => mapProductModelToEntity(item.id, item.data));
    }

    async getProductsByCategory(category: string): Promise<Product[]> {
        const data = await this.remoteDataSource.getProductsByCategory(category);
        return data.map((item) => mapProductModelToEntity(item.id, item.data));
    }

    async getProductById(id: string): Promise<Product | null> {
        const data = await this.remoteDataSource.getProductById(id);
        if (!data) return null;
        return mapProductModelToEntity(data.id, data.data);
    }

    async getAllBrands(): Promise<Brand[]> {
        const data = await this.remoteDataSource.getAllBrands();
        return data.map(item => ({ id: item.id, ...item.data } as Brand));
    }

    async uploadProduct(product: Omit<Product, 'id'>, imageFiles: File[]): Promise<Product> {
        throw new Error('Method not implemented.'); // TODO: implement
    }

    async incrementViewCount(productId: string): Promise<void> {
        return this.remoteDataSource.incrementViewCount(productId);
    }
}
