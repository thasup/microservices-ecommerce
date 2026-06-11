import { redirect } from 'next/navigation';

import {
  getCurrentUser,
  getMyOrders,
  getMyReviews,
  getProducts,
  getUsers
} from '../../lib/api-server';
import DashboardView from '../../components/account/DashboardView';

export const metadata = {
  title: 'Account Setting'
};

export default async function DashboardPage () {
  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (!currentUser) {
    redirect('/signin');
  }

  const [users, myOrders, myReviews, products] = await Promise.all([
    getUsers(),
    getMyOrders(),
    getMyReviews(),
    getProducts()
  ]);

  return (
    <DashboardView
      currentUser={currentUser}
      users={users}
      myOrders={myOrders}
      myReviews={myReviews}
      products={products}
    />
  );
}
