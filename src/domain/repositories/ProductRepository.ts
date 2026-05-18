import { Product } from '../entities/Product';
import { Brand } from '../entities/Brand';

export interface ProductRepository {
    getLastDropProducts(limit?: number): Promise<Product[]>;
    getMostViewedProducts(limit?: number): Promise<Product[]>;
    getProductsByBrand(brandId: string): Promise<Product[]>;
    getProductsByCategory(category: string): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    getAllBrands(): Promise<Brand[]>;
    uploadProduct(product: Omit<Product, 'id'>, imageFiles: File[]): Promise<Product>;
    incrementViewCount(productId: string): Promise<void>;
}
