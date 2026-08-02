import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { VehicleManagementPage } from '../pages/management/VehicleManagementPage';
import { DriverManagementPage } from '../pages/management/DriverManagementPage';
import { TripManagementPage } from '../pages/management/TripManagementPage';
import { FuelManagementPage } from '../pages/management/FuelManagementPage';
import { MaintenancePage } from '../pages/management/MaintenancePage';
import { ExpenseManagementPage } from '../pages/management/ExpenseManagementPage';
import { CustomerManagementPage } from '../pages/management/CustomerManagementPage';
import { RentalManagementPage } from '../pages/management/RentalManagementPage';
import { ReportsPage } from '../pages/analytics/ReportsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PermissionDeniedPage } from '../pages/PermissionDeniedPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Enterprise Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehicleManagementPage />} />
          <Route path="/drivers" element={<DriverManagementPage />} />
          <Route path="/trips" element={<TripManagementPage />} />
          <Route path="/fuel" element={<FuelManagementPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/expenses" element={<ExpenseManagementPage />} />
          <Route path="/customers" element={<CustomerManagementPage />} />
          <Route path="/rentals" element={<RentalManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/403" element={<PermissionDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
