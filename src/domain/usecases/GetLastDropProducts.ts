import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetLastDropProducts {
    constructor(private productRepository: ProductRepository) { }

    async execute(limit: number = 10): Promise<Product[]> {
        return this.productRepository.getLastDropProducts(limit);
    }
}
