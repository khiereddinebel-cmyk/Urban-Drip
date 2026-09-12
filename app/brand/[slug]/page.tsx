import ProductGridPage from '@/src/presentation/pages/ProductGridPage';
import { ProductRepositoryImpl } from '@/src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '@/src/data/datasources/DjangoProductDataSource';
import { Product } from '@/src/domain/entities/Product';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const paramsResolved = await params;
    const slug = paramsResolved.slug;

    try {
        const dataSource = new DjangoProductDataSource();
        const brandData = await dataSource.getBrandBySlug(slug);
        const name = brandData?.name || slug.replace(/-/g, ' ');
        const title = `${name} Sneakers & Apparel | Urban Drip`;
        const description = `Shop authentic ${name} sneakers and streetwear at Urban Drip Algeria.`;

        return {
            title,
            description,
            alternates: {
                canonical: `https://urbandrip.dz/brand/${slug}`,
            },
            openGraph: {
                title,
                description,
                url: `https://urbandrip.dz/brand/${slug}`,
            },
        };
    } catch (error) {
        console.error(`Error generating metadata for brand ${slug}:`, error);
    }

    return {
        title: 'Brand | Urban Drip',
        alternates: {
            canonical: `https://urbandrip.dz/brand/${slug}`,
        },
    };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
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
