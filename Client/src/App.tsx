import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import { Box } from "@mui/material";
import ThemeToggleButton from "./components/ThemeToggleButton";
import AppLayout from "./components/layout/AppLayout";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./constants/Routes";
import { ADMIN } from "./constants/Constants";
import AuthLayout from "./components/layout/AuthLayout";
import CreatePost from "./pages/post/CreatePost";
import EditPost from "./pages/post/EditPost";
import OAuthSuccess from "./pages/OAuthSuccess";
import ResetPassword from "./pages/auth/ResetPassword";

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Box position={"fixed"} bottom={"30px"} right={"30px"}>
        <ThemeToggleButton />
      </Box>

      <Routes>
        {/* Protected routes with layout */}
        <Route path="/" element={<AppLayout />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.Dashboard} element={<Dashboard />} />
            <Route
              path={ROUTES.CreatePost}
              element={
                <ProtectedRoute allowedRoles={[ADMIN]}>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.EditPost()}
              element={
                <ProtectedRoute allowedRoles={[ADMIN]}>
                  <EditPost />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>

        <Route
          path={ROUTES.OAuthSuccess}
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.Dashboard} />
            ) : (
              <OAuthSuccess />
            )
          }
        />
        <Route
          path={ROUTES.Login}
          element={
            !isAuthenticated ? <Login /> : <Navigate to={ROUTES.Dashboard} />
          }
        />
        <Route
          path={ROUTES.Register}
          element={
            !isAuthenticated ? <Register /> : <Navigate to={ROUTES.Dashboard} />
          }
        />
        <Route
          path={ROUTES.ResetPassword}
          element={
            !isAuthenticated ? (
              <ResetPassword />
            ) : (
              <Navigate to={ROUTES.Dashboard} />
            )
          }
        />
        <Route
          path={ROUTES.Unauthorized}
          element={
            !isAuthenticated ? <Navigate to={ROUTES.Login} /> : <Unauthorized />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
