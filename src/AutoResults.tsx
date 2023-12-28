import React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useSettingsContext } from "./hooks/useSettingsContext";
import { useSpeechContext } from "./hooks/useSpeechContext";
import { useAbacusContext } from "./hooks/useAbacusContext";

const AutoResults: React.FC = () => {
  const { t } = useTranslation();
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
      label={t("autoResult")}
    />
  );
};

export default AutoResults;
