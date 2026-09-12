import ProductGridPage from '../../src/presentation/pages/ProductGridPage';
import { ProductRepositoryImpl } from '../../src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '../../src/data/datasources/DjangoProductDataSource';
import { GetLastDropProducts } from '../../src/domain/usecases/GetLastDropProducts';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Latest Drops & Releases | Urban Drip',
    description: 'Explore the newest sneaker drops and streetwear releases available at Urban Drip in Algeria.',
    alternates: {
        canonical: 'https://urbandrip.dz/latest-drops',
    },
    openGraph: {
        title: 'Latest Drops & Releases | Urban Drip',
        description: 'Explore the newest sneaker drops and streetwear releases available at Urban Drip in Algeria.',
        url: 'https://urbandrip.dz/latest-drops',
    },
};

export default async function LatestDropsPage() {
  const dataSource = new DjangoProductDataSource();
  const repository = new ProductRepositoryImpl(dataSource);
  const getLastDropProducts = new GetLastDropProducts(repository);

  // Fetch Category Details for the Banner
  const categoryData = await dataSource.getCategoryBySlug('latest-drops');

  // Fetch all products
  const products = await getLastDropProducts.execute(50);
  
  return (
    <ProductGridPage 
      title="Latest Drops" 
      products={products}
      showHero={true}
      bannerImage={categoryData?.banner || "/images/LATEST DROPS HERO BANNER.jfif"}
    />
  );
}
