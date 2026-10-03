export type UserRole = "CUSTOMER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
};

export type AuthToken = {
  access_token: string;
  token_type: string;
};

export type RegisterResult = AuthToken & {
  user: User;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  is_active: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  variant_id: string | null;
};

export type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  sku: string;
  stock_quantity: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: string | null;
  status: "draft" | "active" | "archived";
  featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  rating_average: number | null;
  review_count: number;
};

export type ProductPage = {
  items: Product[];
  page: number;
  page_size: number;
  total: number;
};

export type ProductQuery = {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  available?: boolean;
  page?: number;
  page_size?: number;
  sort?: string;
};
