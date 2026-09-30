import { getCurrentUser, getBestseller } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'Bestseller Bottoms'
};

export default async function BottomBestsellerPage () {
  const [products, currentUser] = await Promise.all([
    getBestseller(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Bottom"
      categoryParams="bottoms"
      mode="bestseller"
      currentUser={currentUser}
    />
  );
}
