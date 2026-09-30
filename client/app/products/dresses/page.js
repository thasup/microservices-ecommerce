import { getCurrentUser, getProducts } from '../../../lib/api-server';
import CategoryPage from '../../../components/category/CategoryPage';

export const metadata = {
  title: 'Dresses'
};

export default async function DressesPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Dress"
      categoryParams="dresses"
      mode="all"
      currentUser={currentUser}
    />
  );
}
