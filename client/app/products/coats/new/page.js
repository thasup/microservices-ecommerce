import { getCurrentUser, getProducts } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'New Arrivals Coats'
};

export default async function CoatNewArrivalsPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Coat"
      categoryParams="coats"
      mode="new"
      currentUser={currentUser}
    />
  );
}
