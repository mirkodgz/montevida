import { MetadataRoute } from 'next';
import { getStoreProducts, getSanityPosts } from '@/sanity/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Configuración Base (URL Oficial)
  const baseUrl = 'https://www.montevida.pe';

  // Páginas estáticas principales
  const staticPages = [
    '',
    '/tienda',
    '/blogs',
    '/contact',
    '/iniciar-sesion',
    '/registro',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Obtener Productos de Sanity
  let productsSitemap: MetadataRoute.Sitemap = [];
  try {
    const products = await getStoreProducts();
    if (products) {
        productsSitemap = products.map((product) => ({
        url: `${baseUrl}/producto/${product.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
        }));
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Obtener Artículos de Blog de Sanity
  let postsSitemap: MetadataRoute.Sitemap = [];
  try {
    const posts = await getSanityPosts();
    if (posts) {
        postsSitemap = posts.map((post) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date().toISOString(), // Idealmente usar `post.publishedAt` si existe
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        }));
    }
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  return [...staticPages, ...productsSitemap, ...postsSitemap];
}
