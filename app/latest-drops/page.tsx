import ProductGridPage from '../../src/presentation/pages/ProductGridPage';
import { ProductRepositoryImpl } from '../../src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '../../src/data/datasources/DjangoProductDataSource';
import { GetLastDropProducts } from '../../src/domain/usecases/GetLastDropProducts';

export const dynamic = 'force-dynamic';

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
