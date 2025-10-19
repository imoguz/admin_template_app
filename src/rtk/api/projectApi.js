import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';
import { RevalidationService } from '@/app/api/revalidate/revalidate';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (body) => {
        const isFormData = body instanceof FormData;
        return {
          url: '/projects',
          method: 'POST',
          body,
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Revalidate landing page after create new projectet
          if (data?.data?.slug) {
            await RevalidationService.revalidateLandingPage();
            console.log('Auto-revalidated landing page after project creation');
          }
        } catch (error) {
          // Continue processing even if revalidation fails
          console.warn('Revalidation failed after project creation:', error);
        }
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

    getProjectBySlug: builder.query({
      query: (slug) => `/projects/slug/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Projects', id: slug }],
    }),

    updateProject: builder.mutation({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProject } = await queryFulfilled;

          // Revalidate if the project is published or the content has changed
          const shouldRevalidate =
            body.status === 'published' ||
            body.title ||
            body.slug ||
            body.description;

          if (shouldRevalidate && updatedProject.data?.slug) {
            await RevalidationService.revalidateProject(
              updatedProject.data.slug
            );
            console.log(
              'Auto-revalidated after project update:',
              updatedProject.data.slug
            );
          }
        } catch (error) {
          console.warn('Revalidation failed after project update:', error);
        }
      },
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
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        let projectSlug = null;

        try {
          const projectState = dispatch(
            projectApi.util.getQueryData('getProject', id)
          );
          if (projectState?.data?.slug) {
            projectSlug = projectState.data.slug;
          }
        } catch (error) {
          console.log('Could not find project slug for revalidation');
        }

        try {
          await queryFulfilled;

          // Revalidate after project deletion
          if (projectSlug) {
            await RevalidationService.revalidateProject(projectSlug);
            await RevalidationService.revalidateLandingPage();
            console.log(
              'Auto-revalidated after project deletion:',
              projectSlug
            );
          }
        } catch (error) {
          console.warn('Revalidation failed after project deletion:', error);
        }
      },
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

          // Optimistic update
          dispatch(
            projectApi.util.updateQueryData(
              'getProject',
              projectId,
              (draft) => {
                draft.data.sections.push(res.data);
              }
            )
          );

          // Revalidate after section addition
          try {
            const project = dispatch(
              projectApi.endpoints.getProject.initiate(projectId)
            );
            const projectData = await project.unwrap();

            if (
              projectData.data?.status === 'published' &&
              projectData.data?.slug
            ) {
              await RevalidationService.revalidateProject(
                projectData.data.slug
              );
              console.log(
                'Auto-revalidated after adding section:',
                projectData.data.slug
              );
            }

            project.unsubscribe();
          } catch (revalidateError) {
            console.warn(
              'Revalidation failed after adding section:',
              revalidateError
            );
          }
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

          // Revalidate after reordering sections
          try {
            const project = dispatch(
              projectApi.endpoints.getProject.initiate(projectId)
            );
            const projectData = await project.unwrap();

            if (
              projectData.data?.status === 'published' &&
              projectData.data?.slug
            ) {
              await RevalidationService.revalidateProject(
                projectData.data.slug
              );
              console.log(
                'Auto-revalidated after reordering sections:',
                projectData.data.slug
              );
            }

            project.unsubscribe();
          } catch (revalidateError) {
            console.warn(
              'Revalidation failed after reordering sections:',
              revalidateError
            );
          }
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
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Revalidate after updating section
          try {
            const project = dispatch(
              projectApi.endpoints.getProject.initiate(projectId)
            );
            const projectData = await project.unwrap();

            if (
              projectData.data?.status === 'published' &&
              projectData.data?.slug
            ) {
              await RevalidationService.revalidateProject(
                projectData.data.slug
              );
              console.log(
                'Auto-revalidated after updating section:',
                projectData.data.slug
              );
            }

            project.unsubscribe();
          } catch (revalidateError) {
            console.warn(
              'Revalidation failed after updating section:',
              revalidateError
            );
          }
        } catch (error) {
          console.error('Update section failed:', error);
        }
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
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Revalidate after deleting section
          try {
            const project = dispatch(
              projectApi.endpoints.getProject.initiate(projectId)
            );
            const projectData = await project.unwrap();

            if (
              projectData.data?.status === 'published' &&
              projectData.data?.slug
            ) {
              await RevalidationService.revalidateProject(
                projectData.data.slug
              );
              console.log(
                'Auto-revalidated after deleting section:',
                projectData.data.slug
              );
            }

            project.unsubscribe();
          } catch (revalidateError) {
            console.warn(
              'Revalidation failed after deleting section:',
              revalidateError
            );
          }
        } catch (error) {
          console.error('Delete section failed:', error);
        }
      },
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Projects', id: projectId },
      ],
    }),

    // Manuel revalidation
    revalidateProject: builder.mutation({
      query: ({ slug }) => ({
        url: `/projects/revalidate/${slug}`,
        method: 'POST',
      }),
      async onQueryStarted({ slug }, { queryFulfilled }) {
        try {
          await queryFulfilled;

          await RevalidationService.revalidateProject(slug);
          console.log('Manual revalidation successful:', slug);
        } catch (error) {
          console.error('Revalidation failed:', error);
        }
      },
    }),

    // Bulk revalidation
    revalidateAllProjects: builder.mutation({
      query: () => ({
        url: '/projects/revalidate-all',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;

          await RevalidationService.revalidateAll();
          console.log('Bulk revalidation successful');
        } catch (error) {
          console.error('Bulk revalidation failed:', error);
        }
      },
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectQuery,
  useGetProjectsQuery,
  useGetProjectBySlugQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddSectionMutation,
  useReorderSectionsMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useRevalidateProjectMutation,
  useRevalidateAllProjectsMutation,
} = projectApi;
