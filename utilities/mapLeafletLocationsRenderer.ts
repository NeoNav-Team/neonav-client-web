import L from "leaflet";
import type { LayerGroup } from "leaflet";
import { enrichLocation, getTargetLayer } from "@/utilities/mapLocationUtils";

const MEGABLOCK_NW = "L111111111";
const MEGABLOCK_SE = "L222222222";
const MEGAMALL_NW = "L333333333";
const MEGAMALL_SE = "L444444444";
const LOCATOR = "L999999999";


export interface LeafletLocationsRendererParams {
  mymap: L.Map;
  layerData: Map<string, LayerGroup>;
  locations: any[];
  extraMarkers?: any[];
  userId?: string;
  factions?: any[];
  getVenueIconAndColor: (venuetype: string) => { icon: any; color: string };
  getDivIcon: (materialIcon: any, color: string) => any;
  onMarkerClick: (leafletMarker: L.Marker) => void;
}

export function renderLocationsToLeafletLayers(params: LeafletLocationsRendererParams): void {
  const {
    mymap,
    layerData,
    locations,
    extraMarkers,
    userId,
    factions,
    getVenueIconAndColor,
    getDivIcon,
    onMarkerClick,
  } = params;

  // 1. Setup & Clear Layers
  const requiredLayers = ["locationMarkersLayer", "megablockLocations", "megamallLocations", "megablockAndMegamallLocations", "devLayer", "eventLayer", "mylocations", "unverified"];
  for (const key of requiredLayers) {
    const layer = layerData.get(key);
    if (!layer) return; // Safety check
    layer.clearLayers();
  }

  // We can get rid of concat once all locations are in the DB
  const allLocations = locations.concat(extraMarkers ?? []);


  // 2. Constants & Bounds (Consider moving these to a config file)
  // Find corners of mega structures for bounding boxes
  const megablockNW = allLocations.find(loc => loc.id === MEGABLOCK_NW);
  const megablockSE = allLocations.find(loc => loc.id === MEGABLOCK_SE);
  const megamallNW = allLocations.find(loc => loc.id === MEGAMALL_NW);
  const megamallSE = allLocations.find(loc => loc.id === MEGAMALL_SE);

  const megablockRect = L.latLngBounds(
    L.latLng(megablockNW.lat, megablockNW.long),
    L.latLng(megablockSE.lat, megablockSE.long),
  );
  const megamallRect = L.latLngBounds(
    L.latLng(megamallNW.lat, megamallNW.long),
    L.latLng(megamallSE.lat, megamallSE.long),
  );

  // Visual aids for Devs
  L.rectangle(megablockRect).addTo(layerData.get("devLayer")!);
  L.rectangle(megamallRect).addTo(layerData.get("devLayer")!);

  // 3. Main Processing Loop
  allLocations.forEach((loc: any) => {
    if (loc.lat == null || loc.long == null) return;
    const latlng = L.latLng(loc.lat, loc.long);

    // This if check should go away once we get rid of "allLocations" because everything is in the database
    if (locations.find(location => loc.id === location.id)) {
      // Enrich data (Rating, Hours, Links)
      const enrichedLoc = enrichLocation(loc);

      // Persist calculated data back into local cookie
      const thisloc = locations.find(location => loc.id === location.id);
      thisloc.ownerisfaction = enrichedLoc.ownerisfaction;
      thisloc.ownerlink = enrichedLoc.ownerlink;
      thisloc.prettyhours = enrichedLoc.prettyhours;
      thisloc.openState = enrichedLoc.openState;
      thisloc.nextTimeMsg = enrichedLoc.nextTimeMsg;
      thisloc.rating = enrichedLoc.rating;
    }
    
    // Determine the layer
    let targetLayer = getTargetLayer(loc, latlng, layerData, { userId, factions: factions ?? [], megablockRect, megamallRect });

    // Create the marker
    const { icon, color } = getVenueIconAndColor(loc.venuetype ?? "");
    const leafletMarker: L.Marker = L.marker(latlng, { icon: getDivIcon(icon, color) })
      .addTo(targetLayer)
      .on("click", () => onMarkerClick(leafletMarker)
    );

    // Handle metadata and tooltips
    leafletMarker.bindTooltip(loc.name, { permanent: true, direction: "right" });
    (leafletMarker as any).id = loc.id;

    // Dev features
    if (loc.id === LOCATOR) {
      leafletMarker.options.draggable = true;
      leafletMarker.on('dragend', () => {
        const { lat, lng } = leafletMarker.getLatLng();
        console.log(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      });
    }
  });
}