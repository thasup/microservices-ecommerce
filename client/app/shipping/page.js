import { redirect } from 'next/navigation';

import { getCurrentUser } from '../../lib/api-server';
import ShippingForm from '../../components/checkout/ShippingForm';

export const metadata = {
  title: 'Shipping Address'
};

export default async function ShippingPage () {
  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (!currentUser) {
    redirect('/signin');
  }

  return <ShippingForm currentUser={currentUser} />;
}
