import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import App from "./App";
import { sendMessageToHost } from "./utils";
import { AbacusContextProvider } from "./hooks/AbacusContextProvider";
import { SpeechContextProvider } from "./hooks/SpeechContextProvider";
import { SettingsContextProvider } from "./hooks/SettingsContextProvider";

// historyResult is not received without this message.
sendMessageToHost({ command: "loadDefaultTextContent" });

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
