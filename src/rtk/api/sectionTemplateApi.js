import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const sectionTemplateApi = createApi({
  reducerPath: 'sectionTemplateApi',
  baseQuery: customBaseQuery,
  tagTypes: ['SectionTemplate'],
  endpoints: (builder) => ({
    getSectionTemplates: builder.query({
      query: () => ({
        url: '/section-template',
        method: 'GET',
      }),
      providesTags: ['SectionTemplate'],
    }),

    getSectionTemplate: builder.query({
      query: (id) => ({
        url: `/section-template/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'SectionTemplate', id }],
    }),

    createSectionTemplate: builder.mutation({
      query: (body) => ({
        url: '/section-template',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['SectionTemplate'],
    }),

    updateSectionTemplate: builder.mutation({
      query: ({ id, body }) => ({
        url: `/section-template/${id}`,
        method: 'PUT',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SectionTemplate', id },
        { type: 'SectionTemplate' },
      ],
    }),

    deleteSectionTemplate: builder.mutation({
      query: (id) => ({
        url: `/section-template/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SectionTemplate'],
    }),
  }),
});

export const {
  useGetSectionTemplateQuery,
  useGetSectionTemplatesQuery,
  useCreateSectionTemplateMutation,
  useUpdateSectionTemplateMutation,
  useDeleteSectionTemplateMutation,
} = sectionTemplateApi;
