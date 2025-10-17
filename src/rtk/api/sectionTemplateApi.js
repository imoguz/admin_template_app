import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const sectionTemplateApi = createApi({
  reducerPath: 'sectionTemplateApi',
  baseQuery: customBaseQuery,
  tagTypes: ['SectionTemplates'],
  endpoints: (builder) => ({
    getSectionTemplates: builder.query({
      query: () => ({
        url: '/section-template',
        method: 'GET',
      }),
      providesTags: ['SectionTemplates'],
    }),

    getSectionTemplate: builder.query({
      query: (id) => ({
        url: `/section-templates/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'SectionTemplates', id }],
    }),

    createSectionTemplate: builder.mutation({
      query: (body) => ({
        url: '/section-templates',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['SectionTemplates'],
    }),

    updateSectionTemplate: builder.mutation({
      query: ({ id, body }) => ({
        url: `/section-templates/${id}`,
        method: 'PUT',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SectionTemplates', id },
        { type: 'SectionTemplates' },
      ],
    }),

    deleteSectionTemplate: builder.mutation({
      query: (id) => ({
        url: `/section-templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SectionTemplates'],
    }),
  }),
});

export const {
  useGetSectionTemplatesQuery,
  useGetSectionTemplateQuery,
  useCreateSectionTemplateMutation,
  useUpdateSectionTemplateMutation,
  useDeleteSectionTemplateMutation,
} = sectionTemplateApi;
