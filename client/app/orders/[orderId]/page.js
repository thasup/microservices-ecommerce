import { redirect } from 'next/navigation';

import { getCurrentUser, getMyOrders, getOrder } from '../../../lib/api-server';
import OrderDetail from '../../../components/order/OrderDetail';

export const metadata = {
  title: 'Order'
};

export default async function OrderPage ({ params }) {
  const { orderId } = await params;

  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (!currentUser) {
    redirect('/signin');
  }

  const [order, myOrders] = await Promise.all([
    getOrder(orderId),
    getMyOrders()
  ]);

  // Only the order owner or an admin may view the order
  if (
    !order ||
    (!myOrders.some((myOrder) => myOrder.id === orderId) &&
      currentUser.isAdmin === false)
  ) {
    redirect('/signin');
  }

  return <OrderDetail order={order} currentUser={currentUser} />;
}
