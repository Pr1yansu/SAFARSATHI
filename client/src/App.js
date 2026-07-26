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
import AdminHeader from "./components/ui/admin-header";
import ForgotPassword from "./components/modals/forgot-password";
import Footer from "./components/footer/footer";

const getBackendUrl = () => {
  if (process.env.REACT_APP_BACKEND_URL) return process.env.REACT_APP_BACKEND_URL;
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000";
  }
  return "https://safarsathi-backend.onrender.com";
};

const Home = React.lazy(() => import("./pages/home"));
const SingleListing = React.lazy(() => import("./pages/single-listing"));
const FavoriteListings = React.lazy(() => import("./pages/favorite-listings"));
const ListedHomes = React.lazy(() => import("./pages/listed-homes"));
const ErrorPage = React.lazy(() => import("./pages/error-page"));
const Contact = React.lazy(() => import("./pages/contact"));
const ResetPassword = React.lazy(() => import("./pages/reset-password"));
const AllListedHomes = React.lazy(() => import("./pages/admin/all-listed"));
const AllUsers = React.lazy(() => import("./pages/admin/all-users"));
const Categories = React.lazy(() => import("./pages/admin/categories"));
const Dashboard = React.lazy(() => import("./pages/admin/dashboard"));
const AIPlanner = React.lazy(() => import("./components/AIPlanner"));

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
    return <Loader text="Verifying authentication..." />;
  }

  return <>{children}</>;
};

const App = () => {
  const { data: profile } = useProfileQuery();

  useEffect(() => {
    const pingServer = async () => {
      try {
        await fetch(`${getBackendUrl()}/ping`, { method: "GET", credentials: "include" });
      } catch (err) {
        // Silent
      }
    };
    pingServer();
    const interval = setInterval(pingServer, 4 * 60 * 1000); // Keep backend & DB awake every 4 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      {profile?.role === "admin" && <AdminHeader />}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
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

          <Route path="/planner" element={<AIPlanner />} />

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
      <Footer />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            borderRadius: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
            fontSize: "13px",
            fontWeight: 600,
            padding: "12px 18px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#0f172a",
            },
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
