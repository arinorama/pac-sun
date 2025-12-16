import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl =
      process.env.EXCHANGE_RATE_API_URL ||
      'https://api.exchangerate-api.com/v4/latest/USD';

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }

    const data = await response.json();
    const rate = data.rates?.TRY || 1;

    return NextResponse.json({ rate });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    // Return default rate on error
    return NextResponse.json({ rate: 1 });
  }
}

