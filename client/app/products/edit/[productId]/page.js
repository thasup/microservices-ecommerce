import { redirect } from 'next/navigation';

import { getCurrentUser, getProduct } from '../../../../lib/api-server';
import EditProductForm from '../../../../components/dashboard/EditProductForm';

export const metadata = {
  title: 'Edit Product Information'
};

export default async function EditProductPage ({ params }) {
  const { productId } = await params;

  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (!currentUser?.isAdmin) {
    redirect('/signin');
  }

  const product = await getProduct(productId);

  return <EditProductForm product={product} productId={productId} />;
}
