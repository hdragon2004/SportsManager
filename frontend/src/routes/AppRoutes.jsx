// frontend\src\routes\AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import SchedulePage from '../pages/SchedulePage'; // Đảm bảo đã import trang này
import NotificationsPage from '../pages/NotificationsPage';
import TournamentsPage from '../pages/TournamentsPage';
import MatchesPage from '../pages/MatchesPage';
import StatisticsPage from '../pages/StatisticsPage';
import AboutPage from '../pages/AboutPage';
import TournamentDetailPage from '../pages/TournamentDetailPage';
import TournamentMatchesPage from '../pages/TournamentMatchesPage';
import RegistrationPage from '../pages/RegistrationPage';
import RegistrationsPage from '../pages/user/RegistrationsPage';
import ProfilePage from '../pages/user/ProfilePage';
import HistoryPage from '../pages/user/HistoryPage';
import MyTeamsPage from '../pages/user/MyTeamsPage';
import MyMemberTeamsPage from '../pages/user/MyMemberTeamsPage';
// THÊM DÒNG NÀY
import TeamManagementPage from '../pages/user/TeamManagementPage'; 
import BlogPage from '../pages/BlogPage';
import ShopPage from '../pages/ShopPage';
import DashboardPage from '../pages/admin/DashboardPage';
import TeamsPage from '../pages/admin/TeamsPage';
import EventsPage from '../pages/admin/EventsPage';
import RegistrationAdmin from '../pages/admin/RegistrationAdmin';
import SettingsPage from '../pages/SettingsPage';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';

// Authentication check using AuthContext
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - User:', user);
  console.log('PrivateRoute - Loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('PrivateRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('PrivateRoute - User authenticated, rendering children');
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !user ? children : <Navigate to="/" replace />;
};

const MainLayoutRoute = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

// Component kết hợp UserLayout với MainLayout
const UserLayoutRoute = ({ children }) => {
  return (
    <MainLayout>
      <UserLayout>{children}</UserLayout>
    </MainLayout>
  );
};


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route path="/" element={<MainLayoutRoute><HomePage /></MainLayoutRoute>} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <MainLayoutRoute>
              <LoginPage />
            </MainLayoutRoute>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <MainLayoutRoute>
              <RegisterPage />
            </MainLayoutRoute>
          </PublicRoute>
        }
      />
      <Route path="/about" element={<MainLayoutRoute><AboutPage /></MainLayoutRoute>} />
      <Route path="/tournaments" element={<MainLayoutRoute><TournamentsPage /></MainLayoutRoute>} />
      <Route path="/tournaments/:id" element={<MainLayoutRoute><TournamentDetailPage /></MainLayoutRoute>} />
      <Route path="/tournaments/:tournamentId/matches" element={<MainLayoutRoute><TournamentMatchesPage /></MainLayoutRoute>} />
      <Route 
        path="/tournaments/:id/register" 
        element={
          <PrivateRoute>
            <MainLayoutRoute>
              <RegistrationPage />
            </MainLayoutRoute>
          </PrivateRoute>
        } 
      />

      {/* Schedule Route */}
      <Route path="/schedule" element={<MainLayoutRoute><SchedulePage /></MainLayoutRoute>} />

      {/* Public Registrations Page */}
      <Route path="/registrations" element={<MainLayoutRoute><RegistrationsPage /></MainLayoutRoute>} />
      
      {/* Protected Registrations Page for User */}
      <Route
        path="/user/registrations"
        element={
          <PrivateRoute>
            <UserLayoutRoute>
              <RegistrationsPage />
            </UserLayoutRoute>
          </PrivateRoute>
        }
      />

      {/* New Public Pages */}
      <Route path="/blog" element={<MainLayoutRoute><BlogPage /></MainLayoutRoute>} />
      <Route path="/shop" element={<MainLayoutRoute><ShopPage /></MainLayoutRoute>} />

      {/* Protected Routes for regular users */}
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <MainLayoutRoute>
              <NotificationsPage />
            </MainLayoutRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/matches"
        element={
          <PrivateRoute>
            <MainLayoutRoute>
              <MatchesPage />
            </MainLayoutRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <PrivateRoute>
            <MainLayoutRoute>
              <StatisticsPage />
            </MainLayoutRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <MainLayoutRoute>
              <SettingsPage />
            </MainLayoutRoute>
          </PrivateRoute>
        }
      />

      {/* User Routes with MainLayout */}
      <Route
        path="/user/profile"
        element={
          <PrivateRoute>
            <UserLayoutRoute>
              <ProfilePage />
            </UserLayoutRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/user/history"
        element={
          <PrivateRoute>
            <UserLayoutRoute>
              <HistoryPage />
            </UserLayoutRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/user/my-teams"
        element={
          <PrivateRoute>
            <UserLayoutRoute>
              <MyTeamsPage />
            </UserLayoutRoute>
          </PrivateRoute>
        }
      />
      {/* THÊM ROUTE MỚI Ở ĐÂY */}
      <Route
        path="/user/my-teams/:teamId/manage"
        element={
          <PrivateRoute>
            <UserLayoutRoute>
              <TeamManagementPage />
            </UserLayoutRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/user/my-member-teams"
        element={
          <PrivateRoute>
            <UserLayoutRoute>
              <MyMemberTeamsPage />
            </UserLayoutRoute>
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <AdminRoute>
            <EventsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/teams"
        element={
          <AdminRoute>
            <TeamsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/registrations"
        element={
          <AdminRoute>
            <RegistrationAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <AdminRoute>
            <NotificationsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/permissions"
        element={
          <AdminRoute>
            <SettingsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/schedule"
        element={
          <AdminRoute>
            <SchedulePage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/statistics"
        element={
          <AdminRoute>
            <StatisticsPage />
          </AdminRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;