import ProductDetailsPage from '@/src/presentation/pages/ProductDetails';
import { GetProductById } from '@/src/domain/usecases/GetProductById';
import { ProductRepositoryImpl } from '@/src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '@/src/data/datasources/DjangoProductDataSource';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const paramsResolved = await params;
    const id = paramsResolved.id;

    try {
        const dataSource = new DjangoProductDataSource();
        const repository = new ProductRepositoryImpl(dataSource);
        const getProductById = new GetProductById(repository);
        const product = await getProductById.execute(id);

        if (product) {
            const title = `${product.name} | Urban Drip`;
            const description = product.description 
                ? product.description.slice(0, 155) 
                : `${product.name} — Buy online at Urban Drip Algeria.`;
            const imageUrl = product.images?.[0] || 'https://urbandrip.dz/hero-banner.png';

            return {
                title,
                description,
                alternates: {
                    canonical: `https://urbandrip.dz/product/${id}`,
                },
                openGraph: {
                    title,
                    description,
                    url: `https://urbandrip.dz/product/${id}`,
                    images: [{ url: imageUrl }],
                },
            };
        }
    } catch (error) {
        console.error(`Error generating metadata for product ${id}:`, error);
    }

    return {
        title: 'Product Details | Urban Drip',
        alternates: {
            canonical: `https://urbandrip.dz/product/${id}`,
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const paramsResolved = await params;
    const id = paramsResolved.id;

    // Clean Architecture instantiation
    const dataSource = new DjangoProductDataSource();
    const repository = new ProductRepositoryImpl(dataSource);
    const getProductById = new GetProductById(repository);

    let product = null;
    try {
        product = await getProductById.execute(id);
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
    }

    if (!product) {
        notFound();
    }

    return <ProductDetailsPage product={product} />;
}
