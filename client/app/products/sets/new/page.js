import { getCurrentUser, getProducts } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'New Arrivals Sets'
};

export default async function SetNewArrivalsPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Set"
      categoryParams="sets"
      mode="new"
      currentUser={currentUser}
    />
  );
}
