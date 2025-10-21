import { CACHE } from '@/utils/constants';
import { publicApi } from '@/lib/api/publicApi';
import Image from 'next/image';
import { getImageUrl } from '@/utils/helpers';

// Static generation (ISR)
export const revalidate = CACHE.LANDING_STATIC;

export default async function LandingPage() {
  const projects = await publicApi.getAllPublishedProjects(false);

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Project Showcase
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover all published landing pages built with Next.js & ISR.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project._id}
              href={`/${project.slug}`}
              className="group no-underline relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-52 overflow-hidden">
                <Image
                  src={getImageUrl(
                    project.thumbnail?.url
                      ? project.thumbnail.url
                      : '/web-site.png'
                  )}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 group-hover:opacity-60 transition-all"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl text-center capitalize font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                  {project.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  Description:{' '}
                  {project.description || 'No description available'}
                </p>

                <div className="text-sm text-gray-500">
                  Section Count: {project.sections?.length || 0} sections
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Projects Published Yet
            </h2>
            <p className="text-gray-500">
              Publish a project to see it appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
