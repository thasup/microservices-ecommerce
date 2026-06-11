import { getCurrentUser, getBestseller } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'Bestseller Tops'
};

export default async function TopBestsellerPage () {
  const [products, currentUser] = await Promise.all([
    getBestseller(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Top"
      categoryParams="tops"
      mode="bestseller"
      currentUser={currentUser}
    />
  );
}
