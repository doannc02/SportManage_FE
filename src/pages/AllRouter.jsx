import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './user/home/Home'
import ProductPage from './user/product/ProductPage'
import Productdetails from './user/product/Productdetails'
import Verification from './Verification'
import CartPage from './user/cart/CartPage'
import ForgotPass from './ForgotPass'
import ForgotVerification from './ForgotVerification'
import CreditCardForm from './CreditCardForm'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/admin/DashBoardLayout'
import UserLayout from '../layouts/user'
import NotFoundPage from '../layouts/404_NotFound'
import { getAppToken } from '../configs/token'
import ProductListAdmin from './admin/products/list'
import ProductDetailAdmin from './admin/products/detail'
import AdminDashboard from './admin/dashboard'
import UserListAdmin from './admin/user-manager/list'
import UserDetailAdmin from './admin/user-manager/action-user-manager'
import VoucherListAdmin from './admin/vouchers/list'
import VoucherDetailAdmin from './admin/vouchers/detail'
import RoleAssignment from './admin/user-manager/assign-roles'
import BrandListAdmin from './admin/brands/list'
import CategoryListAdmin from './admin/categories/list'
import SupplierListAdmin from './admin/suppliers/list'
import OrderDetailPage from './user/order/OrderDetail'
import OrderManagement from './shipper/order-deliverys/list'
import CategoryAdmin from './admin/categories/detail'
import AddMultipleCategories from './admin/categories/add-multiple'

export default function AllRouter() {

  const tokenApp = getAppToken()
  const isAdmin = tokenApp?.roles?.includes('Admin')
  const isUser = tokenApp?.roles?.includes('User')
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpass" element={<ForgotPass />} />
      <Route path="/forgotverification" element={<ForgotVerification />} />
      <Route path="/verification" element={<Verification />} />

      {/* Admin Layout */}
      {isAdmin &&
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
            <Route path='add' element={<VoucherDetailAdmin />} />
            <Route path='detail/:id' element={<VoucherDetailAdmin title='Voucher detail' />} />
          </Route>

          <Route path="/suppliers" element={<DashboardLayout title='Supplier Manager' />}>
            <Route path="list" element={<SupplierListAdmin />} />
            <Route path='add' element={<VoucherDetailAdmin />} />
            <Route path='detail/:id' element={<VoucherDetailAdmin title='Voucher detail' />} />
          </Route>

          <Route path="/categories" element={<DashboardLayout title='Category Manager' />}>
            <Route path="list" element={<CategoryListAdmin />} />
            <Route path='add' element={<AddMultipleCategories />} />
            <Route path='detail/:id' element={<CategoryAdmin title='Category detail' />} />
          </Route>

          <Route path="/order-admin" element={<DashboardLayout title='Order Manager' />}>
            <Route path='list' element={<OrderManagement />} />
          </Route>

          <Route path="/users" element={<DashboardLayout title='User Manager' />}>
            <Route path='permissions' element={<RoleAssignment />} />
            <Route path="list" element={<UserListAdmin />} />
            <Route path='add' element={<UserDetailAdmin />} />
            <Route path='detail/:id' element={<UserDetailAdmin title='user detail' />} />
          </Route>
        </>}
      <Route path="/order-delivery" element={<DashboardLayout title='Order Delivery' />}>
        <Route path='list' element={<OrderManagement />} />
      </Route>

      {/* User Layout */}

      {!isAdmin && <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="productpage" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
        <Route path="product/:id" element={<Productdetails />} />
        <Route path="order/:id" element={<OrderDetailPage />} />
        <Route path="cartpage" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="creditcardform" element={<ProtectedRoute><CreditCardForm /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      }
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
