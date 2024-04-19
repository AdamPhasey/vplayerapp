import ytdl from 'ytdl-core';

export async function GET(request: Request) {
  const videoUrl = new URL(request.url).searchParams.get('url');

  if (!videoUrl) {
    return new Response(JSON.stringify({ error: 'Missing video URL' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const videoInfo = {
      url: info.formats[0].url,
      title: info.videoDetails.title,
    };

    return new Response(JSON.stringify(videoInfo), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching video information:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch video information' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}