// app/api/revalidate/route.js
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE } from '@/utils/constants';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');
    const all = searchParams.get('all');

    // Security check
    if (
      process.env.NODE_ENV === 'production' &&
      secret !== process.env.REVALIDATE_SECRET
    ) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (all === 'true') {
      // Revalidate all projects and landing page
      revalidatePath('/', 'layout');
      revalidateTag(CACHE.TAGS.PROJECTS);
      revalidateTag(CACHE.TAGS.LANDING);

      console.log('✅ Revalidated ALL pages and tags');

      return NextResponse.json({
        revalidated: true,
        type: 'all',
        timestamp: new Date().toISOString(),
      });
    }

    if (slug) {
      // Revalidate specific project page
      revalidatePath(`/${slug}`);
      revalidateTag(CACHE.TAGS.PROJECT(slug));

      console.log(`✅ Revalidated project: ${slug}`);

      return NextResponse.json({
        revalidated: true,
        slug,
        timestamp: new Date().toISOString(),
      });
    }

    // Default: revalidate landing page
    revalidatePath('/');
    revalidateTag(CACHE.TAGS.LANDING);

    console.log('✅ Revalidated landing page');

    return NextResponse.json({
      revalidated: true,
      type: 'landing',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
