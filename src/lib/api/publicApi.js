const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//  Public API calls for SSR/ISR
export const publicApi = {
  async getProjectBySlug(slug, revalidate = 3600) {
    try {
      const res = await fetch(`${API_BASE_URL}/public/projects/${slug}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: {
          revalidate,
          tags: [`project:${slug}`],
        },
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.data) {
        // Sort sections by order
        if (data.data.sections) {
          data.data.sections.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        return data.data;
      }

      return null;
    } catch (error) {
      console.error('Public API Error:', error);
      return null;
    }
  },

  async getAllPublishedProjects(revalidate = false) {
    try {
      const res = await fetch(`${API_BASE_URL}/public/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: revalidate ? 3600 : false,
          tags: ['public-projects'],
        },
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Public API Error:', error);
      return [];
    }
  },
};
