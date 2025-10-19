export class RevalidationService {
  async revalidateProject(slug) {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const secret = process.env.REVALIDATE_SECRET;

      // Skip if no secret (development)
      if (!secret) {
        console.log('Revalidate secret not set, skipping revalidation');
        return { skipped: true, reason: 'No secret' };
      }

      const url = `${baseUrl}/api/revalidate?secret=${secret}&slug=${encodeURIComponent(
        slug
      )}`;

      const response = await fetch(url, {
        method: 'POST',
        // Timeout after 5 seconds
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(
          `Revalidation failed: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log(`Manual revalidation successful: ${slug}`, result);

      return result;
    } catch (error) {
      // Revalidation fail olsa bile işleme devam et
      console.warn('Revalidation failed (non-critical):', error.message);
      return { error: error.message, critical: false };
    }
  }

  async revalidateAll() {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const secret = process.env.REVALIDATE_SECRET;

      if (!secret) {
        console.log(' Revalidate secret not set, skipping revalidation');
        return { skipped: true, reason: 'No secret' };
      }

      const url = `${baseUrl}/api/revalidate?secret=${secret}&all=true`;

      const response = await fetch(url, {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(
          `Revalidation failed: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log('Manual revalidation successful: ALL PAGES', result);

      return result;
    } catch (error) {
      console.warn('Revalidation failed (non-critical):', error.message);
      return { error: error.message, critical: false };
    }
  }

  async revalidateLandingPage() {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const secret = process.env.REVALIDATE_SECRET;

      if (!secret) {
        console.log(' Revalidate secret not set, skipping revalidation');
        return { skipped: true, reason: 'No secret' };
      }

      const url = `${baseUrl}/api/revalidate?secret=${secret}`;

      const response = await fetch(url, {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(
          `Revalidation failed: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log('Manual revalidation successful: LANDING PAGE', result);

      return result;
    } catch (error) {
      console.warn('Revalidation failed (non-critical):', error.message);
      return { error: error.message, critical: false };
    }
  }
}

export const revalidationService = new RevalidationService();
