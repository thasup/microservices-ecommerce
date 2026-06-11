import { redirect } from 'next/navigation';

import { getCurrentUser } from '../../lib/api-server';
import SignupForm from '../../components/auth/SignupForm';

export const metadata = {
  title: 'Sign Up'
};

export default async function SignupPage () {
  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (currentUser) {
    redirect('/');
  }

  return <SignupForm />;
}
