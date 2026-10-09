export interface CheckoutItem {
  id: string; // product id or line item id
  name: string;
  priceUsd: number;
  quantity: number;
  image?: string;
  href?: string;
}

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
  discountCode?: string;
}

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  reference?: string;
  totalAmount?: number;
  error?: string;
}
