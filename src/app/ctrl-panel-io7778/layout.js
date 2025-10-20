'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function AdminRootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Sadece loading bittiyse ve login değilse auth'a yönlendir
    if (!isLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Checking Access...</h2>
          <p>Verifying your permissions</p>
        </div>
      </div>
    );
  }

  // Eğer login değilse, yukarıdaki useEffect zaten yönlendirecek
  // Bu noktaya gelirse demek ki authenticated → children'ı render et
  return <>{children}</>;
}
