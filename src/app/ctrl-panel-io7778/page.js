'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ctrl-panel-io7778/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
