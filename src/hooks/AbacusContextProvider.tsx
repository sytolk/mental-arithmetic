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

import React, { createContext, useEffect, useMemo, useRef } from "react";
import Abacus from "../Abacus";
import { useSettingsContext } from "./useSettingsContext";

type AbacusContextData = {
  abacusParentDivId: string;
  abacus: any;
  syncResults: (value: number) => void;
};

export const AbacusContext = createContext<AbacusContextData>({
  abacusParentDivId: "abacusId",
  abacus: undefined,
  syncResults: () => {},
});

export type AbacusContextProviderProps = {
  children: React.ReactNode;
};

export const AbacusContextProvider = ({
  children,
}: AbacusContextProviderProps) => {
  const abacusParentDivId = "abacusId";
  const abacus = useRef<any>(new Abacus(abacusParentDivId, 0));
  const { speechSettings } = useSettingsContext();

  useEffect(() => {
    abacus.current.init();
  }, []);

  function decimalToNodeIndex(decimalInteger: number, numNodesPerColumn = 5) {
    const numColumns = 8;
    const maxDecimalValue = Math.pow(10, numColumns) - 1;
    // Handle out-of-range input values
    if (decimalInteger < 0 || decimalInteger > maxDecimalValue) {
      throw new Error(
        "Input value out of range " +
          decimalInteger +
          " maxDecimalValue:" +
          maxDecimalValue
      );
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

  const syncResults = useMemo(() => {
    return (valueCalculated: number) => {
      if (speechSettings.autoResults) {
        // set abacus
        abacus.current.reset();
        const activatedArray = decimalToNodeIndex(valueCalculated);
        activatedArray.forEach((activated) =>
          abacus.current.setPosition(activated)
        );

        abacus.current.update();
      }
    };
  }, [speechSettings.autoResults]);

  const context = useMemo(() => {
    return {
      abacus: abacus,
      abacusParentDivId: abacusParentDivId,
      syncResults: syncResults,
    };
  }, [abacus, syncResults]);

  return (
    <AbacusContext.Provider value={context}>{children}</AbacusContext.Provider>
  );
};
