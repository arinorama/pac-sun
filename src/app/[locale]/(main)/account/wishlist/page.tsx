'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import { getProducts } from '@/lib/contentful/queries';
import type { Product } from '@/types/product';

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { wishlist } = useUserStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlist.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Fetch products by IDs from Contentful
        // For now, return empty array
        setProducts([]);
      } catch (error) {
        console.error('Failed to fetch wishlist products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchWishlistProducts();
    }
  }, [wishlist, session]);

  if (status === 'loading' || isLoading) {
    return (
      <div
        data-component="WishlistPage"
        className="container mx-auto px-4 py-12"
      >
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div
      data-component="WishlistPage"
      className="container mx-auto px-4 py-12"
    >
      <h1
        data-component="WishlistPage.Title"
        className="text-3xl font-bold mb-8"
      >
        My Wishlist
      </h1>

      {products.length === 0 ? (
        <div
          data-component="WishlistPage.Empty"
          className="text-center py-12"
        >
          <p className="text-foreground-subtle mb-4">
            Your wishlist is empty.
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

