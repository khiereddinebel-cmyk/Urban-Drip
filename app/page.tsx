/* This file simply delegates to the Presentation Layer Page for Clean Architecture mapping */
import HomePage from '../src/presentation/pages/Home';
import { GetLastDropProducts } from '../src/domain/usecases/GetLastDropProducts';
import { ProductRepositoryImpl } from '../src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '../src/data/datasources/DjangoProductDataSource';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Urban Drip | Step Into Style',
    description: 'Urban Drip — Step Into Style. Discover premium sneakers, streetwear, and the latest drops in Algeria.',
    alternates: {
        canonical: 'https://urbandrip.dz/',
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: 'Urban Drip | Step Into Style',
        description: 'Urban Drip — Step Into Style. Discover premium sneakers, streetwear, and the latest drops in Algeria.',
        url: 'https://urbandrip.dz/',
        siteName: 'Urban Drip',
        images: [
            {
                url: 'https://urbandrip.dz/hero-banner.png',
                width: 1200,
                height: 630,
                alt: 'Urban Drip — Step Into Style',
            },
        ],
    },
};

export default async function AppIndex() {
  // Instantiate Use Cases following Clean Architecture
  const dataSource = new DjangoProductDataSource();
  const repository = new ProductRepositoryImpl(dataSource);
  const getLastDropProducts = new GetLastDropProducts(repository);

  const products = await getLastDropProducts.execute(8); // Fetch 8 latest products

  return <HomePage featured={products} />;
}
