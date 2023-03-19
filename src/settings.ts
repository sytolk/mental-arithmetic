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
