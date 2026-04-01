import React from "react";
import AdjustIcon from "@mui/icons-material/Adjust";
import GamepadIcon from "@mui/icons-material/Gamepad";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SimCardIcon from "@mui/icons-material/SimCard";

export function createDummyLocationMarkers(params: {
  hours: any[];
  rows: any[];
}): any[] {
  const { hours, rows } = params;

  // Keep colors aligned with `components/mapApp.tsx` map styling.
  const cyberGreen = "#009E73";
  const cyberOrange = "#D55E00";
  const cyberBlueDark = "#0072B2";
  const cyberBlueLight = "#56B4E9";
  const cyberYellow = "#F0E442";

  return [
    {
      id: "L000000000",
      name: "Domecile Heating & Cooling",
      owner: "0000000000",
      venuetype: "Resistance Strike Team Refuge",
      verified: true,
      lat: "35.080055",
      long: "-117.822362",
      hours,
      reviews: [
        {
          reviewer: "0000000000",
          reviewerName: "[REDADCTED]",
          ts: "2025-04-12T09:15:00-04:00",
          rating: 7.2,
          review: "Was a dome.",
        },
        {
          reviewer: "0000000000",
          reviewerName: "[REDADCTED]",
          ts: "2025-04-15T15:09:00-04:00",
          rating: 9.8,
          review:
            'Further Clarification: To the extent that any suspected "Resistance Strike Team" members may have been photographed, videoed or otherwise recorded within its Cooling Dome, DOMECILE Heating and Cooling denies any and all allegations of harboring said fugitives from justice and respectfully requests viewers to disregard the evidence of their own eyes and ears. Thank you.',
        },
      ],
      ownername: "[REDADCTED]",
      prettyhours: rows,
      showtooltip: true,
      // Needed in api or calculated by venuetype
      icon: React.createElement(AdjustIcon, { style: { color: cyberYellow } }),
      color: cyberBlueDark,
    },
    {
      id: "L000000000",
      name: "Cybereats",
      owner: "",
      venuetype: "Food Stall",
      verified: true,
      lat: "35.079789",
      long: "-117.822615",
      hours,
      reviews: [],
      ownername: "",
      prettyhours: rows,
      showtooltip: true,
      icon: React.createElement(RamenDiningIcon, { style: { color: cyberYellow } }),
      color: cyberGreen,
    },
    {
      id: "L000000000",
      name: "Not A Tea Shop",
      owner: "",
      venuetype: "Food Stall",
      verified: true,
      lat: "35.079277",
      long: "-117.822483",
      hours,
      reviews: [],
      ownername: "",
      prettyhours: rows,
      showtooltip: true,
      icon: React.createElement(LocalBarIcon, { style: { color: cyberYellow } }),
      color: cyberGreen,
    },
    {
      id: "L000000000",
      name: "Nightcrawlers Crop.",
      owner: "",
      venuetype: "Corp.",
      verified: true,
      lat: "35.079237",
      long: "-117.822379",
      hours,
      reviews: [],
      ownername: "",
      prettyhours: rows,
      showtooltip: true,
      icon: React.createElement(SimCardIcon, { style: { color: cyberOrange } }),
      color: cyberBlueLight,
    },
  ];
}

