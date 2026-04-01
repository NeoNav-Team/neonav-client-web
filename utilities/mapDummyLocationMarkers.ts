import React from "react";
import AdjustIcon from "@mui/icons-material/Adjust";
import GamepadIcon from "@mui/icons-material/Gamepad";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SimCardIcon from "@mui/icons-material/SimCard";

export function createDummyLocationMarkers(params: {
  hours: any[];
  prettyhours: any[];
}): any[] {
  const { hours, prettyhours } = params;

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
      prettyhours,
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
      prettyhours,
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
      prettyhours,
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
      prettyhours,
    },
    {
      id: "L000000000",
      name: "Alpha & Main",
      owner: "",
      verified: true,
      lat: "35.079882",
      long: "-117.822212",
      venuetype: "dev"
    },
    {
      id: "L000000000",
      name: "Beta & Main",
      owner: "",
      verified: true,
      lat: "35.080166",
      long: "-117.822212",
      venuetype: "dev",
    },
    {
      id: "L000000000",
      name: "Beta & First",
      owner: "",
      verified: true,
      lat: "35.080166",
      long: "-117.822973",
      venuetype: "dev",
    },
    {
      id: "L000000000",
      name: "Gamma & Main",
      owner: "",
      verified: true,
      lat: "35.082013",
      long: "-117.822247",
      venuetype: "dev",
    },
    {
      id: "L000000000",
      name: "Megamall NW",
      owner: "",
      verified: true,
      lat: "35.079605",
      long: "-117.822139",
      venuetype: "dev",
    },
    {
      id: "L000000000",
      name: "Megamall SE",
      owner: "",
      verified: true,
      lat: "35.079321",
      long: "-117.821962",
      venuetype: "dev",
    },
    {
      id: "L000000000",
      name: "Megablock NW",
      owner: "",
      verified: true,
      lat: "35.079398",
      long: "-117.822520",
      venuetype: "dev",
    },
    {
      id: "L000000000",
      name: "Megablock SE",
      owner: "",
      verified: true,
      lat: "35.079091",
      long: "-117.822274",
      venuetype: "dev",
    },
    {
      id: "L999999999",
      name: "Locator",
      owner: "",
      verified: true,
      lat: "35.079481",
      long: "-117.823052",
      venuetype: "dev",
    },
    {
      id: "L000000000",
      name: "Medical",
      owner: "C231465509",
      venuetype: "medical",
      verified: true,
      lat: "35.079713",
      long: "-117.822826",
      ownername: "Neo City Admin",
    },
    {
      id: "L000000000",
      name: "Porto",
      owner: "C231465509",
      venuetype: "porto",
      verified: true,
      lat: "35.079938",
      long: "-117.821790",
      ownername: "Neo City Admin",
    },
  ];
}

