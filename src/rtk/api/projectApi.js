import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (body) => {
        let isFormData = body instanceof FormData;
        return {
          url: '/projects',
          method: 'POST',
          body,
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: ['Projects'],
    }),

    getProject: builder.query({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Projects', id }],
    }),

    getProjects: builder.query({
      query: () => ({
        url: '/projects',
        method: 'GET',
      }),
      providesTags: ['Projects'],
    }),

    updateProject: builder.mutation({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Projects', id },
        { type: 'Projects' },
      ],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),

    addSection: builder.mutation({
      query: ({ projectId, body }) => ({
        url: `/projects/${projectId}/sections`,
        method: 'POST',
        body,
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data: res } = await queryFulfilled;
          dispatch(
            projectApi.util.updateQueryData(
              'getProject',
              projectId,
              (draft) => {
                draft.data.sections.push(res.data);
              }
            )
          );
        } catch (err) {
          console.error('Add section failed', err);
        }
      },
    }),

    reorderSections: builder.mutation({
      query: ({ projectId, order }) => ({
        url: `/projects/${projectId}/sections/reorder`,
        method: 'PUT',
        body: { order },
      }),
      async onQueryStarted({ projectId, order }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          projectApi.util.updateQueryData('getProject', projectId, (draft) => {
            if (!draft?.data?.sections) return;
            const sectionsMap = {};
            draft.data.sections.forEach((s) => {
              sectionsMap[s._id] = s;
            });
            draft.data.sections = order.map((id, idx) => ({
              ...sectionsMap[id],
              order: idx,
            }));
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    updateSection: builder.mutation({
      query: ({ projectId, sectionId, body }) => {
        const isFormData = body instanceof FormData;
        return {
          url: `/projects/${projectId}/sections/${sectionId}`,
          method: 'PUT',
          body,
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Projects', id: projectId },
      ],
    }),

    deleteSection: builder.mutation({
      query: ({ projectId, sectionId }) => ({
        url: `/projects/${projectId}/sections/${sectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Projects', id: projectId },
      ],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectQuery,
  useGetProjectsQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddSectionMutation,
  useReorderSectionsMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = projectApi;
