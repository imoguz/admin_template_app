'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useLoginMutation } from '@/rtk/api/authApi';
import { notify } from '@/utils/helpers/notificationHelper';
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';

const { Title } = Typography;
const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH;

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      const targetPath = redirect || `/${ADMIN_BASE_PATH}/dashboard`;
      router.replace(targetPath);
    }
  }, [isAuthenticated, token, redirect, router]);

  const onFinish = async (values) => {
    try {
      await login(values).unwrap();

      notify.success('Login Successful', 'Welcome back!');

      const targetPath = redirect || `/${ADMIN_BASE_PATH}/dashboard`;
      router.replace(targetPath);
    } catch (err) {
      notify.error(
        'Login Failed',
        err?.data?.message || 'Invalid credentials. Please try again.'
      );
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-sky-950">
      <div className="grid grid-cols-2 bg-white rounded-xl max-w-6xl w-full max-h-[600px] h-full overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src="/images/login-secure-image.jpg"
            alt="Secure illustration"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <Title level={3} className="text-center">
                  Login
                </Title>

                <Form
                  name="login-form"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  layout="vertical"
                >
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Email"
                      className="py-2"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Please enter your password' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password"
                      className="py-2"
                    />
                  </Form.Item>

                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <Form.Item className="mt-6">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      block
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Log In
                    </Button>
                  </Form.Item>
                </Form>
                <div className="flex justify-between mx-1 mt-5 text-sm  text-blue-500">
                  <Link href="/auth/forgot-password">
                    <span className="text-sm text-blue-500 hover:text-blue-600 underline">
                      Forgot password?
                    </span>
                  </Link>
                  <div className="text-gray-800 ">
                    Don&apos;t have an account?
                    <Link href="/auth/signup">
                      <span className="text-blue-500 hover:text-blue-600 ml-1 underline">
                        Sign up
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
