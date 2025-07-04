import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ColorModeProvider from "./context/ColorModeContext.jsx";

createRoot(document.getElementById("root")).render(
  <ColorModeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ColorModeProvider>
);
