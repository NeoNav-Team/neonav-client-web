import L from "leaflet";
import type { LayerGroup } from "leaflet";
import { enrichLocation, getTargetLayer } from "@/utilities/mapLocationUtils";

const MEGABLOCK_NW = "L950362737";
const MEGABLOCK_SE = "L822128842";
const MEGAMALL_NW = "L174138988";
const MEGAMALL_SE = "L205837229";
const LOCATOR = "L401233115";


export interface LeafletLocationsRendererParams {
  layerData: Map<string, LayerGroup>;
  locations: any[];
  userId?: string;
  factions?: any[];
  getVenueIconAndColor: (venuetype: string) => { icon: any; color: string };
  getDivIcon: (materialIcon: any, color: string) => any;
  onMarkerClick: (leafletMarker: L.Marker) => void;
}

export interface LeafletLocationPinsRendererParams {
  layerData: Map<string, LayerGroup>;
  pins: any[];
  getVenueIconAndColor: (venuetype: string) => { icon: any; color: string };
  getDivIcon: (materialIcon: any, color: string) => any;
  onMarkerClick: (leafletMarker: L.Marker) => void;
}

export function renderLocationsToLeafletLayers(params: LeafletLocationsRendererParams): void {
  const {
    layerData,
    locations,
    userId,
    factions,
    getVenueIconAndColor,
    getDivIcon,
    onMarkerClick,
  } = params;

  // 1. Setup & Clear Layers
  const requiredLayers = ["locationMarkersLayer", "megablockLocations", "megamallLocations", "megablockAndMegamallLocations", "devLayer", "pinsLayer", "mylocations", "unverified"];
  for (const key of requiredLayers) {
    const layer = layerData.get(key);
    if (!layer) {
      console.log("Failed to load " + key);
      return; // Safety check
    }
    layer.clearLayers();
  }

  // 2. Constants & Bounds (Consider moving these to a config file)
  // Find corners of mega structures for bounding boxes
  const megablockNW = locations.find(loc => loc.id === MEGABLOCK_NW) ?? {lat: "35.079368", long: "-117.822524"};
  const megablockSE = locations.find(loc => loc.id === MEGABLOCK_SE) ?? {lat: "35.078996", long: "-117.822285"};
  const megamallNW = locations.find(loc => loc.id === MEGAMALL_NW) ?? {lat: "35.079656", long: "-117.822066"};
  const megamallSE = locations.find(loc => loc.id === MEGAMALL_SE) ?? {lat: "35.079379", long: "-117.821903"};
  // TODO: Add a fallback if we can't find these locations

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
  locations.forEach((loc: any) => {
    if (loc.lat == null || loc.long == null) return;
    const latlng = L.latLng(loc.lat, loc.long);

    // Enrich data (Rating, Hours, Links)
    const enrichedLoc = enrichLocation(loc);

    // Persist calculated data back into local cookie
    loc.ownerisfaction = enrichedLoc.ownerisfaction;
    loc.ownerlink = enrichedLoc.ownerlink;
    loc.prettyhours = enrichedLoc.prettyhours;
    loc.openState = enrichedLoc.openState;
    loc.nextTimeMsg = enrichedLoc.nextTimeMsg;
    loc.rating = enrichedLoc.rating;
    
    // Determine the layer
    let targetLayer = getTargetLayer(loc, latlng, layerData, { userId, factions: factions ?? [], megablockRect, megamallRect });

    // Create the marker
    const { icon, color } = getVenueIconAndColor(loc.venuetype ?? "");
    const leafletMarker: L.Marker = L.marker(latlng, { icon: getDivIcon(icon, color), autoPan: true })
      .addTo(targetLayer)
      .on("click", () => onMarkerClick(leafletMarker)
    );

    // Handle metadata and tooltips
    leafletMarker.bindTooltip(loc.name, { permanent: true, direction: "right" });
    (leafletMarker as any).id = loc.id;

    // Dev features
    if (loc.id === LOCATOR) {
      leafletMarker.options.draggable = true;
      leafletMarker.dragging?.enable();
      leafletMarker.on('dragend', () => {
        const { lat, lng } = leafletMarker.getLatLng();
        console.log(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      });
    }
  });
}

export function renderLocationPinsToLeafletLayers(params: LeafletLocationPinsRendererParams): void {
  const {
    layerData,
    pins,
    getVenueIconAndColor,
    getDivIcon,
    onMarkerClick,
  } = params;

  const requiredLayers = ["pinsLayer"];
  for (const key of requiredLayers) {
    const layer = layerData.get(key);
    if (!layer) {
      console.log("Failed to load " + key);
      return; // Safety check
    }
    layer.clearLayers();
  }

  pins.forEach((pin: any) => {
    if (pin.lat == null || pin.long == null) return;
    const latlng = L.latLng(pin.lat, pin.long);

    // Create the marker
    const { icon, color } = getVenueIconAndColor("location_pin");
    const leafletMarker: L.Marker = L.marker(latlng, { icon: getDivIcon(icon, color), autoPan: true })
      .addTo(layerData.get("pinsLayer")!)
      .on("click", () => onMarkerClick(leafletMarker)
    );

    const isoString: string = pin.ts;
    const date: Date = new Date(isoString);

    // Returns a human-readable string based on the user's locale (e.g., "3/20/2024, 8:00:00 AM")
    const readableDate: string = date.toLocaleString(); 

    leafletMarker.bindTooltip(pin.name + "<br>" + pin.id + "<br>" + readableDate, { permanent: true, direction: "right" });
  });
};