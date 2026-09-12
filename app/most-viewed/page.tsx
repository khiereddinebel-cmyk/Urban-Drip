import ProductGridPage from '../../src/presentation/pages/ProductGridPage';
import { ProductRepositoryImpl } from '../../src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '../../src/data/datasources/DjangoProductDataSource';
import { GetMostViewedProducts } from '../../src/domain/usecases/GetMostViewedProducts';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Most Viewed Sneakers & Streetwear | Urban Drip',
    description: 'Browse the most viewed and trending sneakers and streetwear items at Urban Drip in Algeria.',
    alternates: {
        canonical: 'https://urbandrip.dz/most-viewed',
    },
    openGraph: {
        title: 'Most Viewed Sneakers & Streetwear | Urban Drip',
        description: 'Browse the most viewed and trending sneakers and streetwear items at Urban Drip in Algeria.',
        url: 'https://urbandrip.dz/most-viewed',
    },
};

export default async function MostViewedPage() {
  const dataSource = new DjangoProductDataSource();
  const repository = new ProductRepositoryImpl(dataSource);
  const getMostViewedProducts = new GetMostViewedProducts(repository);

  // Fetch Category Details for the Banner
  const categoryData = await dataSource.getCategoryBySlug('most-viewed');
  
  // Fetch products
  const products = await getMostViewedProducts.execute(50);
  
  return (
    <ProductGridPage 
      title="Most Viewed Products" 
      products={products}
      showHero={true}
      bannerImage={categoryData?.banner || "/images/LATEST DROPS HERO BANNER.jfif"} 
    />
  );
}
