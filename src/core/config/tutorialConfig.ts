import { GameType } from "@/src/core/constants/Types";
import ImposterPage1 from "@/src/play/screens/GenericTutorialScreen/pages/imposter/ImposterPage1";
import ImposterPage2 from "@/src/play/screens/GenericTutorialScreen/pages/imposter/ImposterPage2";
import ImposterPage3 from "@/src/play/screens/GenericTutorialScreen/pages/imposter/ImposterPage3";
import React from "react";

export type SimpleTutorialDef = {
  mode: "simple";
  title?: string;
  items: string[];
};

export type MultiStepTutorialDef = {
  mode: "multi";
  pages: React.ComponentType[];
};

export type TutorialDef = SimpleTutorialDef | MultiStepTutorialDef;

export const tutorialConfig: Record<GameType, TutorialDef> = {
  [GameType.Quiz]: {
    mode: "simple",
    title: "Slik spiller du Quiz",
    items: [
      "Opprett spill, og den rom navnet med venner",
      "Venner blir med ved å trykke bli med på hjem skjermen og så bruke rom navnet for å bli med",
      "Legg til så mange spørsmål dere ønsker og start spillet",
      "Spill det som dere ønsker. Spill det som 100 spørsmål med noe som kastes rundt, eller send mobilen på rundtur og svar deretter",
    ],
  },
  [GameType.Roulette]: {
    mode: "simple",
    title: "Slik spiller du Roulette",
    items: [
      "Opprett ett spill med ett navn og en kategori",
      "Hjulet snurrer og stopper på en tilfeldig spiller",
      "Personen som hjulet lander på må utføre en utfordring",
      "Ingen vet hvem som er neste hold deg klar!",
    ],
  },
  [GameType.Duel]: {
    mode: "simple",
    title: "Slik spiller du Duel",
    items: [
      "To spillere går mot hverandre i en direkte duell",
      "Hjulet velger utfordringen og begge deltagerne",
      "Den som fullfører utfordringen best, vinner runden",
    ],
  },
  [GameType.Imposter]: {
    mode: "multi",
    pages: [ImposterPage1, ImposterPage2, ImposterPage3],
  },
  [GameType.Dice]: {
    mode: "simple",
    title: "Slik spiller du Dice",
    items: [
      "Spillerne kaster terningen på tur",
      "Resultatet avgjør hvilken utfordring du må gjøre",
      "Flaks og mot avgjør hvem som vinner runden",
    ],
  },
};
