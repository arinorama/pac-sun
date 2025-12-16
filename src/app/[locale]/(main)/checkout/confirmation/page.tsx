'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORDER-12345';

  return (
    <div
      data-component="ConfirmationPage"
      className="container mx-auto px-4 py-12 max-w-2xl"
    >
      <div
        data-component="ConfirmationPage.Content"
        className="text-center"
      >
        <h1
          data-component="ConfirmationPage.Title"
          className="text-3xl font-bold mb-4"
        >
          Order Confirmed!
        </h1>
        <p
          data-component="ConfirmationPage.Message"
          className="text-foreground-subtle mb-8"
        >
          Thank you for your order. We've sent a confirmation email to your
          inbox.
        </p>

        <div
          data-component="ConfirmationPage.OrderNumber"
          className="border border-border rounded-lg p-6 mb-8"
        >
          <p className="text-sm text-foreground-subtle mb-2">
            Order Number
          </p>
          <p className="text-2xl font-bold">{orderNumber}</p>
        </div>

        <div
          data-component="ConfirmationPage.Actions"
          className="flex gap-4 justify-center"
        >
          <Link href="/">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="secondary">View Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

