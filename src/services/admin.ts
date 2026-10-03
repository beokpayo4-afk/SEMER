import { api } from "./api.ts";
import type { Category, Product, ProductPage } from "./types.ts";
import type { Order, OrderPage, OrderStatus } from "./orders.ts";
import type { EventCategory, EventService, EventServicePage } from "./events.ts";
import type { TravelCategory, TravelPackage, TravelPackagePage } from "./travel.ts";

export type DashboardMonth = {
  month: string;
  sales: number;
  orders: number;
};

export type Dashboard = {
  total_orders: number;
  total_sales: number;
  pending_orders: number;
  completed_orders: number;
  total_customers: number;
  total_products: number;
  low_stock_products: number;
  travel_enquiries: number;
  event_enquiries: number;
  months: DashboardMonth[];
  categories: { name: string; products: number }[];
};

export type CustomerPage = {
  items: { id: string; email: string; full_name: string; is_active: boolean; created_at: string }[];
  page: number;
  page_size: number;
  total: number;
};

export type AdminPaymentPage = {
  items: {
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    provider: string;
    transaction_id: string | null;
    status: string;
    payment_method: string;
    created_at: string;
  }[];
  page: number;
  page_size: number;
  total: number;
};

export type AdminReviewPage = {
  items: {
    id: string;
    product_id: string;
    product_name: string;
    rating: number;
    comment: string | null;
    author_name: string;
    created_at: string;
  }[];
  page: number;
  page_size: number;
  total: number;
};

export type Coupon = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  is_active: boolean;
  expires_at: string | null;
};

export type StoreSettings = {
  store_name: string;
  currency: string;
  payment_provider: string;
  low_stock_threshold: number;
  environment: string;
};

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  sku: string;
  stock_quantity: number;
  category_id: string;
  brand: string | null;
  status: "draft" | "active" | "archived";
  featured: boolean;
  images?: { url: string; alt_text: string | null; sort_order: number }[];
};

export type TravelInput = {
  title: string;
  slug: string;
  category: TravelCategory;
  destination: string;
  country: string;
  duration: number;
  starting_price: number;
  description: string;
  itinerary: string;
  accommodation: string;
  transportation: string;
  activities: string;
  inclusions: string;
  exclusions: string;
  images: { url: string; alt_text: string | null; sort_order: number }[];
  status: "draft" | "active" | "archived";
  featured: boolean;
};

export type EventInput = {
  title: string;
  slug: string;
  category: EventCategory;
  description: string;
  services: string;
  images: { url: string; alt_text: string | null; sort_order: number }[];
  status: "draft" | "active" | "archived";
  featured: boolean;
};

export type EnquiryStatus = "new" | "contacted" | "closed";

export async function getDashboard() {
  const { data } = await api.get<Dashboard>("/api/admin/dashboard");
  return data;
}

export async function getCustomers(page = 1) {
  const { data } = await api.get<CustomerPage>("/api/admin/customers", { params: { page, page_size: 20 } });
  return data;
}

export async function getAdminPayments(page = 1) {
  const { data } = await api.get<AdminPaymentPage>("/api/admin/payments", { params: { page, page_size: 20 } });
  return data;
}

export async function getAdminReviews(page = 1) {
  const { data } = await api.get<AdminReviewPage>("/api/admin/reviews", { params: { page, page_size: 20 } });
  return data;
}

export async function deleteReview(reviewId: string) {
  await api.delete(`/api/admin/reviews/${reviewId}`);
}

export async function getCoupons() {
  const { data } = await api.get<Coupon[]>("/api/admin/coupons");
  return data;
}

export async function saveCoupon(input: Omit<Coupon, "id">, couponId?: string) {
  if (couponId) {
    const { data } = await api.put<Coupon>(`/api/admin/coupons/${couponId}`, input);
    return data;
  }
  const { data } = await api.post<Coupon>("/api/admin/coupons", input);
  return data;
}

export async function deleteCoupon(couponId: string) {
  await api.delete(`/api/admin/coupons/${couponId}`);
}

export async function getSettings() {
  const { data } = await api.get<StoreSettings>("/api/admin/settings");
  return data;
}

export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
  const { data } = await api.patch<Order>(`/api/admin/orders/${orderId}`, { status: orderStatus });
  return data;
}

export async function updateStock(productId: string, stockQuantity: number) {
  const { data } = await api.patch<Product>(`/api/admin/products/${productId}/stock`, {
    stock_quantity: stockQuantity,
  });
  return data;
}

export async function adminProducts(page = 1, search = "") {
  const { data } = await api.get<ProductPage>("/api/products", {
    params: { page, page_size: 20, search: search || undefined, sort: "-created_at" },
  });
  return data;
}

export async function saveProduct(input: ProductInput, productId?: string) {
  if (productId) {
    const { data } = await api.put<Product>(`/api/products/${productId}`, input);
    return data;
  }
  const { data } = await api.post<Product>("/api/products", input);
  return data;
}

export async function deleteProduct(productId: string) {
  await api.delete(`/api/products/${productId}`);
}

export async function saveCategory(
  input: { name: string; slug: string; parent_id: string | null; image_url: string | null; is_active: boolean },
  categoryId?: string,
) {
  if (categoryId) {
    const { data } = await api.put<Category>(`/api/categories/${categoryId}`, input);
    return data;
  }
  const { data } = await api.post<Category>("/api/categories", input);
  return data;
}

export async function deleteCategory(categoryId: string) {
  await api.delete(`/api/categories/${categoryId}`);
}

export async function adminOrders(page = 1) {
  const { data } = await api.get<OrderPage>("/api/orders", { params: { page, page_size: 20 } });
  return data;
}

export async function adminTravel(page = 1) {
  const { data } = await api.get<TravelPackagePage>("/api/travel", { params: { page, page_size: 20 } });
  return data;
}

export async function saveTravel(input: TravelInput, packageId?: string) {
  if (packageId) {
    const { data } = await api.put<TravelPackage>(`/api/travel/${packageId}`, input);
    return data;
  }
  const { data } = await api.post<TravelPackage>("/api/travel", input);
  return data;
}

export async function deleteTravel(packageId: string) {
  await api.delete(`/api/travel/${packageId}`);
}

export async function adminEvents(page = 1) {
  const { data } = await api.get<EventServicePage>("/api/events", { params: { page, page_size: 20 } });
  return data;
}

export async function saveEvent(input: EventInput, serviceId?: string) {
  if (serviceId) {
    const { data } = await api.put<EventService>(`/api/events/${serviceId}`, input);
    return data;
  }
  const { data } = await api.post<EventService>("/api/events", input);
  return data;
}

export async function deleteEvent(serviceId: string) {
  await api.delete(`/api/events/${serviceId}`);
}

export type TravelEnquiryAdmin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travel_date: string;
  travelers: number;
  budget: number;
  message: string;
  status: EnquiryStatus;
};

export async function adminTravelEnquiries(page = 1) {
  const { data } = await api.get<{ items: TravelEnquiryAdmin[]; total: number; page: number; page_size: number }>(
    "/api/travel/enquiries",
    { params: { page, page_size: 20 } },
  );
  return data;
}

export async function updateTravelEnquiry(enquiryId: string, enquiryStatus: EnquiryStatus) {
  const { data } = await api.patch<TravelEnquiryAdmin>(`/api/travel/enquiries/${enquiryId}`, { status: enquiryStatus });
  return data;
}

export type EventEnquiryAdmin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: EventCategory;
  event_date: string;
  location: string;
  expected_guests: number;
  budget: number;
  requirements: string;
  message: string;
  status: EnquiryStatus;
  internal_notes: string;
};

export async function adminEventEnquiries(page = 1) {
  const { data } = await api.get<{ items: EventEnquiryAdmin[]; total: number; page: number; page_size: number }>(
    "/api/events/enquiries",
    { params: { page, page_size: 20 } },
  );
  return data;
}

export async function updateEventEnquiry(enquiryId: string, input: { status?: EnquiryStatus; internal_notes?: string }) {
  const { data } = await api.patch<EventEnquiryAdmin>(`/api/events/enquiries/${enquiryId}`, input);
  return data;
}
