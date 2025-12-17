import { lazy, memo, useEffect, Suspense } from "react";
import { useRoutes, useLocation, Outlet } from "react-router-dom"; // Thêm Outlet nếu cần
import { TransitionGroup, CSSTransition } from "react-transition-group";
import LandingPage from "../Pages/HomePage/LandingPage";
import {
  PATH_ABOUT,
  PATH_DETAIL,
  PATH_HOME,
  PATH_LOGIN,
  PATH_NEWS,
  PATH_PRODUCTS_LIST,
  PATH_PROFILE,
  PATH_REGISTER,
} from "./path";
import LoginPage from "../Pages/LoginPage/LoginPage";
import About from "../Pages/About/About";
import News from "../Pages/News/News";
import ListProducts from "../Pages/ListProducts/ListProducts";
// import Detail from "../Pages/Detail/ProductDetail"; // Bỏ nếu không dùng để tránh warning
import ProductDetail from "../Pages/Detail/ProductDetail";
import Profile from "../Pages/Profile/Profile";
import Cart from "../Pages/Cart/Cart";
import Orders from "../Pages/Cart/Orders";
import OrderSuccess from "../Pages/Cart/OrderSuccess";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminLogin from "../Components/AdminLogin";
import AdminLayout from "../Layouts/AdminLayout";
import AdminProducts from "../Pages/Admin/AdminProducts";
import AdminNews from "../Pages/Admin/AdminNews/AdminNews";
import TypeFood from "../Pages/Admin/AdminTypes/AdminTypes";
import OrdersManagerment from "../Pages/Admin/Donhang/OrdersManagerment";
// import ManagermentAccounts from "../Pages/Admin/Accounts/ManagermentAccounts"; // Bỏ nếu không dùng
import UserTable from "../Pages/Admin/Accounts/UserTable";
import VoucherPage from "../Pages/Admin/Voucher/VoucherPage";
import ShippingPage from "../Pages/Admin/Shipping/ShippingPage";

export const normalRoutes = [PATH_HOME];
export const authRoutes = [];

const PageLayout = lazy(() => import("../Layouts/Layouts"));

function Router() {
  const location = useLocation();

  const routes = [
    {
      element: (
        <Suspense fallback={<p className="suspense_loading">Loading...</p>}>
          <TransitionGroup>
            <CSSTransition
              key={location.key || ""}
              timeout={{ enter: 300, exit: 300 }}
              classNames="fade"
            >
              {/* Lưu ý: Outlet thường được dùng trong Layout để render children */}
              <PageLayout>
                 <Outlet /> 
              </PageLayout>
            </CSSTransition>
          </TransitionGroup>
        </Suspense>
      ),
      children: [
        { path: PATH_HOME, element: <LandingPage /> },
        { path: PATH_LOGIN, element: <LoginPage /> },
        { path: PATH_PRODUCTS_LIST, element: <ListProducts /> },
        { path: PATH_ABOUT, element: <About /> },
        { path: PATH_NEWS, element: <News /> },
        { path: PATH_REGISTER, element: <LoginPage /> },
        { path: PATH_DETAIL, element: <ProductDetail /> },
        { path: PATH_PROFILE, element: <Profile /> },
        { path: "/cart", element: <Cart /> },
        
        // --- SỬA: Đổi thành chữ thường để khớp với CartPage ---
        { path: "/order-success", element: <OrderSuccess /> }, 
        
        { path: "/Orders", element: <Orders /> },
        { path: "/adminLogin", element: <AdminLogin /> },
      ],
    },
    {
      element: (
        <Suspense fallback={<p className="suspense_loading">Loading...</p>}>
          <TransitionGroup>
            <CSSTransition
              key={location.key || ""}
              timeout={{ enter: 300, exit: 300 }}
              classNames="fade"
            >
              <AdminLayout>
                 <Outlet />
              </AdminLayout>
            </CSSTransition>
          </TransitionGroup>
        </Suspense>
      ),
      children: [
        { path: "/admin", element: <AdminDashboard /> },
        { path: "/admin/products", element: <AdminProducts /> },
        { path: "/admin/News", element: <AdminNews /> },
        { path: "/admin/typeFood", element: <TypeFood /> },
        { path: "/admin/Donhang", element: <OrdersManagerment /> },
        { path: "/admin/vouchers", element: <VoucherPage /> },
        { path: "/admin/shipping", element: <ShippingPage /> },
        { path: "/admin/Managermentcustomers", element: <UserTable /> },
      ],
    },
  ];

  useEffect(() => {}, []);

  return useRoutes(routes);
}

export default memo(Router);