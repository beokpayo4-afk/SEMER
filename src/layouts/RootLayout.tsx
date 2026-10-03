import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import { Navbar } from "../components/Navbar.tsx";
import { Toast } from "../components/Toast.tsx";

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
