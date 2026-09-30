import { getCurrentUser, getProducts } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'New Arrivals Dresses'
};

export default async function DressNewArrivalsPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Dress"
      categoryParams="dresses"
      mode="new"
      currentUser={currentUser}
    />
  );
}
