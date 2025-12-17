import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = request.headers.get('x-webhook-secret');
    const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (secret !== webhookSecret) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const body = await request.json();

    // Revalidate all locale pages
    // Note: This revalidates the entire locale routes
    // You can make this more granular based on content type
    revalidatePath('/[locale]', 'page');

    // If you want to be more specific:
    const contentType = body.sys?.contentType?.sys?.id;
    
    if (contentType === 'page') {
      // Revalidate specific page if you have the slug
      const slug = body.fields?.slug?.['en-US'] || body.fields?.slug?.['tr'];
      if (slug === 'home') {
        revalidatePath('/[locale]/(main)', 'page');
      }
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidation webhook endpoint is active',
  });
}

