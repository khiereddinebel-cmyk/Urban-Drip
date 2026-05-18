/* This file simply delegates to the Presentation Layer Page for Clean Architecture mapping */
import HomePage from '../src/presentation/pages/Home';
import { GetLastDropProducts } from '../src/domain/usecases/GetLastDropProducts';
import { ProductRepositoryImpl } from '../src/data/repositories/ProductRepositoryImpl';
import { DjangoProductDataSource } from '../src/data/datasources/DjangoProductDataSource';

export const dynamic = 'force-dynamic';

export default async function AppIndex() {
  // Instantiate Use Cases following Clean Architecture
  const dataSource = new DjangoProductDataSource();
  const repository = new ProductRepositoryImpl(dataSource);
  const getLastDropProducts = new GetLastDropProducts(repository);

  const products = await getLastDropProducts.execute(8); // Fetch 8 latest products

  return <HomePage featured={products} />;
}
