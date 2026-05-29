import ProductDetailsPage from '@/src/presentation/pages/ProductDetails';
import { GetProductById } from '@/src/domain/usecases/GetProductById';
import { ProductRepositoryImpl } from '@/src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '@/src/data/datasources/DjangoProductDataSource';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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
        // We could show a simple error or let it fall through to notFound
    }

    if (!product) {
        notFound();
    }

    return <ProductDetailsPage product={product} />;
}
