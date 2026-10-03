import type { OrderStatus, PaymentStatus } from "../services/orders.ts";

const orderLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const paymentLabels: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const storeUpiId = "kkumar41831@ibl";

export function upiPayLink(amountPaise: number) {
  const amount = (amountPaise / 100).toFixed(2);
  const query = [
    ["pa", storeUpiId],
    ["pn", "SEMER"],
    ["am", amount],
    ["cu", "INR"],
  ]
    .map(([key, value]) => `${key}=${encodeURIComponent(value).replace(/%40/g, "@")}`)
    .join("&");
  return `upi://pay?${query}`;
}

const methodLabels: Record<string, string> = {
  cod: "Cash on delivery",
  upi: "UPI",
};

export function orderStatusLabel(status: OrderStatus) {
  return orderLabels[status];
}

export function paymentStatusLabel(status: PaymentStatus) {
  return paymentLabels[status];
}

export function paymentMethodLabel(method: string) {
  return methodLabels[method] ?? method;
}
