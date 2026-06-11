import { getCurrentUser, getProducts } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'New Arrivals Tops'
};

export default async function TopNewArrivalsPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Top"
      categoryParams="tops"
      mode="new"
      currentUser={currentUser}
    />
  );
}
