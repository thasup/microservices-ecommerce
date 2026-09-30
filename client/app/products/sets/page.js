import { getCurrentUser, getProducts } from '../../../lib/api-server';
import CategoryPage from '../../../components/category/CategoryPage';

export const metadata = {
  title: 'Sets'
};

export default async function SetsPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Set"
      categoryParams="sets"
      mode="all"
      currentUser={currentUser}
    />
  );
}
