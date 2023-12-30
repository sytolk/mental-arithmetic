import React, { useReducer, useState, useEffect, useRef } from "react";
// @ts-ignore
import EasySpeech from "easy-speech";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { useTranslation } from "react-i18next";
import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import DoneIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";
import StopIcon from "@mui/icons-material/Stop";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from "@mui/icons-material/Settings";
import useEventListener from "./useEventListener";
import { getParameterByName, getSequence, sendMessageToHost } from "./utils";
import SettingsDialog from "./SettingsDialog";
import { getHistoryResults } from "./settings";
import { HistoryResults } from "./math.types";
import AutoResults from "./AutoResults";
import { useAbacusContext } from "./hooks/useAbacusContext";
import { useSpeechContext } from "./hooks/useSpeechContext";
import { useSettingsContext } from "./hooks/useSettingsContext";

const App: React.FC = () => {
  const { t } = useTranslation();
  const { abacusParentDivId } = useAbacusContext();
  const {
    currentNumber,
    valueCalculated,
    sequence,
    play,
    stop,
    isPlaying,
    currentTxt,
    showResult,
  } = useSpeechContext();
  const { speechSettings } = useSettingsContext();

  const [isSettingsDialogOpened, setSettingsDialogOpened] =
    useState<boolean>(false);

  const approve = React.useRef<boolean | null>(null);
  const currentResult = React.useRef<number | null>(null);
  const historyResult = React.useRef<Array<HistoryResults>>(
    getHistoryResults()
  );

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  // @ts-ignore
  const isDarkMode = window.theme && window.theme === "dark";
  // @ts-ignore
  const readOnly = () => !window.editMode;

  /*function parse(str: string) {
    let res = 0;
    const texts = getContent().split(" ");
    for (let i = 0; i < texts.length; i++) {
      res += parseInt(texts[i], 10);
    }
    return res;
    // return Function(`'use strict'; return (${str})`)();
  }*/

  // @ts-ignore
  /*useEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key.toLowerCase() === "s") {
        if (!readOnly()) {
          sendMessageToHost({ command: "saveDocument" });
        }
      }
    }
  });*/

  // @ts-ignore
  /*useEventListener("dblclick", (event) => {
    if (readOnly()) {
      sendMessageToHost({ command: "editDocument" });
    }
  });*/

  useEventListener("themeChanged", () => {
    forceUpdate();
  });

  useEventListener("contentLoaded", () => {
    forceUpdate();
  });

  const handleResultsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    currentResult.current = parseInt(event.target.value, 10);
  };

  const enterResult = () => {
    if (currentResult.current !== null) {
      approve.current = currentResult.current === valueCalculated;

      const newResults: HistoryResults = {
        ...speechSettings,
        timestamp: new Date().getTime(),
        sequence: sequence,
        resultInput: currentResult.current,
        result: approve.current,
      };

      /*showResult.current = false;
      currentNumber.current = 0;
      currentTxt.current = "";*/
      currentResult.current = null;
      forceUpdate();
      historyResult.current = [...historyResult.current, newResults];
      // @ts-ignore
      window.resultsContent = JSON.stringify(historyResult.current);

      const filePath = getParameterByName("file");
      /*sendMessageToHost({
        command: "contentChangedInEditor",
        filepath: filePath,
      });*/

      sendMessageToHost({
        command: "saveDocument",
        // @ts-ignore
        filepath: filePath, //window.fileDirectory
        force: true,
      });
    }
  };

  return (
    /*<I18nextProvider i18n={i18n}>*/
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
      {/*<p>Current value: {valueCalculated.current}</p>*/}
      <AppBar position="static" color="transparent">
        <Toolbar
          style={{
            padding: "0 8px",
            textOverflow: "ellipsis",
            backgroundColor: "transparent",
          }}
        >
          <IconButton
            aria-label="play"
            onClick={() => {
              approve.current = null;

              play(
                getSequence(
                  speechSettings.seriesCount,
                  speechSettings.maxNum,
                  speechSettings.difficulty
                )
              );
            }}
            size="large"
          >
            {isPlaying ? <PauseIcon /> : <PlayCircleFilledWhiteIcon />}
          </IconButton>
          {isPlaying && (
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
      />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <div
            style={{
              textAlign: "center",
            }}
          >
            {isPlaying && currentNumber !== null && (
              <>
                <div
                  style={{
                    fontSize: 136,
                  }}
                >
                  {currentNumber > 0 ? "+" + currentNumber : currentNumber}
                </div>
                <div style={{ fontSize: 56 }}>{currentTxt}</div>
              </>
            )}
            {showResult && !isPlaying && (
              <TextField
                id="result"
                sx={{ marginTop: "20px" }}
                label={t("result")}
                variant="outlined"
                onChange={handleResultsChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        data-tid="startRenameEntryTID"
                        color="primary"
                        onClick={enterResult}
                      >
                        {t("core:check")}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {approve.current !== null &&
              !isPlaying &&
              (approve.current ? (
                <DoneIcon sx={{ fontSize: 80, color: "green" }} />
              ) : (
                <div>
                  {currentResult.current}
                  <ErrorIcon sx={{ fontSize: 40, color: "red" }} />
                  <span
                    style={{
                      fontSize: 55,
                    }}
                  >
                    {t("correctResult") + ": "} {valueCalculated}
                  </span>
                </div>
              ))}
          </div>
          <AutoResults />
          <div id={abacusParentDivId} style={{ textAlign: "center" }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default App;
