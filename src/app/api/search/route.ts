import { NextRequest, NextResponse } from 'next/server';
import { searchClient, getIndexName } from '@/lib/algolia/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '0');
    const hitsPerPage = parseInt(searchParams.get('hitsPerPage') || '20');

    const indexName = getIndexName(locale);
    const index = searchClient.initIndex(indexName);

    const { hits, nbHits, nbPages } = await index.search(query, {
      page,
      hitsPerPage,
    });

    return NextResponse.json({
      hits,
      nbHits,
      nbPages,
      page,
      hitsPerPage,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

