import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getUITexts } from '@/lib/contentful/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const products = await getProducts(locale, undefined, 5);
    const uiTexts = await getUITexts(locale);

    return NextResponse.json({
      success: true,
      locale,
      productsCount: products.length,
      uiTextsCount: Object.keys(uiTexts).length,
      sampleProducts: products.slice(0, 2).map((p) => ({
        id: p.sys.id,
        title: p.fields.title,
        slug: p.fields.slug,
      })),
      sampleUITexts: Object.fromEntries(
        Object.entries(uiTexts).slice(0, 5)
      ),
    });
  } catch (error) {
    console.error('Contentful test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

