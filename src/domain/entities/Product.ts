export interface ProductSize {
    size: string | number;
    eu?: string | number;
    cm: string | number;
}

export interface Product {
    id: string;
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
    createdAt?: Date;
}
