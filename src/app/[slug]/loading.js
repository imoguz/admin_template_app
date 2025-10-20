import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
        size="large"
      />
      <p className="mt-4 text-base">Loading project...</p>
    </div>
  );
}
