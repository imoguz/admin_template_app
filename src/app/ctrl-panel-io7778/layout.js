'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Result, Spin } from 'antd';

export default function AdminRootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <Result
          icon={<Spin size="large" />}
          title="Security Verification"
          subTitle="Checking your access permissions..."
        />
      </div>
    );
  }

  return <>{children}</>;
}
