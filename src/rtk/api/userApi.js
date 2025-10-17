import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
        meta: { skipAuth: true },
      }),
      invalidatesTags: ['Users'],
    }),

    getUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

    getUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users' },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),

    purgeUser: builder.mutation({
      query: (id) => ({
        url: `/users/purge/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users' },
      ],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  usePurgeUserMutation,
} = userApi;
