import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import NotFound from "./pages/404Page";
import ScrollToTop from "./services/scrollToTop";
import ProtectedRoute from "./services/protectRoutes";
import ProtectedAccess from "./services/protectAccess";
import AdminLayout from "./Layout/adminSide";
import ClientLayout from "./Layout/clientSide";
import { FaAngleUp } from "react-icons/fa";

import ReportsPage from "./pages/admin/reports/reports";
import Dashboard from "./pages/admin/dashboard/dashboard";
import OrderInvoice from "./pages/print/order";
import CouponSelector from "./pages/customer/offer/coupon";
import AdminCouponDashboard from "./pages/admin/offer/couponAdmin";
import AdminOfferDashboard from "./pages/admin/offer/offer";
import ClientOffersView from "./pages/customer/offer/offer";
import AdminComboDashboard from "./pages/admin/offer/compoOffer";
import ComboOffersList from "./pages/customer/offer/compoOffer";
import BackupSettings from "./pages/admin/setting/backup";
import AboutUs from "./pages/customer/main/aboutUS";
import PrivacyPolicy from "./pages/customer/main/PrivacyPolicy";
import ContactUs from "./pages/customer/main/ContactUs";
import OffersCombosReport from "./pages/admin/reports/offerReport";
import OfflinePage from "./pages/offlinePage";

// =====================
// Auth (Lazy optional)
// =====================
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const ForgetPassword = lazy(() => import("./pages/auth/forgetPassword"));
const ResetPassword = lazy(() => import("./pages/auth/resetPassword"));
const PhoneLogin = lazy(() => import("./pages/auth/loginByPhone"));

// =====================
// Admin Pages
// =====================
const ProductManager = lazy(() => import("./pages/admin/product/createProduct"));
const ProductList = lazy(() => import("./pages/admin/product/displayAllProduct"));
const MaybeSellProducts = lazy(() => import("./pages/admin/product/maybesellproducts"));
const BestSellerAdmin = lazy(() => import("./pages/admin/product/bestSeller"));

const OrdersList = lazy(() => import("./pages/admin/order/showAllOrder"));
const OrderDetail = lazy(() => import("./pages/admin/order/showOrderDetails"));

const AllUsersTable = lazy(() => import("./pages/admin/users/allUsers"));
const UserDetails = lazy(() => import("./pages/admin/users/userProfile"));

const AllAdminTable = lazy(() => import("./pages/admin/admins/allAdmin"));
const AdminDetails = lazy(() => import("./pages/admin/admins/adminProfile"));
const CreateAdmin = lazy(() => import("./pages/admin/admins/addAdmin"));

const ReviewsAdmin = lazy(() => import("./pages/admin/review/reviews"));
const BroadcastNotification = lazy(() => import("./pages/admin/notifications/createNotification"));
const SettingsAdmin = lazy(() => import("./pages/admin/setting/settings"));
const Profile = lazy(() => import("./pages/customer/profile"));

// =====================
// Client Pages
// =====================
const Main = lazy(() => import("./pages/customer/mainLayout"));
const AllProducts = lazy(() => import("./pages/customer/products/allProducts"));
const ProductDetails = lazy(() => import("./pages/customer/products/productDetails"));
const ProductSearch = lazy(() => import("./pages/customer/products/searchProduct"));

const CartPage = lazy(() => import("./pages/customer/cart/cart"));
const Checkout = lazy(() => import("./pages/customer/order/createOrder"));
const TrackOrder = lazy(() => import("./pages/customer/order/trackOrder"));

const Notifications = lazy(() => import("./pages/notification/notification"));

// =====================

function AppRoutes() {



return (




          <Routes>

            {/* ================= AUTH ================= */}
            <Route path="/تسجيل_الدخول" element={<Login />} />
            <Route path="/انشاء_حساب" element={<Signup />} />
            <Route path="/forget-Password" element={<ForgetPassword />} />
            <Route path="/reset-Password" element={<ResetPassword />} />
            <Route path="/النسجيل_برقم_الهاتف" element={<PhoneLogin />} />

            {/* ================= ADMIN ================= */}
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

           <Route
              index
              element={
                <ProtectedRoute>
                  <ProtectedAccess role={["superadmin", "admin"]}>
                  <Dashboard/>
                  </ProtectedAccess>
                </ProtectedRoute>
              }
            />

          <Route
            path="products/add"
            element={
              <ProtectedRoute>
                <ProtectedAccess role={["superadmin", "admin"]}>
                  <ProductManager />
                </ProtectedAccess>
              </ProtectedRoute>
            }
          />

        <Route
          path="products"
          element={
            <ProtectedRoute>
              <ProtectedAccess role={["superadmin", "admin"]}>
                <ProductList />
              </ProtectedAccess>
            </ProtectedRoute>
          }
        />

        <Route
          path="MaybeSellProducts"
          element={
            <ProtectedRoute>
              <ProtectedAccess role={["superadmin", "admin"]}>
                <MaybeSellProducts />
              </ProtectedAccess>
            </ProtectedRoute>
          }
        />

        <Route
          path="orders/reports"
          element={
            <ProtectedRoute>
              <ProtectedAccess role={["superadmin", "admin"]}>
                <ReportsPage />
              </ProtectedAccess>
            </ProtectedRoute>
          }
        />



        <Route
          path="BestSellerAdmin"
          element={
            <ProtectedRoute>
              <ProtectedAccess role={["superadmin", "admin"]}>
                <BestSellerAdmin />
              </ProtectedAccess>
            </ProtectedRoute>
          }
        />

      <Route
        path="orders"
        element={
          <ProtectedRoute>
            <ProtectedAccess role={["superadmin", "admin"]}>
              <OrdersList />
            </ProtectedAccess>
          </ProtectedRoute>
        }
      />

      <Route
        path="orders/:id"
        element={
          <ProtectedRoute>
            <ProtectedAccess role={["superadmin", "admin"]}>
              <OrderDetail />
            </ProtectedAccess>
          </ProtectedRoute>
        }
      />


          <Route
      path="offer/coupon"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <AdminCouponDashboard />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />

              <Route
      path="offer"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <AdminOfferDashboard />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />

                  <Route
      path="offer/compo"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <AdminComboDashboard />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />


                  <Route
      path="reports/offers-combos"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <OffersCombosReport />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />
    

    


    

      <Route
        path="customers"
        element={
          <ProtectedRoute>
            <ProtectedAccess role={["superadmin", "admin"]}>
              <AllUsersTable />
            </ProtectedAccess>
          </ProtectedRoute>
        }
      />

      <Route
        path="customers/:customerId"
        element={
          <ProtectedRoute>
            <ProtectedAccess role={["superadmin", "admin"]}>
              <UserDetails />
            </ProtectedAccess>
          </ProtectedRoute>
        }
      />

      <Route
        path="admins"
        element={
          <ProtectedRoute>
            <ProtectedAccess role={["superadmin", "admin"]}>
              <AllAdminTable />
            </ProtectedAccess>
          </ProtectedRoute>
        }
      />

      <Route
        path="admins/:adminId"
        element={
          <ProtectedRoute>
            <ProtectedAccess role={["superadmin", "admin"]}>
              <AdminDetails />
            </ProtectedAccess>
          </ProtectedRoute>
        }
      />

      <Route
        path="addAdmin"
        element={
          <ProtectedRoute>
            <ProtectedAccess role={["superadmin", "admin"]}>
              <CreateAdmin />
            </ProtectedAccess>
          </ProtectedRoute>
        }
      />

    <Route
      path="reviews"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <ReviewsAdmin />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />

    <Route
      path="notifications"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <BroadcastNotification />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />

    <Route
      path="settings"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <SettingsAdmin />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />

        <Route
      path="settings/backup"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <BackupSettings />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />

    

    <Route
      path="profile"
      element={
        <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <Profile />
          </ProtectedAccess>
        </ProtectedRoute>
      }
    />

    


            <Route path="notificatios" element={
          
              <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <Notifications />
          </ProtectedAccess>
        </ProtectedRoute>
              } />


          <Route path="order/:orderId" element={
          
              <ProtectedRoute>
          <ProtectedAccess role={["superadmin", "admin"]}>
            <OrderInvoice />
          </ProtectedAccess>
        </ProtectedRoute>
              } />

              


            </Route>

            {/* ================= CLIENT ================= */}
            <Route path="/" element={<ClientLayout />}>
              <Route index element={<Main />} />

              <Route path="كل_المنتجات" element={<AllProducts />} />
              <Route path="تفاصيل المنتج/:id" element={<ProductDetails />} />
              <Route path="بحث_عن_المنتجات" element={<ProductSearch />} />

              <Route path="سله_المنتجات" element={<CartPage />} />

              <Route path="/اشعارات" element={<Notifications />} />
              
              <Route path="/من_نحن" element={<AboutUs />} />
              <Route path="/سياسة_الخصوصية" element={<PrivacyPolicy />} />
              <Route path="/تواصل_معانا" element={<ContactUs />} />



              <Route
                path="الصفحه الشخصيه"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="انشاء_طلب"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="تتبع_الطلب"
                element={
                  <ProtectedRoute>
                    <TrackOrder />
                  </ProtectedRoute>
                }
              />

              <Route
                path="كوبونات_العروض"
                element={
            
                    <CouponSelector />
          
                }
              />
                            <Route
                path="العروض_والخصومات"
                element={
              
                    <ClientOffersView />
        
                }
              />

              <Route path="/فقد_الأتصال_بالانترنت" element={<OfflinePage />} />

                                          <Route
                path="العروض_والخصومات_الكومبو"
                element={
                  
                    <ComboOffersList />
              
                }
              />

              

              

              
            </Route>

            <Route path="order/:orderId" element={
          
              <ProtectedRoute>
 
            <OrderInvoice />
   
        </ProtectedRoute>
              } />

            {/* ================= 404 ================= */}
            <Route path="*" element={<NotFound />} />

          </Routes>
    



  );
}

export default AppRoutes;