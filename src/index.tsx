import React from "react";
import { createRoot } from "react-dom/client";
import i18n from "./i18n";
// import App from "./App";
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
// https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/2395#issuecomment-651328378
const App = require('./App').default;
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
