export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  color?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: 'USD' | 'TRY';
  status: 'pending' | 'completed' | 'cancelled';
  userId?: string;
  createdAt?: string;
}

