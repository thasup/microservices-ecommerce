import { redirect } from 'next/navigation';

import {
  getCurrentUser,
  getOrderProducts,
  getOrders,
  getPaymentProducts,
  getProducts,
  getUsers
} from '../../lib/api-server';
import AdminDashboardView from '../../components/dashboard/AdminDashboardView';

export const metadata = {
  title: 'Admin Dashboard'
};

export default async function AdminDashboardPage () {
  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (!currentUser?.isAdmin) {
    redirect('/signin');
  }

  const [products, users, orders, orderProducts, paymentProducts] =
    await Promise.all([
      getProducts(),
      getUsers(),
      getOrders(),
      getOrderProducts(),
      getPaymentProducts()
    ]);

  return (
    <AdminDashboardView
      products={products}
      users={users}
      orders={orders}
      orderProducts={orderProducts}
      paymentProducts={paymentProducts}
    />
  );
}
