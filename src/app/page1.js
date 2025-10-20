'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spin } from 'antd';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center bg-sky-300">
      <h1 className="text-lg font-semibold">Admin Template App</h1>
      <Spin size="large" />
    </div>
  );
}
