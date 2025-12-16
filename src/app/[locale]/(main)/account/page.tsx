'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div
        data-component="AccountPage"
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
      data-component="AccountPage"
      className="container mx-auto px-4 py-12"
    >
      <h1
        data-component="AccountPage.Title"
        className="text-3xl font-bold mb-8"
      >
        My Account
      </h1>

      <div
        data-component="AccountPage.Content"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div
          data-component="AccountPage.Profile"
          className="md:col-span-2"
        >
          <h2
            data-component="AccountPage.SectionTitle"
            className="text-xl font-semibold mb-4"
          >
            Profile Information
          </h2>
          <div
            data-component="AccountPage.ProfileInfo"
            className="space-y-2"
          >
            <p>
              <span className="font-medium">Email:</span> {session.user?.email}
            </p>
            {session.user?.name && (
              <p>
                <span className="font-medium">Name:</span> {session.user.name}
              </p>
            )}
          </div>
        </div>

        <div
          data-component="AccountPage.QuickLinks"
          className="space-y-4"
        >
          <h2
            data-component="AccountPage.SectionTitle"
            className="text-xl font-semibold mb-4"
          >
            Quick Links
          </h2>
          <Link href="/account/orders">
            <Button variant="secondary" fullWidth>
              Order History
            </Button>
          </Link>
          <Link href="/account/wishlist">
            <Button variant="secondary" fullWidth>
              Wishlist
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

