'use client';

import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/atoms/Button';
import { useFormatPrice } from '@/lib/currency/converter';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } =
    useCartStore();
  const formatPrice = useFormatPrice();

  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div
        data-component="CartPage"
        className="container mx-auto px-4 py-12"
      >
        <div
          data-component="CartPage.Empty"
          className="text-center"
        >
          <h1
            data-component="CartPage.EmptyTitle"
            className="text-2xl font-bold mb-4"
          >
            Your cart is empty
          </h1>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      data-component="CartPage"
      className="container mx-auto px-4 py-12"
    >
      <h1
        data-component="CartPage.Title"
        className="text-3xl font-bold mb-8"
      >
        Shopping Cart
      </h1>

      <div
        data-component="CartPage.Content"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div
          data-component="CartPage.Items"
          className="lg:col-span-2 space-y-4"
        >
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              data-component="CartPage.Item"
              className="flex gap-4 border-b border-border pb-4"
            >
              <div
                data-component="CartPage.ItemImage"
                className="relative w-24 h-24 flex-shrink-0"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                  sizes="96px"
                />
              </div>
              <div
                data-component="CartPage.ItemInfo"
                className="flex-1"
              >
                <h3
                  data-component="CartPage.ItemTitle"
                  className="font-medium mb-1"
                >
                  {item.title}
                </h3>
                {item.size && (
                  <p
                    data-component="CartPage.ItemSize"
                    className="text-sm text-foreground-subtle"
                  >
                    Size: {item.size}
                  </p>
                )}
                <div
                  data-component="CartPage.ItemActions"
                  className="flex items-center gap-4 mt-2"
                >
                  <div
                    data-component="CartPage.ItemQuantity"
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 border rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-error text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div
                data-component="CartPage.ItemPrice"
                className="text-right"
              >
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          data-component="CartPage.Summary"
          className="lg:col-span-1"
        >
          <div
            data-component="CartPage.SummaryCard"
            className="border border-border rounded-lg p-6 sticky top-20"
          >
            <h2
              data-component="CartPage.SummaryTitle"
              className="text-xl font-bold mb-4"
            >
              Order Summary
            </h2>
            <div
              data-component="CartPage.SummaryDetails"
              className="space-y-2 mb-4"
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
            <Link href="/checkout/address">
              <Button variant="primary" fullWidth>
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

