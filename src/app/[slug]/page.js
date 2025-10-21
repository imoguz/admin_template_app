import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/api/publicApi';
import SectionRenderer from '@/components/section-renderer/SectionRenderer';

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
  console.log(project.sections);
  const sortedSections = project.sections || [];
  return (
    <div className="min-h-screen bg-white">
      <main>
        {sortedSections.length > 0 ? (
          sortedSections.map((section) => (
            <SectionRenderer key={section._id} section={section} />
          ))
        ) : (
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
