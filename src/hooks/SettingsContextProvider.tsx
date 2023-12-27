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
import i18n from "../i18n";
import { Difficulty, TensLevel } from "../arithmeticTypes";

type SettingsContextData = {
  speechSettings: SettingsType;
  setAutoResults: (auto: boolean) => void;
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
  const autoResults = React.useRef<boolean>(true);
  const speed = React.useRef<number>(1000);
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

  function handleSpeedChange(speechSpeed: number) {
    if (speechSpeed) {
      speed.current = speechSpeed;
      speechSettings = saveSettings({
        ...speechSettings,
        speechSpeed: speechSpeed,
      });
      forceUpdate();
    }
  }

  function handleRateChange(speechRate: number) {
    if (speechRate) {
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
