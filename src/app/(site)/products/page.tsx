import type { Metadata } from 'next';
import { ProductsView } from '@/components/shop/ProductsView';
import { getUnits } from '@/lib/products';

// Static, rebuilt in the background about every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop certified pre-owned MacBooks | Aladdin IT World',
  description: 'Certified pre-owned MacBooks, each inspected, graded and warranted. Filter by grade, size and chip.',
};

export default async function ProductsPage() {
  const { units, total } = await getUnits();
  return <ProductsView units={units} total={total} />;
}
