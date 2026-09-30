'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import * as ga from '../../lib/ga';

const Analytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const queryString = searchParams?.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    ga.pageview(url);
  }, [pathname, searchParams]);

  return null;
};

export default Analytics;
