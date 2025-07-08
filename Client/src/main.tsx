import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CustomThemeProvider } from "./context/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";
import { ToastProp } from "./components/ToasterProp.ts";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <CustomThemeProvider>
        <ToastContainer {...ToastProp} />
        <App />
      </CustomThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
