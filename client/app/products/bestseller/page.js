import { getBestseller, getCurrentUser } from '../../../lib/api-server';
import CategoryPage from '../../../components/category/CategoryPage';

export const metadata = {
  title: 'BestSeller'
};

export default async function BestsellerPage () {
  const [bestseller, currentUser] = await Promise.all([
    getBestseller(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={bestseller}
      category={null}
      mode="bestseller"
      currentUser={currentUser}
    />
  );
}
