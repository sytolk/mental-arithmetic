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

import React, { useState } from "react";
import {getSequence} from "./utils";

interface Props {
  open: boolean;
  onClose: () => void;
  handleSpeedChange: (speed: number) => void;
  handleRateChange: (rate: number) => void;
  handleVoiceChange: (voice: string) => void;
  handleLanguageChange: (lang: string) => void;
  voice: string;
  voices: SpeechSynthesisVoice[] | null;
  languages: string[] | null;
  language: string;
  rate: number;
  speed: number;
}

function NumberProcessor(props: Props) {
  const [currentNumber, setCurrentNumber] = useState<string>();
  getSequence(5, 0);



  return { currentNumber };
}

export default NumberProcessor;
