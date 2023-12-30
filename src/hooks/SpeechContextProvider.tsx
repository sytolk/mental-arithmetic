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

import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
// @ts-ignore
import writtenNumber from "written-number";
import EasySpeech from "easy-speech";
import { useTranslation } from "react-i18next";
import { useAbacusContext } from "./useAbacusContext";
import { useSettingsContext } from "./useSettingsContext";

type SpeechContextData = {
  play: (seq: number[]) => void;
  stop: () => void;
  isPlaying: boolean;
  languages: string[] | null;
  voices: SpeechSynthesisVoice[] | null;
  currentNumber: number | null;
  valueCalculated: number | null;
  sequence: Array<number>;
  currentTxt: string;
  showResult: boolean;
};

export const SpeechContext = createContext<SpeechContextData>({
  play: () => {},
  stop: () => {},
  isPlaying: false,
  languages: null,
  voices: null,
  currentNumber: null,
  valueCalculated: null,
  sequence: [],
  currentTxt: "",
  showResult: false,
});

export type SpeechContextProviderProps = {
  children: React.ReactNode;
};

export const SpeechContextProvider = ({
  children,
}: SpeechContextProviderProps) => {
  const { t, i18n } = useTranslation();
  const { syncResults } = useAbacusContext();
  const { speechSettings, handleVoiceChange } = useSettingsContext();

  const isWin = navigator.platform.indexOf("Win") !== -1;
  const sequence = React.useRef<Array<number>>([]);
  const isPlaying = React.useRef<boolean>(false);
  const isPaused = React.useRef<boolean>(false);

  const languages = React.useRef<string[] | null>(null);
  const allVoices = React.useRef<SpeechSynthesisVoice[] | null>(null);
  const voices = React.useRef<SpeechSynthesisVoice[] | null>(null);

  const valueCalculated = useRef<number | null>(null);
  const showResult = useRef<boolean>(false);
  const currentNumber = useRef<number | null>(null);
  const currentTxt = useRef<string>("");

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    EasySpeech.init({ maxTimeout: 5000, interval: 250 })
      .then((success: boolean) => {
        console.debug("EasySpeech load complete " + success);
        if (success) {
          allVoices.current = EasySpeech.voices();
          setVoices(speechSettings.speechLanguage);
        }
      })
      .catch((e: Error) => console.error(e));
    // EasySpeech.debug((debug) => console.log(debug));
  }, []);

  useEffect(() => {
    setVoices(speechSettings.speechLanguage, true);
  }, [speechSettings.speechLanguage]);

  function setVoices(language: string, chooseFirst = false) {
    if (allVoices.current && allVoices.current.length > 0) {
      languages.current = [
        ...new Set(allVoices.current.map((v) => v.lang)),
      ].sort();
      const langVoices = allVoices.current.filter((v) => v.lang === language);

      if (langVoices.length > 0) {
        voices.current = langVoices;
      } else {
        const lVoices: SpeechSynthesisVoice[] = allVoices.current.filter((v) =>
          v.lang.startsWith(language)
        );
        if (lVoices.length > 0) {
          voices.current = lVoices;
        } else {
          voices.current = allVoices.current;
        }
      }
      if (!speechSettings.speechVoice || chooseFirst) {
        handleVoiceChange(voices.current[0].name);
      }
      forceUpdate();
    }
  }

  const play = (seq: number[]) => {
    if (isPlaying.current) {
      if (isPaused.current) {
        isPaused.current = false;
        EasySpeech.resume();
        forceUpdate();
      } else {
        isPaused.current = true;
        EasySpeech.pause();
        forceUpdate();
      }
    } else {
      currentNumber.current = null;
      isPlaying.current = true;
      valueCalculated.current = 0;
      syncResults(0);
      // approve.current = null;
      //forceUpdate();
      sequence.current = seq;
      console.log(JSON.stringify(sequence.current));
      read(sequence.current).then(() => {
        isPlaying.current = false;
        isPaused.current = false;
        showResult.current = true;
        forceUpdate();
        console.log("read");
      });
    }
  };

  const stop = () => {
    if (isPlaying.current) {
      isPlaying.current = false;
      isPaused.current = false;
      EasySpeech.cancel();
      forceUpdate();
    }
  };

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms * 1000));
  };

  const read = useMemo(() => {
    return async (seq: Array<number>) => {
      for (let i = 0; i < seq.length; i++) {
        if (speechSettings.speechSpeed > 0) {
          await sleep(speechSettings.speechSpeed);
        }
        const positive = seq[i] > 0 ? seq[i] : seq[i] * -1;
        const seqTxt = isWin
          ? writtenNumber(positive, {
              lang: i18n.language.split("-")[0], //speechSettings.speechLanguage.split("-")[0],
            })
          : positive;
        const minusSign = isWin ? t("minus") + " " : "−";
        const txt = seq[i] > 0 ? "+" + seqTxt : minusSign + seqTxt; //.replaceAll("-", "−");
        //const txt = seq[i] > 0 ? "+" + seqTxt : "-" + seqTxt; //.replaceAll("-", "−");
        currentTxt.current = txt;
        currentNumber.current = seq[i];
        forceUpdate();
        try {
          await speak(
            txt,
            speechSettings.speechRate,
            speechSettings.speechVoice
          );
        } catch (err) {
          console.log(err);
        }

        valueCalculated.current = valueCalculated.current
          ? valueCalculated.current + seq[i]
          : seq[i]; // parseInt(texts[i], 10);

        syncResults(valueCalculated.current);
        forceUpdate();
      }
    };
  }, [syncResults, speechSettings]);

  function speak(text: string | null, rate: number, voice: string) {
    if (!text) return Promise.resolve(false);
    // Create a promise that resolves after the specified timeout
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: "Speech synthesis timed out" });
      }, 10000);
    });

    //return new Promise<boolean>((resolve) => {
    EasySpeech.cancel();
    const speechPromise = EasySpeech.speak({
      text: text,
      pitch: 1.0, //0.9,
      rate: rate, //0.9, //1.2,
      volume: 1.0,
      //lang: language.current,
      voice: getVoiceByName(voice),
      // there are more events, see the API for supported events
      // end: () => resolve(true),
      //boundary: (e) => console.debug("boundary reached"),
    });
    // });
    // Use Promise.race to return the result of the first promise to resolve
    return Promise.race([speechPromise, timeoutPromise]).then((err) => {
      if (err.error) {
        console.log(err);
      }
      return true;
    });
  }

  function getVoiceByName(voiceName: string): SpeechSynthesisVoice | undefined {
    if (voices.current) {
      return voices.current.find((v) => v.name === voiceName);
    }
    return undefined;
  }

  const context = useMemo(() => {
    return {
      play: play,
      stop: stop,
      isPlaying: isPlaying.current,
      languages: languages.current,
      voices: voices.current,
      currentNumber: currentNumber.current,
      valueCalculated: valueCalculated.current,
      sequence: sequence.current,
      currentTxt: currentTxt.current,
      showResult: showResult.current,
    };
  }, [
    syncResults,
    speechSettings,
    isPlaying.current,
    languages.current,
    voices.current,
    currentNumber.current,
    valueCalculated.current,
    sequence.current,
    currentTxt.current,
    showResult.current,
  ]);

  return (
    <SpeechContext.Provider value={context}>{children}</SpeechContext.Provider>
  );
};
