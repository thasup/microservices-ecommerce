import { getCurrentUser, getProducts } from '../../lib/api-server';
import CartView from '../../components/cart/CartView';

export const metadata = {
  title: 'Cart'
};

export default async function CartPage () {
  const [products, currentUser] = await Promise.all([
    getProducts(),
    getCurrentUser()
  ]);

  return <CartView currentUser={currentUser} products={products} />;
}
