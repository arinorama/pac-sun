import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Contentful webhook payload types
interface ContentfulWebhookPayload {
  sys: {
    type: 'Entry' | 'Asset';
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields?: Record<string, unknown>;
}

/**
 * Unified Contentful Webhook Handler
 * Handles both revalidation and Algolia sync based on content type
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook secret
    const secret = request.headers.get('x-webhook-secret');
    const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { message: 'Server configuration error: Missing webhook secret' },
        { status: 500 }
      );
    }

    if (secret !== webhookSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // 2. Parse webhook payload
    const payload: ContentfulWebhookPayload = await request.json();

    const contentType = payload.sys.contentType?.sys.id;
    const entryId = payload.sys.id;
    const isEntry = payload.sys.type === 'Entry';

    // eslint-disable-next-line no-console
    console.log(`📥 Webhook received: ${contentType || 'Asset'} (${entryId})`);

    // 3. Handle based on content type
    const actions: string[] = [];

    // Always revalidate
    revalidatePath('/', 'layout');
    revalidatePath('/en', 'layout');
    revalidatePath('/tr', 'layout');
    actions.push('revalidated');

    // 4. Trigger Algolia sync for products
    if (isEntry && contentType === 'product') {
      try {
        // Trigger Algolia sync (non-blocking)
        const algoliaResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/sync/algolia`,
          {
            method: 'POST',
            headers: {
              'x-webhook-secret': webhookSecret,
            },
          }
        );

        if (algoliaResponse.ok) {
          actions.push('algolia-sync-triggered');
        } else {
          // eslint-disable-next-line no-console
          console.error('⚠️ Algolia sync failed:', await algoliaResponse.text());
          actions.push('algolia-sync-failed');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('⚠️ Algolia sync error:', error);
        actions.push('algolia-sync-error');
      }
    }

    return NextResponse.json({
      success: true,
      contentType: contentType || 'asset',
      entryId,
      actions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      {
        message: 'Error processing webhook',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Contentful webhook endpoint is active',
    features: ['revalidation', 'algolia-sync'],
  });
}



