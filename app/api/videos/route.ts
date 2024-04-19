import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'videos.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const videos = JSON.parse(fileContents);

    if (!Array.isArray(videos)) {
      throw new Error('Invalid video data format');
    }

    const origin = request.headers.get('Origin');

    const allowedOrigins = ['http://localhost:3000', 'https://your-production-domain.com'];

    const response = new Response(JSON.stringify(videos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

    return response;
  } catch (error) {
    console.error('Error reading videos data:', error);

    const response = new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

    return response;
  }
}