import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Validate Instagram URL
  if (!url.includes('instagram.com')) {
    return NextResponse.json({ error: 'Invalid Instagram URL' }, { status: 400 });
  }

  // Try multiple APIs as fallbacks
  const apis = [
    {
      name: 'saveig',
      buildUrl: (u: string) => `https://api.saveig.app/api/v1/media?url=${encodeURIComponent(u)}`,
      parse: (data: Record<string, unknown>) => {
        if (data && data.medias && Array.isArray(data.medias) && data.medias.length > 0) {
          const videoMedia = data.medias.find(
            (m: Record<string, unknown>) => m.type === 'video'
          ) || data.medias[0];
          return {
            thumbnail: (data.thumbnail as string) || (data.medias[0]?.thumbnail as string) || '',
            videoUrl: (videoMedia?.url as string) || (videoMedia?.download_url as string) || '',
            title: (data.title as string) || 'Instagram Reel',
          };
        }
        return null;
      },
    },
  ];

  for (const api of apis) {
    try {
      const apiUrl = api.buildUrl(url);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const result = api.parse(data as Record<string, unknown>);

      if (result && result.videoUrl) {
        return NextResponse.json({ success: true, ...result });
      }
    } catch {
      continue;
    }
  }

  // If all APIs fail, return fallback info
  return NextResponse.json({
    success: false,
    error: 'Direct download unavailable. The reel may be private or the service is temporarily unavailable.',
    alternatives: [
      { name: 'SaveInsta', url: 'https://saveinsta.app' },
      { name: 'iGram', url: 'https://igram.io' },
      { name: 'FastDl', url: 'https://fastdl.app' },
      { name: 'SnapInsta', url: 'https://snapinsta.app' },
    ],
  });
}
