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
        const categoryData = await dataSource.getCategoryBySlug(slug);
        const name = categoryData?.name || slug.replace(/-/g, ' ');
        const title = `${name} | Urban Drip`;
        const description = `Shop ${name} sneakers and streetwear at Urban Drip Algeria.`;

        return {
            title,
            description,
            alternates: {
                canonical: `https://urbandrip.dz/category/${slug}`,
            },
            openGraph: {
                title,
                description,
                url: `https://urbandrip.dz/category/${slug}`,
            },
        };
    } catch (error) {
        console.error(`Error generating metadata for category ${slug}:`, error);
    }

    return {
        title: 'Category | Urban Drip',
        alternates: {
            canonical: `https://urbandrip.dz/category/${slug}`,
        },
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const paramsResolved = await params;
    const slug = paramsResolved.slug;
    
    const dataSource = new DjangoProductDataSource();
    const repository = new ProductRepositoryImpl(dataSource);
    
    let categoryData: any = null;
    let products: Product[] = [];
    
    try {
        // Fetch category details
        categoryData = await dataSource.getCategoryBySlug(slug);
        
        // Fetch products by category slug
        products = await repository.getProductsByCategory(slug);
    } catch (error) {
        console.error(`Error loading category page for ${slug}:`, error);
    }

    const title = categoryData ? categoryData.name : slug.replace(/-/g, ' ');
    const bannerImage = categoryData ? (categoryData.banner || categoryData.image) : undefined;

    return (
        <ProductGridPage
            title={title}
            category={slug}
            showHero={!!bannerImage}
            bannerImage={bannerImage}
            products={products || []}
        />
    );
}
