import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { notify } from '@/utils/helpers/notificationHelper';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const handleLogout = async (api) => {
  api.dispatch({ type: 'auth/logout' });
  notify.error('Authorization Error', 'Session expired. Please login again.');

  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

export const customBaseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (args?.meta?.skipAuth) {
    return result;
  }

  // If the token has expired, refresh it
  if (result?.error?.status === 401) {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
          meta: { skipAuth: true },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data?.accessToken) {
        Cookies.set('accessToken', refreshResult.data.accessToken, {
          expires: 7,
        });

        // Retry original query
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        handleLogout(api);
      }
    } else {
      handleLogout(api);
    }
  }

  return result;
};
