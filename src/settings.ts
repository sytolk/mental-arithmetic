import { HistoryResults } from "./math.types";
import { SettingsType } from "./hooks/SettingsContextProvider";

export function saveSettings(settings: SettingsType) {
  localStorage.setItem("mathSettings", JSON.stringify(settings));
  return settings;
}

export function getSettings(key: string) {
  const item = localStorage.getItem("mathSettings");
  if (item) {
    const settings = JSON.parse(item);
    return settings[key];
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
