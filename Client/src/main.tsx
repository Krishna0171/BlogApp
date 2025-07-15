import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CustomThemeProvider } from "./context/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";
import { ToastProp } from "./components/ToasterProp.ts";
import SocketProvider from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <CustomThemeProvider>
          <ToastContainer {...ToastProp} />
          <App />
        </CustomThemeProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
);
