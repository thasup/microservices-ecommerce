import { getCurrentUser, getBestseller } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'Bestseller Dresses'
};

export default async function DressBestsellerPage () {
  const [products, currentUser] = await Promise.all([
    getBestseller(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Dress"
      categoryParams="dresses"
      mode="bestseller"
      currentUser={currentUser}
    />
  );
}
