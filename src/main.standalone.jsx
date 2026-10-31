import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

const awal = (window.location.hash || "").replace(/^#/, "") || "/";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MemoryRouter initialEntries={[awal]}>
      <App />
    </MemoryRouter>
  </React.StrictMode>
);
