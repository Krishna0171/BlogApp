import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext.tsx";
import { CustomThemeProvider } from "./context/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";
import { ToastProp } from "./components/ToasterProp.ts";
// import SocketProvider from "./context/SocketContext.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    {/* <AuthProvider> */}
    <Provider store={store}>
      {/* <SocketProvider> */}
        <CustomThemeProvider>
          <ToastContainer {...ToastProp} />
          <App />
        </CustomThemeProvider>
      {/* </SocketProvider> */}
    </Provider>
    {/* </AuthProvider> */}
  </BrowserRouter>
);
