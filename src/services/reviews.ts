import { api } from "./api.ts";

export type Review = {
  id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  author_name: string;
  created_at: string;
};

export type ReviewPage = {
  items: Review[];
  total: number;
  rating_average: number | null;
  review_count: number;
};

export async function getReviews(productId: string) {
  const { data } = await api.get<ReviewPage>(`/api/products/${productId}/reviews`);
  return data;
}

export async function createReview(productId: string, rating: number, comment: string) {
  const { data } = await api.post<ReviewPage>(`/api/products/${productId}/reviews`, {
    rating,
    comment: comment.trim() || null,
  });
  return data;
}
