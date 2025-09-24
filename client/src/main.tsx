import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "@/lib/router";
import App from "./App";
import "@/styles/global.css";
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter><App/></BrowserRouter>
  </React.StrictMode>
);
