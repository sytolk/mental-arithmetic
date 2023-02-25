import React, { useReducer, useState, useEffect, useRef } from "react";
// @ts-ignore
import EasySpeech from "easy-speech";
import useEventListener from "./useEventListener";
import Abacus from "./Abacus.js";
import { sendMessageToHost } from "./utils";

const App: React.FC = () => {
  const abacus = useRef<any>(new Abacus("myAbacus", 0));
  const result = useRef<number>(-1);
  const value = useRef<number>(0);
  const lang = useRef<string>("bg-BG"); //'en-US');
  const speed = useRef<number>(500); // ms between words //'en-US');
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const [run, setRun] = useState<boolean>(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  // @ts-ignore
  const isDarkMode = window.theme && window.theme === "dark";
  // @ts-ignore
  const readOnly = () => !window.editMode;
  // @ts-ignore
  const getContent = () => window.mdContent || "12 +22 +32 -42 +62";

  function parse(str: string) {
    let res = 0;
    const texts = getContent().split(" ");
    for (let i = 0; i < texts.length; i++) {
      res += parseInt(texts[i], 10);
    }
    return res;
    // return Function(`'use strict'; return (${str})`)();
  }

  useEffect(() => {
    abacus.current.init();
    //drawAbacus();
    result.current = parse(getContent());
    EasySpeech.init()
      .then((success: boolean) => {
        if (success) {
          const allVoices: SpeechSynthesisVoice[] = EasySpeech.voices();
          if (allVoices) {
            const langVoices: SpeechSynthesisVoice[] = allVoices.filter(
              (v) => v.lang === lang.current
            );

            if (langVoices) {
              voice.current = langVoices[0];
              setVoices(langVoices);
            } else {
              setVoices(allVoices);
            }
          }
        }
      })
      .catch((e: Error) => console.error(e));
  }, []);

  useEffect(() => {
    if (run) {
      read(getContent()).then(() => console.log("read"));
    }
  }, [run]);

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  async function read(txt: string) {
    const texts = txt.split(" ");
    for (let i = 0; i < texts.length; i++) {
      await sleep(speed.current);
      const txt = texts[i].replaceAll("-","−");
      await speak(txt);

      value.current += parseInt(texts[i], 10);
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

    // Pad the digits array with leading zeros if necessary
    /*while (digits.length < numColumns) {
      digits.unshift(0);
    }*/

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

  /*function decimalToNodeIndex(decimalInteger: number) {
    const numNodesPerColumn = 5;
    const numColumns = 8;

    if (decimalInteger < 0 || decimalInteger >= Math.pow(10, numColumns)) {
      throw new Error("Input value out of range");
    }

    const digits = decimalInteger.toString().split("").map(Number);

    while (digits.length < numColumns) {
      digits.unshift(0);
    }

    const activatedNodes = [];

    for (let column = numColumns - 1; column >= 0; column--) {
      const digit = digits[column];
      const nodeIndex = column * numNodesPerColumn + (numNodesPerColumn - digit);
      activatedNodes.push(nodeIndex);
    }

    return activatedNodes;
  }*/

  /*function decimalToNodeIndex(decimalInteger: number, numNodesPerColumn = 5) {
    let quotient = decimalInteger;
    const nodeIndex = [];
    let currentNodeIndex = 0;
    for (let i = 0; i < numNodesPerColumn; i++) {
      const remainder = quotient % (numNodesPerColumn + 1);
      quotient = (quotient - remainder) / (numNodesPerColumn + 1);
      nodeIndex.push(currentNodeIndex + remainder);
      currentNodeIndex += numNodesPerColumn;
    }
    return nodeIndex.reverse();
  }*/

  async function speak(text: string) {
    return new Promise((resolve) => {
      EasySpeech.cancel();
      EasySpeech.speak({
        text: text,
        pitch: 1.0, //0.9,
        rate: 1.0, //1.2,
        volume: 1.0,
        lang: lang.current,
        voice: voice.current,
        // there are more events, see the API for supported events
        end: () => resolve(true),
        //boundary: (e) => console.debug("boundary reached"),
      });
    });
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

  function handleVoiceChange(voiceChosen: string) {
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
  }

  /*function drawAbacus() {
    //const abacus = new Abacus2('abacusCanvas');
    //abacus.drawFrame();
    //abacus.defaultSetup();

    const abacus = new Abacus('myAbacus', 0);
    abacus.init();
  }*/

  return (
    <div>
      <p>Current value: {value.current}</p>
      {getContent() + "=" + result.current}
      <button
        onClick={() => {
          setRun(!run);
          value.current = 0;
        }}
      >
        Run
      </button>
      <input
        defaultValue={speed.current}
        onChange={(e) => handleSpeedChange(e.target.value)}
      />
      <select onChange={(e) => handleVoiceChange(e.target.value)}>
        {voices?.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} {voice.lang}
          </option>
        ))}
      </select>
      <canvas id="abacusCanvas" />
      <div id="myAbacus">
        <canvas id="myAbacus_Abacus" width="680" height="340" />
      </div>
    </div>
  );
};

export default App;
