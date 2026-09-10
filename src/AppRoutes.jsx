import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Layouts & Services
import AdminLayout from "./Layout/adminSide";
import ClientLayout from "./Layout/clientSide";
import ProtectedRoute from "./services/protectRoutes";
import ProtectedAccess from "./services/protectAccess";
import ScrollToTop from "./services/scrollToTop";

// Pages
import Home from "./pages/Home";
import About from "./pages/About"; // <-- استيراد صفحة من نحن
import Properties from './pages/Properties';
import Services from './pages/Services';
import BookingService from './pages/BookingService';
import Complaints from './pages/Complaints';
import PaymentResult from "./pages/payment";
// =====================
// Auth (Lazy optional)
// =====================
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const ForgetPassword = lazy(() => import("./pages/auth/forgetPassword"));
const ResetPassword = lazy(() => import("./pages/auth/resetPassword"));


function AppRoutes() {
  return (
    <>
      {/* التمرير لأعلى الصفحة تلقائياً عند تغيير المسار */}
      {ScrollToTop && <ScrollToTop />}

      <Routes>
        
          {/* ================= AUTH ================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forget-Password" element={<ForgetPassword />} />
            <Route path="/reset-Password" element={<ResetPassword />} />


        {/* ================= CLIENT ROUTES ================= */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> {/* مسار صفحة من نحن */}
          <Route path="/properties" element={<Properties />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking-service" element={<BookingService />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/payment" element={<PaymentResult />} />



</Route>
        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin_dashboard"
          element={
            <ProtectedRoute>
              <ProtectedAccess role={["superadmin", "admin"]}>
                <AdminLayout />
              </ProtectedAccess>
            </ProtectedRoute>
          }
        >
          {/* مسارات لوحة التحكم الإضافية ستوضع هنا */}
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;