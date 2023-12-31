/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2023-present TagSpaces UG (haftungsbeschraenkt)
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

import React, { createContext, useMemo, useReducer } from "react";
import { getSettings, saveSettings } from "../settings";
import { useTranslation } from "react-i18next";
import { Difficulty, TensLevel } from "../arithmeticTypes";

type SettingsContextData = {
  speechSettings: SettingsType;
  setAutoResults: (auto: boolean) => void;
  setSpeechEnabled: (enabled: boolean) => void;
  setWrittenNumberEnabled: (enabled: boolean) => void;
  handleSpeedChange: (speechSpeed: number) => void;
  handleRateChange: (speechRate: number) => void;
  handleVoiceChange: (voiceChosen: string) => void;
  handleLanguageChange: (lang: string) => void;
  handleDifficultyChange: (diff: string) => void;
  handleMaxNumChange: (num: number) => void;
  handleSeriesCountChange: (count: number) => void;
};

export const SettingsContext = createContext<SettingsContextData>({
  // @ts-ignore
  speechSettings: {},
  setAutoResults: () => {},
  setSpeechEnabled: () => {},
  setWrittenNumberEnabled: () => {},
  handleSpeedChange: () => {},
  handleRateChange: () => {},
  handleVoiceChange: () => {},
  handleLanguageChange: () => {},
  handleDifficultyChange: () => {},
  handleMaxNumChange: () => {},
  handleSeriesCountChange: () => {},
});

export type SettingsContextProviderProps = {
  children: React.ReactNode;
};

export type SettingsType = {
  autoResults: boolean;
  speechEnabled: boolean;
  writtenNumber: boolean;
  speechSpeed: number;
  speechRate: number;
  speechLanguage: string;
  speechVoice: string;
  seriesCount: number;
  maxNum: number;
  difficulty: string;
};

export const SettingsContextProvider = ({
  children,
}: SettingsContextProviderProps) => {
  const { i18n } = useTranslation();
  const autoResults = React.useRef<boolean>(getDefaultAutoResults());
  const speechEnabled = React.useRef<boolean>(getDefaultSpeechEnabled());
  const writtenNumber = React.useRef<boolean>(getDefaultWrittenNumber());
  const speed = React.useRef<number>(getDefaultSpeed());
  const rate = React.useRef<number>(getDefaultRate());
  const language = React.useRef<string>(
    getSettings("speechLanguage") || i18n.language
  );
  const voice = React.useRef<string>(getSettings("speechVoice"));
  const seriesCount = React.useRef<number>(getDefaultSeriesCount());
  const maxNum = React.useRef<number>(getDefaultMaxNum());
  const difficulty = React.useRef<string>(
    getSettings("difficulty") || Difficulty.easy
  );

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  let speechSettings: SettingsType = {
    autoResults: autoResults.current,
    speechEnabled: speechEnabled.current,
    writtenNumber: writtenNumber.current,
    speechSpeed: speed.current,
    speechRate: rate.current,
    speechLanguage: language.current,
    speechVoice: voice.current,
    seriesCount: seriesCount.current,
    maxNum: maxNum.current,
    difficulty: difficulty.current,
  };

  function setAutoResults(results: boolean) {
    autoResults.current = results;
    speechSettings = saveSettings({ ...speechSettings, autoResults: results });
    forceUpdate();
  }

  function setSpeechEnabled(results: boolean) {
    speechEnabled.current = results;
    speechSettings = saveSettings({ ...speechSettings, speechEnabled: results });
    forceUpdate();
  }

  function setWrittenNumberEnabled(results: boolean) {
    writtenNumber.current = results;
    speechSettings = saveSettings({ ...speechSettings, writtenNumber: results });
    forceUpdate();
  }

  function handleSpeedChange(speechSpeed: number) {
    if (speechSpeed != undefined) {
      speed.current = speechSpeed;
      speechSettings = saveSettings({
        ...speechSettings,
        speechSpeed: speechSpeed,
      });
      forceUpdate();
    }
  }

  function handleRateChange(speechRate: number) {
    if (speechRate !== undefined) {
      rate.current = speechRate;
      speechSettings = saveSettings({
        ...speechSettings,
        speechRate: speechRate,
      });
      forceUpdate();
    }
  }

  function handleVoiceChange(voiceChosen: string) {
    if (voiceChosen) {
      voice.current = voiceChosen;
      speechSettings = saveSettings({
        ...speechSettings,
        speechVoice: voiceChosen,
      });
      forceUpdate();
    }
  }

  function handleLanguageChange(lang: string) {
    if (lang) {
      i18n.changeLanguage(lang);
      language.current = lang;
      speechSettings = saveSettings({
        ...speechSettings,
        speechLanguage: lang,
      });
      forceUpdate();
    }
  }
  function handleDifficultyChange(diff: string) {
    if (difficulty) {
      difficulty.current = diff;
      speechSettings = saveSettings({ ...speechSettings, difficulty: diff });
      forceUpdate();
    }
  }
  function handleMaxNumChange(num: number) {
    if (num) {
      maxNum.current = num;
      speechSettings = saveSettings({ ...speechSettings, maxNum: num });
      forceUpdate();
    }
  }
  function handleSeriesCountChange(count: number) {
    if (count) {
      seriesCount.current = count;
      speechSettings = saveSettings({ ...speechSettings, seriesCount: count });
      forceUpdate();
    }
  }

  function getDefaultAutoResults(): boolean {
    const settingsAutoResults = getSettings("autoResults");
    if (settingsAutoResults) {
      return Boolean(settingsAutoResults);
    }
    return true;
  }

  function getDefaultSpeechEnabled(): boolean {
    const settingsSpeechEnabled = getSettings("speechEnabled");
    if (settingsSpeechEnabled) {
      return Boolean(settingsSpeechEnabled);
    }
    return true;
  }

  function getDefaultWrittenNumber(): boolean {
    const settingsWrittenNumber = getSettings("writtenNumber");
    if (settingsWrittenNumber) {
      return Boolean(settingsWrittenNumber);
    }
    return true;
  }

  function getDefaultSpeed(): number {
    const settingsSpeed = getSettings("speechSpeed");
    if (settingsSpeed) {
      return parseFloat(settingsSpeed);
    }
    return 0.05; //1000;
  }

  function getDefaultRate(): number {
    const settingsRate = getSettings("speechRate");
    if (settingsRate) {
      return parseFloat(settingsRate);
    }
    return 0.9;
  }

  function getDefaultSeriesCount(): number {
    const settings = getSettings("seriesCount");
    if (settings) {
      return parseInt(settings);
    }
    return 5;
  }

  function getDefaultMaxNum(): number {
    const settings = getSettings("maxNum");
    if (settings) {
      return parseInt(settings);
    }
    return TensLevel.ten;
  }

  const context = useMemo(() => {
    return {
      speechSettings: speechSettings,
      setAutoResults: setAutoResults,
      setSpeechEnabled: setSpeechEnabled,
      setWrittenNumberEnabled: setWrittenNumberEnabled,
      handleSpeedChange: handleSpeedChange,
      handleRateChange: handleRateChange,
      handleVoiceChange: handleVoiceChange,
      handleLanguageChange: handleLanguageChange,
      handleDifficultyChange: handleDifficultyChange,
      handleMaxNumChange: handleMaxNumChange,
      handleSeriesCountChange: handleSeriesCountChange,
    };
  }, [speechSettings]);

  return (
    <SettingsContext.Provider value={context}>
      {children}
    </SettingsContext.Provider>
  );
};
