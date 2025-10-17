'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spin } from 'antd';

const Home = () => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/projects');
    } else {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center bg-sky-300">
      <h1>Admin Template App</h1>
      <Spin size="large" />
      <span className="text-blue-500">Redirecting...</span>
    </div>
  );
};

export default Home;
