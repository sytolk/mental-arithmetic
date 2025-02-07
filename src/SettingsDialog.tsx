/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2017-present TagSpaces UG (haftungsbeschraenkt)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License (version 3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import React, { type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Slider from "@mui/material/Slider";
import DialogCloseButton from "./DialogCloseButton";
import { Difficulty, TensLevel } from "./arithmeticTypes";
import { useSettingsContext } from "./hooks/useSettingsContext";
import { useSpeechContext } from "./hooks/useSpeechContext";
import { FormControlLabel, Switch } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  /*handleSeriesCountChange: (count: number) => void;
  handleMaxNumChange: (maxNum: number) => void;
  handleSpeedChange: (speed: number) => void;
  handleRateChange: (rate: number) => void;
  handleVoiceChange: (voice: string) => void;
  handleLanguageChange: (lang: string) => void;
  handleDifficultyChange: (difficulty: string) => void;
  voice: string;
  voices: SpeechSynthesisVoice[] | null;
  languages: string[] | null;
  language: string;
  rate: number;
  speed: number;
  seriesCount: number;
  maxNum: number;
  difficulty: string;*/
}

function SettingsDialog(props: Props) {
  const { open, onClose } = props;
  const { t } = useTranslation();
  const {
    speechSettings,
    handleDifficultyChange,
    handleMaxNumChange,
    handleSeriesCountChange,
    handleSpeedChange,
    handleRateChange,
    handleVoiceChange,
    handleLanguageChange,
    setSpeechEnabled,
    setWrittenNumberEnabled,
  } = useSettingsContext();
  const { languages, voices } = useSpeechContext();
  const difficultyChange = (event: SelectChangeEvent) => {
    handleDifficultyChange(event.target.value as string);
  };

  const maxNumChange = (event: SelectChangeEvent) => {
    handleMaxNumChange(parseInt(event.target.value as string, 10));
  };

  const seriesCountChange = (event: Event, newValue: number | number[]) => {
    handleSeriesCountChange(newValue as number);
  };

  const handleSpeedEnabled = (
    event: ChangeEvent<HTMLInputElement>,
    newValue: boolean
  ) => {
    setSpeechEnabled(newValue);
    if (!newValue) {
      setWrittenNumberEnabled(newValue);
    }
  };

  const handleWrittenNumber = (
    event: ChangeEvent<HTMLInputElement>,
    newValue: boolean
  ) => {
    setWrittenNumberEnabled(newValue);
  };

  const speedChange = (event: Event, newValue: number | number[]) => {
    handleSpeedChange(newValue as number);
  };

  const rateChange = (event: Event, newValue: number | number[]) => {
    handleRateChange(newValue as number);
  };

  const voiceChange = (event: SelectChangeEvent) => {
    handleVoiceChange(event.target.value as string);
  };

  const languageChange = (event: SelectChangeEvent) => {
    handleLanguageChange(event.target.value as string);
  };

  const displayNames = new Intl.DisplayNames(["en"], { type: "language" });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="settings-dialog-title"
    >
      <DialogTitle id="settings-dialog-title">
        {t("settingsTitle")}
        <DialogCloseButton onClick={onClose} />
      </DialogTitle>
      <DialogContent
        style={{
          minWidth: 400,
        }}
      >
        <InputLabel shrink htmlFor="difficulty">
          {t("difficulty")}
        </InputLabel>
        <Select
          onChange={difficultyChange}
          input={<OutlinedInput id="difficulty" label={t("difficulty")} />}
          fullWidth
          value={speechSettings.difficulty}
        >
          <MenuItem key={Difficulty.easy} value={Difficulty.easy}>
            <span style={{ width: "100%" }}>{t(Difficulty.easy)}</span>
          </MenuItem>
          <MenuItem key={Difficulty.advanced} value={Difficulty.advanced}>
            <span style={{ width: "100%" }}>{t(Difficulty.advanced)}</span>
          </MenuItem>
        </Select>
        <div style={{ marginTop: 20 }}>
          <InputLabel shrink htmlFor="seriesCountID">
            {t("seriesCount")}
          </InputLabel>
          <Slider
            id="seriesCountID"
            defaultValue={speechSettings.seriesCount}
            onChange={seriesCountChange}
            step={1}
            min={2}
            max={100}
            valueLabelDisplay="on"
          />
        </div>
        <InputLabel shrink htmlFor="maxNum">
          {t("maxNum")}
        </InputLabel>
        <Select
          onChange={maxNumChange}
          input={<OutlinedInput id="maxNum" label={t("maxNum")} />}
          fullWidth
          value={speechSettings.maxNum.toString()}
        >
          {Object.entries(TensLevel).map(([key, max]) => (
            <MenuItem key={key} value={max}>
              <span style={{ width: "100%" }}>{t(key)}</span>
            </MenuItem>
          ))}
        </Select>
        <div style={{ marginTop: 20 }}>
          <InputLabel shrink htmlFor="timeoutID">
            {t("timeout") + " (s)"}
          </InputLabel>
          <Slider
            id="timeoutID"
            defaultValue={speechSettings.speechSpeed}
            onChange={speedChange}
            step={0.05}
            min={0.0}
            max={10}
            valueLabelDisplay="on"
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <FormControlLabel
            control={
              <Switch
                checked={speechSettings.speechEnabled}
                onChange={handleSpeedEnabled}
              />
            }
            label={t("speechEnabled")}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <FormControlLabel
            control={
              <Switch
                disabled={!speechSettings.speechEnabled}
                checked={speechSettings.writtenNumber}
                onChange={handleWrittenNumber}
              />
            }
            label={t("writtenNumber")}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <InputLabel shrink htmlFor="speechSpeedID">
            {t("speechSpeed")}
          </InputLabel>
          <Slider
            id="speechSpeedID"
            disabled={!speechSettings.speechEnabled}
            defaultValue={speechSettings.speechRate}
            onChange={rateChange}
            step={0.25}
            min={0}
            max={2}
            valueLabelDisplay="on"
          />
        </div>
        <InputLabel shrink htmlFor="languagesID">
          {t("languages")}
        </InputLabel>
        <Select
          onChange={languageChange}
          input={<OutlinedInput id="languagesID" label={t("languages")} />}
          displayEmpty
          fullWidth
          value={speechSettings.speechLanguage}
        >
          <MenuItem value={""} style={{ display: "none" }} />
          {languages?.map((lang) => (
            <MenuItem key={lang} value={lang}>
              <span style={{ width: "100%" }}>
                {lang} - {displayNames.of(lang)}
              </span>
            </MenuItem>
          ))}
        </Select>

        <div style={{ marginTop: 20 }}>
          <InputLabel shrink htmlFor="voicesID">
            {t("voices")}
          </InputLabel>
          <Select
            onChange={voiceChange}
            input={<OutlinedInput id="voicesID" label={t("voices")} />}
            displayEmpty
            fullWidth
            value={speechSettings.speechVoice}
          >
            <MenuItem value={""} style={{ display: "none" }} />
            {voices?.map((voice) => (
              <MenuItem key={voice.name} value={voice.name}>
                <span style={{ width: "100%" }}>
                  {voice.name} {voice.lang}
                </span>
              </MenuItem>
            ))}
          </Select>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog;
