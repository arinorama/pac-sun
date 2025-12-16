'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  sameAsShipping: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'US',
      sameAsShipping: false,
    },
  });

  const sameAsShipping = watch('sameAsShipping');

  const onSubmit = (data: AddressFormData) => {
    // Store address data (could use Zustand or pass via query params)
    router.push('/checkout/payment');
  };

  return (
    <div
      data-component="AddressPage"
      className="container mx-auto px-4 py-12 max-w-2xl"
    >
      <h1
        data-component="AddressPage.Title"
        className="text-3xl font-bold mb-8"
      >
        Shipping Address
      </h1>

      <form
        data-component="AddressPage.Form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div
          data-component="AddressPage.Shipping"
          className="space-y-4"
        >
          <h2
            data-component="AddressPage.SectionTitle"
            className="text-xl font-semibold"
          >
            Shipping Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Address Line 1"
            {...register('address1')}
            error={errors.address1?.message}
          />

          <Input
            label="Address Line 2 (Optional)"
            {...register('address2')}
            error={errors.address2?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="State"
              {...register('state')}
              error={errors.state?.message}
            />
            <Input
              label="Zip Code"
              {...register('zipCode')}
              error={errors.zipCode?.message}
            />
          </div>

          <Input
            label="Country"
            {...register('country')}
            error={errors.country?.message}
          />

          <Input
            label="Phone (Optional)"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <div
          data-component="AddressPage.Billing"
          className="space-y-4"
        >
          <label
            data-component="AddressPage.SameAsShipping"
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              {...register('sameAsShipping')}
              className="rounded border-border"
            />
            <span>Billing address same as shipping</span>
          </label>

          {!sameAsShipping && (
            <div className="space-y-4">
              <h2
                data-component="AddressPage.SectionTitle"
                className="text-xl font-semibold"
              >
                Billing Address
              </h2>
              {/* Billing address fields would go here */}
            </div>
          )}
        </div>

        <div
          data-component="AddressPage.Actions"
          className="flex gap-4"
        >
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Back to Cart
          </Button>
          <Button type="submit" variant="primary">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
}

