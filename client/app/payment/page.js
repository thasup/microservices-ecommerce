import { getCurrentUser } from '../../lib/api-server';
import PaymentMethodForm from '../../components/checkout/PaymentMethodForm';

export const metadata = {
  title: 'Payment Method'
};

export default async function PaymentPage () {
  const currentUser = await getCurrentUser();

  // Redirect-to-signin/shipping guards are handled client-side
  // (they depend on localStorage)
  return <PaymentMethodForm currentUser={currentUser} />;
}
