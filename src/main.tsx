import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import { lightTheme } from "@deskpro/deskpro-ui";
import { ThemeProvider } from "styled-components";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

root.render(
  <React.StrictMode>
    <DeskproAppProvider>
      <ThemeProvider theme={lightTheme}>
        <App />
      </ThemeProvider>
    </DeskproAppProvider>
  </React.StrictMode>
);
