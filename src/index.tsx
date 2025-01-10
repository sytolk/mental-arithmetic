import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import App from "./App";
import { AbacusContextProvider } from "./hooks/AbacusContextProvider";
import { SpeechContextProvider } from "./hooks/SpeechContextProvider";
import { SettingsContextProvider } from "./hooks/SettingsContextProvider";

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <SettingsContextProvider>
      <AbacusContextProvider>
        <SpeechContextProvider>
          <App />
        </SpeechContextProvider>
      </AbacusContextProvider>
    </SettingsContextProvider>
  </React.StrictMode>
);
