'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/atoms/Spinner';
import { useFormatPrice } from '@/lib/currency/converter';

interface Order {
  orderNumber: string;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const formatPrice = useFormatPrice();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      // TODO: Fetch orders from Contentful
      // For now, return empty array
      setIsLoading(false);
    }
  }, [session]);

  if (status === 'loading' || isLoading) {
    return (
      <div
        data-component="OrdersPage"
        className="container mx-auto px-4 py-12"
      >
        <div className="flex justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div
      data-component="OrdersPage"
      className="container mx-auto px-4 py-12"
    >
      <h1
        data-component="OrdersPage.Title"
        className="text-3xl font-bold mb-8"
      >
        Order History
      </h1>

      {orders.length === 0 ? (
        <div
          data-component="OrdersPage.Empty"
          className="text-center py-12"
        >
          <p className="text-foreground-subtle mb-4">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div
          data-component="OrdersPage.List"
          className="space-y-4"
        >
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              data-component="OrdersPage.Order"
              className="border border-border rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-foreground-subtle">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-sm text-foreground-subtle">
                    {order.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

