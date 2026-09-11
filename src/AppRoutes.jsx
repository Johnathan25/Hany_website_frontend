import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Layouts & Services
import AdminLayout from "./Layout/adminSide";
import ClientLayout from "./Layout/clientSide";
import ProtectedRoute from "./services/protectRoutes";
import ProtectedAccess from "./services/protectAccess";
import ScrollToTop from "./services/scrollToTop";

// Pages
import Home from "./pages/user/Home";
import About from "./pages/user/About"; 
import Properties from './pages/user/Properties';
import Services from './pages/user/Services';
import BookingService from './pages/user/BookingService';
import Complaints from './pages/user/Complaints';
import PaymentResult from "./pages/user/payment";
import NotFound from './pages/user/NotFound';
import AdminDashboard from "./pages/admin/home";
import AdminUsers from './pages/admin/AdminUsers';
import AdminItemsPricing from './pages/admin/AdminItemsPricing';
 import AdminComplaints from "./pages/admin/AdminComplaints";
//import AdminBookings from './pages/admin/AdminBookings';
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
          <Route path="/payment" element={
            <ProtectedRoute>
              <PaymentResult />
            </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />



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
          {/* Default page at "/admin_dashboard" */}
        <Route index element={<AdminDashboard />} />
          <Route path="items-pricing" element={<AdminItemsPricing />} />
        {/* Child page: "/admin_dashboard/complaints" */}
        <Route path="complaints" element={<AdminComplaints />} />

        {/* Child page: "/admin_dashboard/bookings" */}
        {/* <Route path="bookings" element={<AdminBookings />} /> */}

        {/* Child page: "/admin_dashboard/users" (e.g., superadmin only) */}
        <Route
          path="users"
          element={
            <ProtectedAccess role={["superadmin"]}>
              <AdminUsers />
            </ProtectedAccess>
          }
        />
          {/* مسارات لوحة التحكم الإضافية ستوضع هنا */}
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;