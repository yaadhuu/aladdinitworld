import { pageMeta } from '@/lib/seo';
import { ProductsView } from '@/components/shop/ProductsView';
import { getUnits } from '@/lib/products';

// Static, rebuilt in the background about every 60 seconds
export const revalidate = 60;

export const metadata = pageMeta({
  title: 'Shop Certified Pre-Owned MacBooks | Aladdin IT World',
  description: 'Certified pre-owned MacBooks, each inspected, graded and warranted. Filter by grade, size and processor.',
  path: '/products',
});

export default async function ProductsPage() {
  const { units, total } = await getUnits();
  return <ProductsView units={units} total={total} />;
}
