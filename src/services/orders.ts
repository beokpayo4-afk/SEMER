import { api } from "./api.ts";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type OrderAddress = {
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type OrderLine = {
  name: string;
  variant_name: string | null;
  sku: string;
  quantity: number;
  list_price: number;
  unit_price: number;
  line_subtotal: number;
  line_discount: number;
  line_total: number;
};

export type OrderQuote = {
  items: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  payment_method: string;
};

export type Order = OrderQuote & {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  billing_address: OrderAddress;
  shipping_address: OrderAddress;
  created_at: string;
};

export type OrderPage = {
  items: Order[];
  page: number;
  page_size: number;
  total: number;
};

export type AddressInput = {
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type OrderInput = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  billing: AddressInput;
  shipping_same_as_billing: boolean;
  shipping?: AddressInput;
  payment_method: "cod" | "upi";
};

export async function getOrderQuote() {
  const { data } = await api.get<OrderQuote>("/api/orders/quote");
  return data;
}

export async function createOrder(input: OrderInput) {
  const { data } = await api.post<Order>("/api/orders", input);
  return data;
}

export async function getOrders() {
  const { data } = await api.get<OrderPage>("/api/orders");
  return data;
}

export async function getOrder(orderId: string) {
  const { data } = await api.get<Order>(`/api/orders/${orderId}`);
  return data;
}
