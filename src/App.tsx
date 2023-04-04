import React, { useReducer, useState, useEffect, useRef } from "react";
// @ts-ignore
import EasySpeech from "easy-speech";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from "@mui/icons-material/Settings";
import i18n from "./i18n";
import useEventListener from "./useEventListener";
import Abacus from "./Abacus.js";
import { getSequence, sendMessageToHost } from "./utils";
import SettingsDialog from "./SettingsDialog";
import { getSettings, saveSettings } from "./settings";
import { Difficulty, TensLevel } from "./arithmeticTypes";

const App: React.FC = () => {
  const abacus = useRef<any>(new Abacus("myAbacus", 0));
  const result = useRef<number>(-1);
  const value = useRef<number>(0);
  const currentNumber = useRef<string>("");

  const [isSettingsDialogOpened, setSettingsDialogOpened] =
    useState<boolean>(false);
  const languages = React.useRef<string[] | null>(null);
  const language = React.useRef<string>(
    getSettings("speechLanguage") || i18n.language
  );
  const allVoices = React.useRef<SpeechSynthesisVoice[] | null>(null);
  const voices = React.useRef<SpeechSynthesisVoice[] | null>(null);
  const voice = React.useRef<string>(getSettings("speechVoice"));
  const rate = React.useRef<number>(getDefaultRate());
  const seriesCount = React.useRef<number>(getDefaultSeriesCount());
  const maxNum = React.useRef<number>(getDefaultMaxNum());
  const difficulty = React.useRef<string>(
    getSettings("difficulty") || Difficulty.easy
  );
  const speed = React.useRef<number>(1000);
  const isPlaying = React.useRef<boolean>(false);
  const isPaused = React.useRef<boolean>(false);

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  // @ts-ignore
  const isDarkMode = window.theme && window.theme === "dark";
  // @ts-ignore
  const readOnly = () => !window.editMode;
  const sequence = getSequence(
    seriesCount.current,
    maxNum.current,
    difficulty.current
  );

  const speechSettings = {
    speechSpeed: speed.current,
    speechRate: rate.current,
    speechLanguage: language.current,
    speechVoice: voice.current,
    seriesCount: seriesCount.current,
    maxNum: maxNum.current,
    difficulty: difficulty.current,
  };
  useEffect(() => {
    abacus.current.init();
    //drawAbacus();
    result.current = sequence.reduce((a, b) => a + b); // parse(sequence);

    EasySpeech.init()
      .then((success: boolean) => {
        if (success) {
          allVoices.current = EasySpeech.voices();
          setVoices();
        }
      })
      .catch((e: Error) => console.error(e));
  }, []);

  function setVoices(chooseFirst = false) {
    if (allVoices.current && allVoices.current.length > 0) {
      languages.current = [
        ...new Set(allVoices.current.map((v) => v.lang)),
      ].sort();
      const langVoices = allVoices.current.filter(
        (v) => v.lang === language.current
      );

      if (langVoices.length > 0) {
        voices.current = langVoices;
      } else {
        const lVoices: SpeechSynthesisVoice[] = allVoices.current.filter((v) =>
          v.lang.startsWith(language.current)
        );
        if (lVoices.length > 0) {
          voices.current = lVoices;
        } else {
          voices.current = allVoices.current;
        }
      }
      if (!voice.current || chooseFirst) {
        voice.current = voices.current[0].name;
      }
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

  /*function parse(str: string) {
    let res = 0;
    const texts = getContent().split(" ");
    for (let i = 0; i < texts.length; i++) {
      res += parseInt(texts[i], 10);
    }
    return res;
    // return Function(`'use strict'; return (${str})`)();
  }*/

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  async function read(seq: Array<number>) {
    //const texts = txt.split(" ");
    for (let i = 0; i < seq.length; i++) {
      await sleep(speed.current); //1000 / rate.current);
      const txt = seq[i] > 0 ? "+" + seq[i] : "−" + seq[i] * -1; //.replaceAll("-", "−");
      currentNumber.current = txt;
      await speak(txt);

      value.current += seq[i]; // parseInt(texts[i], 10);
      forceUpdate();
      // set abacus
      abacus.current.reset();
      const activatedArray = decimalToNodeIndex(value.current);
      activatedArray.forEach((activated) =>
        abacus.current.setPosition(activated)
      );

      abacus.current.update();
      /*console.log(abacus.current.getBeadPositionX(4));
      console.log(abacus.current.getBeadPositionY(4));*/
    }
  }

  function decimalToNodeIndex(decimalInteger: number, numNodesPerColumn = 5) {
    const numColumns = 8;
    const maxDecimalValue = Math.pow(10, numColumns) - 1;
    // Handle out-of-range input values
    if (decimalInteger < 0 || decimalInteger > maxDecimalValue) {
      throw new Error("Input value out of range");
    }

    // Convert the decimal integer to an array of digits
    const digits = decimalInteger.toString().split("").map(Number).reverse();

    // Initialize an array to store the activated node indices
    const activatedNodes = [];

    // Loop through each column and set the corresponding node as activated
    for (let column = 0; column <= numColumns; column++) {
      let digit = digits[column];
      if (digit && digit > 0) {
        if (digit >= 5) {
          activatedNodes.push(
            column * numNodesPerColumn + numNodesPerColumn - 1
          );
          digit = digit - 5;
        }
        if (digit > 0) {
          digit = 4 - digit;
          activatedNodes.push(column * numNodesPerColumn + digit);
        }
      }
    }

    // Return the array of activated node indices
    return activatedNodes;
  }

  function speak(text: string | null) {
    if (!text) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      EasySpeech.cancel();
      EasySpeech.speak({
        text: text,
        pitch: 1.0, //0.9,
        rate: rate.current, //0.9, //1.2,
        volume: 1.0,
        lang: language.current,
        voice: getVoiceByName(voice.current),
        // there are more events, see the API for supported events
        end: () => resolve(true),
        //boundary: (e) => console.debug("boundary reached"),
      });
    });
  }

  function handleVoiceChange(voiceChosen: string) {
    if (voiceChosen) {
      voice.current = voiceChosen;

      saveSettings(speechSettings);
      forceUpdate();
    }
  }

  function handleLanguageChange(lang: string) {
    if (lang) {
      language.current = lang;
      setVoices(true);
      saveSettings(speechSettings);
      forceUpdate();
    }
  }
  function handleDifficultyChange(diff: string) {
    if (difficulty) {
      difficulty.current = diff;
      saveSettings(speechSettings);
      forceUpdate();
    }
  }
  function handleMaxNumChange(num: number) {
    if (num) {
      maxNum.current = num;
      saveSettings(speechSettings);
      forceUpdate();
    }
  }
  function handleSeriesCountChange(count: number) {
    if (count) {
      seriesCount.current = count;
      saveSettings(speechSettings);
      forceUpdate();
    }
  }

  function getVoiceByName(voiceName: string): SpeechSynthesisVoice | undefined {
    if (voices.current) {
      return voices.current.find((v) => v.name === voiceName);
    }
    return undefined;
  }

  // @ts-ignore
  useEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key.toLowerCase() === "s") {
        if (!readOnly()) {
          sendMessageToHost({ command: "saveDocument" });
        }
      }
    }
  });

  // @ts-ignore
  useEventListener("dblclick", (event) => {
    if (readOnly()) {
      sendMessageToHost({ command: "editDocument" });
    }
  });

  useEventListener("themeChanged", () => {
    forceUpdate();
  });

  useEventListener("contentLoaded", () => {
    forceUpdate();
  });

  /*function handleVoiceChange(voiceChosen: string) {
    if (voices) {
      const v: SpeechSynthesisVoice | undefined = voices.find(
        (v) => v.name === voiceChosen
      );
      if (v) {
        voice.current = v;
        abacus.current.reset();
        setRun(false);
      }
    }
  }
  function handleSpeedChange(speedChosen: string) {
    speed.current = parseFloat(speedChosen);
  }*/

  /*function drawAbacus() {
    //const abacus = new Abacus2('abacusCanvas');
    //abacus.drawFrame();
    //abacus.defaultSetup();

    const abacus = new Abacus('myAbacus', 0);
    abacus.init();
  }*/

  const play = () => {
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
      isPlaying.current = true;
      value.current = 0;
      forceUpdate();
      read(sequence).then(() => {
        isPlaying.current = false;
        isPaused.current = false;
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

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: "100%",
          height: "100%",
        },
      }}
    >
      <p>Current value: {value.current}</p>
      <AppBar position="static" color="transparent">
        <Toolbar
          style={{
            padding: "0 8px",
            textOverflow: "ellipsis",
            backgroundColor: "transparent",
          }}
        >
          <IconButton aria-label="play" onClick={play} size="large">
            {isPlaying.current ? <PauseIcon /> : <PlayCircleFilledWhiteIcon />}
          </IconButton>
          {isPlaying.current && (
            <IconButton aria-label="stop" onClick={stop} size="large">
              <StopIcon />
            </IconButton>
          )}
          <IconButton
            aria-label="settings"
            style={{
              position: "absolute",
              right: 5,
              top: 5,
            }}
            onClick={(e) => setSettingsDialogOpened(true)}
            size="large"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SettingsDialog
        open={isSettingsDialogOpened}
        onClose={() => setSettingsDialogOpened(false)}
        handleSpeedChange={(s) => {
          speed.current = s * 1000;
          saveSettings(speechSettings);
        }}
        handleRateChange={(r) => {
          rate.current = r;
          saveSettings(speechSettings);
        }}
        handleVoiceChange={handleVoiceChange}
        handleLanguageChange={handleLanguageChange}
        languages={languages.current}
        language={language.current}
        voices={voices.current}
        voice={voice.current}
        rate={rate.current}
        speed={speed.current}
        difficulty={difficulty.current}
        maxNum={maxNum.current}
        seriesCount={seriesCount.current}
        handleDifficultyChange={handleDifficultyChange}
        handleMaxNumChange={handleMaxNumChange}
        handleSeriesCountChange={handleSeriesCountChange}
      />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <div style={{ textAlign: "center", fontSize: 136 }}>
            {currentNumber.current}
          </div>
          <div id="myAbacus" style={{ textAlign: "center" }}>
            {/*<canvas id="myAbacus_Abacus" width="680" height="340" />*/}
          </div>
        </CardContent>
      </Card>
      {/*<canvas id="abacusCanvas" />*/}
    </Box>
  );
};

export default App;
