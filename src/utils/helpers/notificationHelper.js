import { notification } from 'antd';

export const notify = {
  success: (message, description) => {
    if (typeof window !== 'undefined') {
      notification.success({
        message,
        description,
        duration: 5,
        placement: 'topRight',
      });
    }
  },
  error: (message, description) => {
    if (typeof window !== 'undefined') {
      notification.error({
        message,
        description,
        duration: 5,
        placement: 'topRight',
      });
    }
  },
  warning: (message, description) => {
    if (typeof window !== 'undefined') {
      notification.warning({
        message,
        description,
        duration: 5,
        placement: 'topRight',
      });
    }
  },
  info: (message, description) => {
    if (typeof window !== 'undefined') {
      notification.info({
        message,
        description,
        duration: 5,
        placement: 'topRight',
      });
    }
  },
};
