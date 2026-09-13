import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
// Layouts & Services
import AdminLayout from "./Layout/adminSide";
import ClientLayout from "./Layout/clientSide";
import ProtectedRoute from "./services/protectRoutes";
import ProtectedAccess from "./services/protectAccess";
import ScrollToTop from "./services/scrollToTop";

// Pages
import Home from "./pages/User/Home";
import About from "./pages/User/About";
import Properties from './pages/User/Properties';
import Services from './pages/User/Services';
import BookingService from './pages/User/BookingService';
import Complaints from './pages/User/Complaints';
import PaymentResult from "./pages/User/payment";
import NotFound from './pages/User/NotFound';
import Inventions from "./pages/User/Inventions";
import InventionRequest from "./pages/User/InventionRequest";
import MyOrders from "./pages/User/MyOrders";
import Portfolio from "./pages/User/Portfolio";
import AdminDashboard from "./pages/admin/home";
import AdminUsers from './pages/admin/AdminUsers';
import AdminItemsPricing from './pages/admin/AdminItemsPricing';
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminInventionsManager from './pages/admin/InventionsManager';
import InventionsSecurityManager from "./pages/admin/InventionsSecurityManager";
import CreateInvoicePayment from "./pages/admin/CreateInvoicePayment";
import InventionsInvoicesRecords from "./pages/admin/InventionsInvoicesRecords";
import Profile from "./pages/admin/profile";
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
          {/* المسار الجديد لبراءات الاختراع والحلول */}
          <Route path="/inventions" element={<Inventions />} />

          <Route path="/Invention" element={<ProtectedRoute><Inventions /> </ProtectedRoute>} /> {/* يدعم أيضاً حرف I كبير */}
          <Route path="/inventions/request" element={<InventionRequest />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/booking-service" element={
            <ProtectedRoute>
              <BookingService />
            </ProtectedRoute>} />
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
              <ProtectedAccess role={["superadmin", "admin", "manager"]}>
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
          <Route path="profile" element={<Profile />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="InventionsManager" element={<AdminInventionsManager />} />
          <Route path="inventions-security" element={<InventionsSecurityManager />} />
          <Route path="create-invoice" element={<CreateInvoicePayment />} />
          <Route path="inventions-invoices-records" element={<InventionsInvoicesRecords />} />

          {/* Child page: "/admin_dashboard/bookings" */}
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
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