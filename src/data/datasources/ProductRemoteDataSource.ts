import { ProductModel } from '../models/ProductModel';

export interface ProductRemoteDataSource {
    getLastDropProducts(limit: number): Promise<{ id: string; data: ProductModel }[]>;
    getMostViewedProducts(limit: number): Promise<{ id: string; data: ProductModel }[]>;
    getProductsByBrand(brandId: string): Promise<{ id: string; data: ProductModel }[]>;
    getProductById(id: string): Promise<{ id: string; data: ProductModel } | null>;
    incrementViewCount(productId: string): Promise<void>;
    getProductsByCategory(category: string): Promise<{ id: string; data: ProductModel }[]>;
    getAllBrands(): Promise<{ id: string; data: any }[]>;
}
