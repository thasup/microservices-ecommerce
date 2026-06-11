import { notFound } from 'next/navigation';

import {
  getCurrentUser,
  getMyOrders,
  getProduct,
  getProducts,
  getUsers
} from '../../../lib/api-server';
import ProductDetail from '../../../components/product/ProductDetail';

export async function generateMetadata ({ params }) {
  const { productId } = await params;
  const product = await getProduct(productId);

  return {
    title: product?.title ?? 'Product'
  };
}

export default async function ProductPage ({ params }) {
  const { productId } = await params;

  const [product, products, users, currentUser] = await Promise.all([
    getProduct(productId),
    getProducts(),
    getUsers(),
    getCurrentUser()
  ]);

  if (!product) {
    notFound();
  }

  const myOrders = currentUser ? await getMyOrders() : [];

  return (
    <ProductDetail
      product={product}
      products={products}
      users={users}
      currentUser={currentUser}
      myOrders={myOrders}
    />
  );
}
