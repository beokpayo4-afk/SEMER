import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import { Navbar } from "../components/Navbar.tsx";
import { Toast } from "../components/Toast.tsx";

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main key={location.pathname} className="page-in flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
