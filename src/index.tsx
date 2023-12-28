import React from "react";
import { createRoot } from "react-dom/client";
import i18n from "./i18n";
import App from "./App";
import { sendMessageToHost } from "./utils";
import { AbacusContextProvider } from "./hooks/AbacusContextProvider";
import { SpeechContextProvider } from "./hooks/SpeechContextProvider";
import { SettingsContextProvider } from "./hooks/SettingsContextProvider";

// historyResult is not received without this message.
sendMessageToHost({ command: "loadDefaultTextContent" });

// @ts-ignore
if (window.locale) {
  // @ts-ignore
  i18n.changeLanguage(window.locale);
}
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
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
