import ProductGridPage from '@/src/presentation/pages/ProductGridPage';
import { ProductRepositoryImpl } from '@/src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '@/src/data/datasources/DjangoProductDataSource';

import { Product } from '@/src/domain/entities/Product';

export const dynamic = 'force-dynamic';

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
    // Resolve params according to Next.js 15+ standard
    const paramsResolved = await params;
    const slug = paramsResolved.slug;
    
    const dataSource = new DjangoProductDataSource();
    const repository = new ProductRepositoryImpl(dataSource);
    
    let brandData: any = null;
    let products: Product[] = [];
    
    try {
        // Fetch brand details
        brandData = await dataSource.getBrandBySlug(slug);
        
        // Fetch products by brand slug
        products = await repository.getProductsByBrand(slug);
    } catch (error) {
        console.error(`Error loading brand page for ${slug}:`, error);
        // We will fall back to showing empty grid rather than crashing the whole page
    }

    const title = brandData ? brandData.name : slug.replace(/-/g, ' ');
    const bannerImage = brandData ? brandData.banner : undefined;

    return (
        <ProductGridPage
            title={title}
            brand={slug}
            showHero={!!bannerImage}
            bannerImage={bannerImage}
            logoImage={brandData?.logo}
            products={products || []}
        />
    );
}
