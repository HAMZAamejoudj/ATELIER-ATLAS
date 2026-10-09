import type { OrderStatus } from "@/types/database";

export type { OrderStatus };

export interface AdminOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string | null;
}

export interface AdminOrder {
  id: string;
  reference: string;
  createdAt: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  totalAmount: number;
  currency: string;
  paymentProvider: string;
  paymentId: string | null;
  notes: string | null;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
    phone: string | null;
  } | null;
  itemsCount: number;
  items: AdminOrderItem[];
}
