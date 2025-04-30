import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./providers/auth-provider.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
    <ToastContainer />
  </AuthProvider>
);
