'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH;

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${ADMIN_BASE_PATH}/dashboard`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
