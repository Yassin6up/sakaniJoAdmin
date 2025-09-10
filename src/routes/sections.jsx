import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

// Lazy-loaded pages
const IndexPage = lazy(() => import('src/pages/app'));
const UserPage = lazy(() => import('src/pages/user'));
const LoginPage = lazy(() => import('src/pages/login'));
const ProductsPage = lazy(() => import('src/pages/products'));
const ProductInfoPage = lazy(() => import('src/pages/prodect-info'));
const BookingPage = lazy(() => import('src/pages/booking'));
const Page404 = lazy(() => import('src/pages/page-not-found'));
const AdminPage = lazy(() => import('src/pages/admin'));
const SettingPage = lazy(() => import('src/pages/setting'));
const ProfilePage = lazy(() => import('src/pages/profile-info'));
const ServicePage = lazy(() => import('src/pages/services'));
const ReportPage = lazy(() => import('src/pages/reports'));
const BookingsPage = lazy(() => import('src/pages/bookingsAll'));

// Authentication component
const RequireAuth = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Main Router Component
function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            }
          >
            <Route index element={<IndexPage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="product_info" element={<ProductInfoPage />} />
            <Route path="setting" element={<SettingPage />} />
            <Route path="profile_info" element={<ProfilePage/>} />
            <Route path="services" element={<ServicePage/>} />
            <Route path="reports" element={<ReportPage/>} />
            <Route path="bookingsAll" element={<BookingsPage/>} />

          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;