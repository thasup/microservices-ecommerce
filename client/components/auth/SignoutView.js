'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import useRequest from '../../hooks/useRequest';
import Loader from '../common/Loader';

const SignoutView = () => {
  const router = useRouter();
  const requested = useRef(false);

  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      router.push('/');
      router.refresh();
    }
  });

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    doRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center px-0"
      style={{ marginTop: '80px' }}
    >
      <Loader />
    </div>
  );
};

export default SignoutView;
