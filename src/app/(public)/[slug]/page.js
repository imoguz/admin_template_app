// app/(public)/[slug]/page.js
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/api/publicApi';
import SectionRenderer from '@/components/section-renderer/SectionRenderer';

// Full static
export const revalidate = false;

export async function generateMetadata({ params }) {
  const project = await publicApi.getProjectBySlug(params.slug, false);

  if (!project) {
    return { title: 'Project Not Found' };
  }

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
  const projects = await publicApi.getAllPublishedProjects(false);
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }) {
  const project = await publicApi.getProjectBySlug(params.slug, false);

  if (!project) {
    notFound();
  }

  // Debug için console.log ekleyelim
  console.log('Project Data:', project);
  console.log('Sections:', project.sections);

  // Sort active sections by order
  const sortedSections =
    project.sections
      ?.filter((section) => section.isActive)
      ?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  console.log('Sorted Sections:', sortedSections);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Debug info - production'da kaldırılabilir */}
        <div className="container mx-auto px-4 py-4 bg-blue-50 border-b">
          <p className="text-sm text-blue-800">
            Debug: {sortedSections.length} active sections found
          </p>
        </div>

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
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-500">
                Project has {project.sections?.length || 0} sections total, but{' '}
                {sortedSections.length} are active.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
