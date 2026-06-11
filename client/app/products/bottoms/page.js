import { getCurrentUser, getProducts } from '../../../lib/api-server';
import CategoryPage from '../../../components/category/CategoryPage';

export const metadata = {
  title: 'Bottoms'
};

export default async function BottomsPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return (
    <CategoryPage
      products={products}
      category="Bottom"
      categoryParams="bottoms"
      mode="all"
      currentUser={currentUser}
    />
  );
}
