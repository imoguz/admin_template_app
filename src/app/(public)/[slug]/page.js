import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/api/publicApi';
import SectionRenderer from '@/components/section-renderer/SectionRenderer';

// Full static
export const revalidate = false;

export async function generateMetadata({ params }) {
  const project = await publicApi.getProjectBySlug(params.slug, false);

  // Not found metadata
  if (!project) {
    return { title: 'Project Not Found' };
  }

  // SEO metadata
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnail?.url ? [project.thumbnail.url] : [],
    },
  };
}

export async function generateStaticParams() {
  // Fetch published projects at build time
  const projects = await publicApi.getAllPublishedProjects(false);

  // Create static path for each project
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }) {
  // Fetch projeyi by url parameter
  const project = await publicApi.getProjectBySlug(params.slug, false);

  // If project not exist, redirec 404 page
  if (!project) {
    notFound();
  }

  // Sort active sections by order
  const sortedSections =
    project.sections
      ?.filter((section) => section.isActive)
      ?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  // Render landing page
  return (
    <div className="min-h-screen bg-white">
      <main>
        {sortedSections.length > 0 ? (
          sortedSections.map((section) => (
            <SectionRenderer key={section._id} section={section} />
          ))
        ) : (
          // Fallback
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-gray-600">
              {project.description || 'No sections configured yet.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
