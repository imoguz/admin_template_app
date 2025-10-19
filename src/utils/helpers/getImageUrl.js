export const getImageUrl = (url) => {
  if (!url) return '/images/web-site.jpg';

  if (url.startsWith('http')) return url;

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') ||
    'http://localhost:8000';

  let cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${backendBaseUrl}${cleanUrl}`;
};
