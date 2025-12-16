import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful-management';

function generateOrderNumber(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
      return NextResponse.json(
        { error: 'Management token not configured' },
        { status: 500 }
      );
    }

    const client = createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    const orderNumber = generateOrderNumber();

    const entry = await environment.createEntry('order', {
      fields: {
        orderNumber: {
          'en-US': orderNumber,
        },
        customerEmail: {
          'en-US': orderData.customerEmail || 'guest@example.com',
        },
        customerName: {
          'en-US': orderData.customerName || 'Guest',
        },
        items: {
          'en-US': orderData.items,
        },
        shippingAddress: {
          'en-US': orderData.shippingAddress || {},
        },
        billingAddress: {
          'en-US': orderData.billingAddress || orderData.shippingAddress || {},
        },
        subtotal: {
          'en-US': orderData.subtotal,
        },
        tax: {
          'en-US': orderData.tax,
        },
        shipping: {
          'en-US': orderData.shipping,
        },
        total: {
          'en-US': orderData.total,
        },
        currency: {
          'en-US': orderData.currency || 'USD',
        },
        status: {
          'en-US': 'pending',
        },
        userId: {
          'en-US': orderData.userId || '',
        },
      },
    });

    await entry.publish();

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: entry.sys.id,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

