import { redirect } from 'next/navigation';

import { getCurrentUser } from '../../lib/api-server';
import CheckoutView from '../../components/checkout/CheckoutView';

export const metadata = {
  title: 'Checkout'
};

export default async function CheckoutPage () {
  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (!currentUser) {
    redirect('/signin');
  }

  return <CheckoutView currentUser={currentUser} />;
}
