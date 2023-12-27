import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import i18n from "./i18n";
import { useSettingsContext } from "./hooks/useSettingsContext";
import { useSpeechContext } from "./hooks/useSpeechContext";
import { useAbacusContext } from "./hooks/useAbacusContext";

const AutoResults: React.FC = () => {
  const { speechSettings, setAutoResults } = useSettingsContext();
  const { isPlaying } = useSpeechContext();
  const { syncResults } = useAbacusContext();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoResults(event.target.checked);
    syncResults(0);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          disabled={isPlaying}
          checked={speechSettings.autoResults}
          onChange={handleChange}
        />
      }
      label={i18n.t("autoResult")}
    />
  );
};

export default AutoResults;
