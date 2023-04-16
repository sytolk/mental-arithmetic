import { HistoryResults } from "./math.types";

export function saveSettings(settings: any) {
  localStorage.setItem("mathSettings", JSON.stringify(settings));
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
