import { CACHE } from '@/utils/constants';
import { publicApi } from '@/lib/api/publicApi';

// Static generation
export const revalidate = CACHE.LANDING_STATIC;

export default async function LandingPage() {
  const projects = await publicApi.getAllPublishedProjects(false);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Showcase
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our published projects with ISR-powered pages
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project._id}
              href={`/${project.slug}`}
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 bg-white group"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600">📁</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {project.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{project.sections?.length || 0} sections</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  ISR Ready
                </span>
              </div>
            </a>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Projects Published Yet
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}
