import { type HistoryResults } from "./math.types";
import { type SettingsType } from "./hooks/SettingsContextProvider";

export function saveSettings(settings: SettingsType) {
  try {
    localStorage.setItem("mathSettings", JSON.stringify(settings));
  } catch (e) {
    console.log("saveSettings error", e);
  }

  return settings;
}

export function getSettings(key: string) {
  try {
    const item = localStorage.getItem("mathSettings");
    if (item) {
      const settings = JSON.parse(item);
      return settings[key];
    }
  } catch (e) {
    console.log("getSettings error", e);
  }

  return undefined;
}

export function getHistoryResults(): Array<HistoryResults> {
  // @ts-ignore
  const results = window.resultsContent;
  if (results) {
    try {
      return JSON.parse(results);
    } catch (e) {
      console.error("json.parse", e);
    }
  }
  return [];
}
