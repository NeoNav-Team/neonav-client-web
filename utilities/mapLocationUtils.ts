import L from "leaflet";
import { compressHoursAcrossMidnight, generateOpenMessages } from "./mapTimeUtils";

const NEONAV_MAINT = "C461879533";
const MEGABLOCK_META = "L229118014";
const MEGAMALL_META = "L128533982";

/** 
 * Enriches raw location data with display-ready strings and metadata.
 */
export function enrichLocation(loc: any) {
  const ratingSum = (loc.reviews || []).reduce((sum: number, r: any) => sum + r.rating, 0);
  const rating = loc.reviews?.length > 0 
    ? `Rating: ${(ratingSum / loc.reviews.length).toFixed(1)}` 
    : "No reviews";

  const prettyhours = compressHoursAcrossMidnight(loc.hours ?? []);
  const { openState, nextTimeMsg } = generateOpenMessages(prettyhours);

  return {
    ...loc,
    rating,
    prettyhours,
    openState: openState || "Closed",
    nextTimeMsg: nextTimeMsg || "",
    ownerisfaction: loc.owner?.startsWith("C"),
    ownerlink: loc.owner?.startsWith("C") ? `/factions/${loc.owner}` : `/contacts/${loc.owner}`
  };
}

/**
 * Logic to determine which LayerGroup a location belongs to.
 */
export function getTargetLayer(
  loc: any, 
  latlng: L.LatLng, 
  layers: Map<string, L.LayerGroup>, 
  context: { userId?: string, factions: any[], megablockRect: L.LatLngBounds, megamallRect: L.LatLngBounds }
): L.LayerGroup {
  const { userId, factions, megablockRect, megamallRect } = context;

  // 1. User/Faction Owned (Unverified)
  if (!loc.verified && (
    loc.owner === userId || 
    loc.creator === userId || 
    factions.some(f => f.id === loc.owner)
  )) {
    return layers.get("mylocations")!;
  }

  // 2. Unverified General
  if (!loc.verified) return layers.get("unverified")!;

  // 3. System/Dev Layers
  if (loc.owner === NEONAV_MAINT || loc.venuetype === "dev") return layers.get("devLayer")!;
  if (loc.id === MEGABLOCK_META || loc.id === MEGAMALL_META) return layers.get("megablockAndMegamallLocations")!;

  // 4. Spatial Layers (Mega Structures)
  if (megablockRect.contains(latlng)) return layers.get("megablockLocations")!;
  if (megamallRect.contains(latlng)) return layers.get("megamallLocations")!;

  // 6. Default
  return layers.get("locationMarkersLayer")!;
}
