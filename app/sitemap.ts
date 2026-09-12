import { MetadataRoute } from 'next';
import { DjangoProductDataSource } from '../src/data/datasources/DjangoProductDataSource';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://urbandrip.dz';
  const now = new Date();

  // Static routes with hierarchy & priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/latest-drops`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/most-viewed`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let brandRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const dataSource = new DjangoProductDataSource();

    // Fetch Products for sitemap
    const products = await dataSource.getAllProducts();
    productRoutes = products.map((p) => ({
      url: `${baseUrl}/product/${p.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Fetch Brands
    const brands = await dataSource.getAllBrands();
    brandRoutes = brands.map((b) => ({
      url: `${baseUrl}/brand/${b.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Fetch Categories
    const categories = await dataSource.getAllCategories();
    categoryRoutes = categories.map((c) => ({
      url: `${baseUrl}/category/${c.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap dynamic data fetch fallback:', error);
  }

  return [
    ...staticRoutes,
    ...productRoutes,
    ...brandRoutes,
    ...categoryRoutes,
  ];
}
