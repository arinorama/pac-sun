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

    // Parse webhook payload (validate request)
    await request.json();

    // Revalidate everything from root - aggressive approach
    // This ensures all locales and nested routes are revalidated
    revalidatePath('/', 'layout');
    
    // Also revalidate specific locale paths for guaranteed coverage
    revalidatePath('/en', 'layout');
    revalidatePath('/tr', 'layout');

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
    message: 'Revalidation webhook endpoint is active (legacy - use /api/webhook/contentful)',
    deprecated: true,
  });
}

