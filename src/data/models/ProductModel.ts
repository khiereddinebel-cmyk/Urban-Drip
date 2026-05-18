// DTO representing the raw data from Firebase
import { Product, ProductSize } from '../../domain/entities/Product';

export interface ProductModel {
    id?: string;
    name: string;
    description: string;
    price: number;
    brand: string;
    sizes: ProductSize[];
    colors: string[];
    images: string[];
    category: string;
    isExclusive: boolean;
    viewCount: number;
    createdAt: any; 
}

// Mapper to convert from DB model to Domain Entity
export const mapProductModelToEntity = (id: string, model: ProductModel): Product => {
    return {
        id,
        name: model.name,
        description: model.description,
        price: model.price,
        brand: model.brand,
        sizes: model.sizes,
        colors: model.colors || [],
        images: model.images,
        category: model.category,
        isExclusive: model.isExclusive,
        viewCount: model.viewCount,
        createdAt: model.createdAt?.toDate ? model.createdAt.toDate().toISOString() : model.createdAt,
    };
};
