import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./components/ui/header";
import Auth from "./components/modals/auth";
import Filters from "./components/modals/filters";
import { Toaster } from "react-hot-toast";
import { useProfileQuery } from "./store/apis/user";
import Loader from "./components/ui/loader";
import ProfileModal from "./components/modals/profile";
import RentHome from "./components/modals/rent-home";
import Dashboard from "./pages/admin/dashboard";
import Categories from "./pages/admin/categories";
import AdminHeader from "./components/ui/admin-header";
import AllListedHomes from "./pages/admin/all-listed";
import AllUsers from "./pages/admin/all-users";
import ForgotPassword from "./components/modals/forgot-password";
import ResetPassword from "./pages/reset-password";

const Home = React.lazy(() => import("./pages/home"));
const SingleListing = React.lazy(() => import("./pages/single-listing"));
const FavoriteListings = React.lazy(() => import("./pages/favorite-listings"));
const ListedHomes = React.lazy(() => import("./pages/listed-homes"));
const ErrorPage = React.lazy(() => import("./pages/error-page"));

const AuthProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfileQuery();

  useEffect(() => {
    if (!isLoading && profile) {
      const AdminRoutes = ["/admin"];
      if (
        AdminRoutes.includes(location.pathname) &&
        profile?.role !== "admin"
      ) {
        navigate("/");
      }
    }
  }, [profile, location.pathname, navigate, isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

const App = () => {
  const { data: profile, isLoading } = useProfileQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Header />
      {profile?.role === "admin" && <AdminHeader />}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/about"
            element={
              <AuthProvider>
                <h1>About</h1>
              </AuthProvider>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AuthProvider>
                <Dashboard />
              </AuthProvider>
            }
          />
          <Route
            path="/admin/dashboard/categories"
            element={
              <AuthProvider>
                <Categories />
              </AuthProvider>
            }
          />
          <Route
            path="/admin/listed/all"
            element={
              <AuthProvider>
                <AllListedHomes />
              </AuthProvider>
            }
          />
          <Route
            path="/admin/dashboard/users"
            element={
              <AuthProvider>
                <AllUsers />
              </AuthProvider>
            }
          />
          <Route
            path="/favorites"
            element={
              <AuthProvider>
                <FavoriteListings />
              </AuthProvider>
            }
          />
          <Route
            path="/listed"
            element={
              <AuthProvider>
                <ListedHomes />
              </AuthProvider>
            }
          />

          <Route
            path="/tourist-spot/:id"
            element={<SingleListing profile={profile} />}
          />

          {profile ? null : (
            <Route path="/reset-password/:id" element={<ResetPassword />} />
          )}

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <Auth />
      <Filters />
      <ProfileModal />
      <RentHome />
      <ForgotPassword />
      <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
    </BrowserRouter>
  );
};

export default App;
