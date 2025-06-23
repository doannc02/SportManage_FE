import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react'; // Import lazy và Suspense

import { getAppToken } from '../configs/token';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/admin/DashBoardLayout';
import UserLayout from '../layouts/user';
import NotFoundPage from '../layouts/404_NotFound';

// Public Routes
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const ForgotPass = lazy(() => import('./ForgotPass'));
const ForgotVerification = lazy(() => import('./ForgotVerification'));
const Verification = lazy(() => import('./Verification'));

// Admin Components
const AdminDashboard = lazy(() => import('./admin/dashboard'));
const ProductListAdmin = lazy(() => import('./admin/products/list'));
const ProductDetailAdmin = lazy(() => import('./admin/products/detail'));
const UserListAdmin = lazy(() => import('./admin/user-manager/list'));
const UserDetailAdmin = lazy(() => import('./admin/user-manager/action-user-manager'));
const VoucherListAdmin = lazy(() => import('./admin/vouchers/list'));
const VoucherDetailAdmin = lazy(() => import('./admin/vouchers/detail'));
const RoleAssignment = lazy(() => import('./admin/user-manager/assign-roles'));
const BrandListAdmin = lazy(() => import('./admin/brands/list'));
const CategoryListAdmin = lazy(() => import('./admin/categories/list'));
const SupplierListAdmin = lazy(() => import('./admin/suppliers/list'));
const OrderManagement = lazy(() => import('./shipper/order-deliverys/list'));
const CategoryAdmin = lazy(() => import('./admin/categories/detail'));
const AddMultipleCategories = lazy(() => import('./admin/categories/add-multiple'));
const ListOrderAdmin = lazy(() => import('./admin/orders/list'));
const OrderDetailAdminPage = lazy(() => import('./admin/orders/detail'));
const BrandsDetailAdmin = lazy(() => import('./admin/brands/detail'));
const SuppliersDetailAdmin = lazy(() => import('./admin/suppliers/detail'));

// User Components
const Home = lazy(() => import('./user/home/Home'));
const CartPage = lazy(() => import('./user/cart/CartPage'));
const CreditCardForm = lazy(() => import('./CreditCardForm'));
const UserOrderList = lazy(() => import('./user/order/list'));
const OrderDetailUserPage = lazy(() => import('./user/order/detail'));
const ProductDetails = lazy(() => import('./user/product/detail'));
const ProductPage = lazy(() => import('./user/product/product-page'));


export default function AllRouter() {
  const tokenApp = getAppToken();
  const isAdmin = tokenApp?.roles?.includes('Admin');

  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Fallback chung cho tất cả các route */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/forgotverification" element={<ForgotVerification />} />
        <Route path="/verification" element={<Verification />} />

        {/* Admin Layout */}
        {isAdmin && (
          <>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/admin" element={<DashboardLayout title='Dashboard' />}>
              <Route index element={<AdminDashboard />} />
            </Route>

            <Route path="/products" element={<DashboardLayout title='Product Manager' />}>
              <Route path="list" element={<ProductListAdmin />} />
              <Route path='add' element={<ProductDetailAdmin />} />
              <Route path='detail/:id' element={<ProductDetailAdmin title='Product detail' />} />
            </Route>

            <Route path="/vouchers" element={<DashboardLayout title='Voucher Manager' />}>
              <Route path="list" element={<VoucherListAdmin />} />
              <Route path='add' element={<VoucherDetailAdmin />} />
              <Route path='detail/:id' element={<VoucherDetailAdmin title='Voucher detail' />} />
            </Route>

            <Route path="/brands" element={<DashboardLayout title='Brands Manager' />}>
              <Route path="list" element={<BrandListAdmin />} />
              <Route path='add' element={<BrandsDetailAdmin />} />
              <Route path='detail/:id' element={<BrandsDetailAdmin title='Brands detail' />} />
            </Route>

            <Route path="/suppliers" element={<DashboardLayout title='Supplier Manager' />}>
              <Route path="list" element={<SupplierListAdmin />} />
              <Route path='add' element={<SuppliersDetailAdmin />} />
              <Route path='detail/:id' element={<SuppliersDetailAdmin title='Supplier detail' />} />
            </Route>

            <Route path="/categories" element={<DashboardLayout title='Category Manager' />}>
              <Route path="list" element={<CategoryListAdmin />} />
              <Route path='add' element={<AddMultipleCategories />} />
              <Route path='detail/:id' element={<CategoryAdmin title='Category detail' />} />
            </Route>

            <Route path="/order-admin" element={<DashboardLayout title='Order Manager' />}>
              <Route path='list' element={<ListOrderAdmin />} />
              <Route path='detail/:id' element={<OrderDetailAdminPage />} />
            </Route>

            <Route path="/users" element={<DashboardLayout title='User Manager' />}>
              <Route path='permissions' element={<RoleAssignment />} />
              <Route path="list" element={<UserListAdmin />} />
              <Route path='add' element={<UserDetailAdmin />} />
              <Route path='detail/:id' element={<UserDetailAdmin title='user detail' />} />
            </Route>
          </>
        )}
        <Route path="/order-delivery" element={<DashboardLayout title='Order Delivery' />}>
          <Route path='list' element={<OrderManagement />} />
        </Route>

        {/* User Layout */}
        {!isAdmin && (
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="productpage" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="order/:id" element={<OrderDetailUserPage />} />
            <Route path="order" element={<UserOrderList />} />
            <Route path="cartpage" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="creditcardform" element={<ProtectedRoute><CreditCardForm /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}