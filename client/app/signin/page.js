import { redirect } from 'next/navigation';

import { getCurrentUser } from '../../lib/api-server';
import SigninForm from '../../components/auth/SigninForm';

export const metadata = {
  title: 'Sign In'
};

export default async function SigninPage () {
  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (currentUser) {
    redirect('/');
  }

  return <SigninForm />;
}
