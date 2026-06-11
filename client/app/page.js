import { getCurrentUser, getProducts } from '../lib/api-server';
import HomeView from '../components/home/HomeView';

export default async function HomePage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return <HomeView products={products} currentUser={currentUser} />;
}
