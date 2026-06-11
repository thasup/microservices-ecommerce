import { getCurrentUser, getBestseller } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'Bestseller Coats'
};

export default async function CoatBestsellerPage () {
  const [products, currentUser] = await Promise.all([
    getBestseller(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Coat"
      categoryParams="coats"
      mode="bestseller"
      currentUser={currentUser}
    />
  );
}
