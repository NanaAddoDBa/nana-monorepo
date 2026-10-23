import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app/App";
import { cleanInboundUrl } from "@/shared/lib/cleanInboundUrl";
import "@/styles.css";

const currentUrl = window.location.href;
const cleanedUrl = cleanInboundUrl(currentUrl);

if (cleanedUrl !== currentUrl) {
  window.history.replaceState(window.history.state, "", cleanedUrl);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);