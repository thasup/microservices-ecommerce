import { getCurrentUser, getProducts } from '../../../lib/api-server';
import CategoryPage from '../../../components/category/CategoryPage';

export const metadata = {
  title: 'Tops'
};

export default async function TopsPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Top"
      categoryParams="tops"
      mode="all"
      currentUser={currentUser}
    />
  );
}
