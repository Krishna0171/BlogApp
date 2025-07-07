import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import { Box } from "@mui/material";
import ThemeToggleButton from "./components/ThemeToggleButton";
import AppLayout from "./components/layout/AppLayout";

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Box position={"fixed"} bottom={'30px'} right={'30px'}>
        <ThemeToggleButton/>
      </Box>
      
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <AppLayout/> : <Navigate to="/login" />
          }
        >
          <Route index element={<Dashboard/>}/>
        </Route>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
