import { getCurrentUser, getBestseller } from '../../../../lib/api-server';
import CategoryPage from '../../../../components/category/CategoryPage';

export const metadata = {
  title: 'Bestseller Sets'
};

export default async function SetBestsellerPage () {
  const [products, currentUser] = await Promise.all([
    getBestseller(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Set"
      categoryParams="sets"
      mode="bestseller"
      currentUser={currentUser}
    />
  );
}
