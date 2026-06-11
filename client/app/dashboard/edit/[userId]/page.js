import { redirect } from 'next/navigation';

import { getCurrentUser, getUsers } from '../../../../lib/api-server';
import UserEditForm from '../../../../components/account/UserEditForm';

export const metadata = {
  title: 'Edit User Information'
};

export default async function UserEditPage ({ params }) {
  const { userId } = await params;

  const currentUser = await getCurrentUser();

  // Protect unauthorized access
  if (!currentUser?.isAdmin) {
    redirect('/signin');
  }

  const users = await getUsers();
  const user = users.find((user) => user.id === userId);

  return <UserEditForm user={user} userId={userId} />;
}
