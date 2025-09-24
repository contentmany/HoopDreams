import { createRoot } from "react-dom/client";
import App from "./App";
import { BuilderProvider } from "./state/BuilderContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BuilderProvider>
    <App />
  </BuilderProvider>
);
