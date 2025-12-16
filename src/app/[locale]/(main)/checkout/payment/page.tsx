'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { useCartStore } from '@/store/useCartStore';
import { useFormatPrice } from '@/lib/currency/converter';
import { useState } from 'react';

export default function PaymentPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const formatPrice = useFormatPrice();
  const [isProcessing, setIsProcessing] = useState(false);

  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Mock payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
        })),
        subtotal,
        tax,
        shipping,
        total,
        currency: 'USD', // TODO: Get from currency store
        customerEmail: 'guest@example.com', // TODO: Get from session
        customerName: 'Guest', // TODO: Get from session
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        router.push(`/checkout/confirmation?orderNumber=${data.orderNumber}`);
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      data-component="PaymentPage"
      className="container mx-auto px-4 py-12 max-w-2xl"
    >
      <h1
        data-component="PaymentPage.Title"
        className="text-3xl font-bold mb-8"
      >
        Payment
      </h1>

      <div
        data-component="PaymentPage.Summary"
        className="border border-border rounded-lg p-6 mb-8"
      >
        <h2
          data-component="PaymentPage.SummaryTitle"
          className="text-xl font-semibold mb-4"
        >
          Order Summary
        </h2>
        <div
          data-component="PaymentPage.SummaryDetails"
          className="space-y-2"
        >
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div
        data-component="PaymentPage.MockPayment"
        className="border border-border rounded-lg p-6 mb-8"
      >
        <p className="text-foreground-subtle mb-4">
          This is a mock payment. Click the button below to simulate payment.
        </p>
        <Button
          data-component="PaymentPage.PayButton"
          variant="primary"
          fullWidth
          size="lg"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Complete Payment'}
        </Button>
      </div>

      <Button
        data-component="PaymentPage.BackButton"
        variant="secondary"
        onClick={() => router.back()}
      >
        Back
      </Button>
    </div>
  );
}

