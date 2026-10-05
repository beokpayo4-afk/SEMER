import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { CartProvider } from "./context/CartProvider.tsx";
import { ToastProvider } from "./context/ToastProvider.tsx";
import { WishlistProvider } from "./context/WishlistProvider.tsx";
import { AdminLayout } from "./layouts/AdminLayout.tsx";
import { RootLayout } from "./layouts/RootLayout.tsx";
import { CategoriesPage as AdminCategoriesPage } from "./pages/admin/CategoriesPage.tsx";
import { CouponsPage } from "./pages/admin/CouponsPage.tsx";
import { CustomersPage } from "./pages/admin/CustomersPage.tsx";
import { DashboardPage } from "./pages/admin/DashboardPage.tsx";
import { EventEnquiriesPage } from "./pages/admin/EventEnquiriesPage.tsx";
import { EventsAdminPage } from "./pages/admin/EventsAdminPage.tsx";
import { OrdersPage as AdminOrdersPage } from "./pages/admin/OrdersPage.tsx";
import { PaymentsPage } from "./pages/admin/PaymentsPage.tsx";
import { ProductFormPage } from "./pages/admin/ProductFormPage.tsx";
import { ProductsPage } from "./pages/admin/ProductsPage.tsx";
import { ReviewsPage } from "./pages/admin/ReviewsPage.tsx";
import { SettingsPage } from "./pages/admin/SettingsPage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { CartPage } from "./pages/CartPage.tsx";
import { CategoryPage } from "./pages/CategoryPage.tsx";
import { CheckoutPage } from "./pages/CheckoutPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { EventDetailPage } from "./pages/EventDetailPage.tsx";
import { EventEnquiryPage } from "./pages/EventEnquiryPage.tsx";
import { EventsPage } from "./pages/EventsPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { OrderPage } from "./pages/OrderPage.tsx";
import { OrdersPage } from "./pages/OrdersPage.tsx";
import { ProductPage } from "./pages/ProductPage.tsx";
import { ProductRefundReturnPolicyPage } from "./pages/ProductRefundReturnPolicyPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { ShopPage } from "./pages/ShopPage.tsx";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <CartProvider>
            <WishlistProvider>
            <Routes>
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<DashboardPage />} />
                <Route path="admin/dashboard" element={<DashboardPage />} />
                <Route path="admin/products" element={<ProductsPage />} />
                <Route path="admin/products/new" element={<ProductFormPage />} />
                <Route path="admin/products/:id/edit" element={<ProductFormPage />} />
                <Route path="admin/categories" element={<AdminCategoriesPage />} />
                <Route path="admin/orders" element={<AdminOrdersPage />} />
                <Route path="admin/customers" element={<CustomersPage />} />
                <Route path="admin/payments" element={<PaymentsPage />} />
                <Route path="admin/events" element={<EventsAdminPage />} />
                <Route path="admin/event-enquiries" element={<EventEnquiriesPage />} />
                <Route path="admin/reviews" element={<ReviewsPage />} />
                <Route path="admin/coupons" element={<CouponsPage />} />
                <Route path="admin/settings" element={<SettingsPage />} />
              </Route>
              <Route element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="categories/:id" element={<CategoryPage />} />
                <Route path="products/:id" element={<ProductPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="events/enquire" element={<EventEnquiryPage />} />
                <Route path="events/:id" element={<EventDetailPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="product-refund-return-policy" element={<ProductRefundReturnPolicyPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            </WishlistProvider>
          </CartProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
