import L from "leaflet";

/**
 * Initializes the layer groups that are "structural" (location markers + megablock/megamall visibility)
 * and adds the required groups to the map.
 */
export function initStaticLayerGroups(
  mymap: L.Map,
  layerData: Map<String, L.LayerGroup>,
): void {
  // Location markers are always visible.
  layerData.set("locationMarkersLayer", L.layerGroup());
  mymap.addLayer(layerData.get("locationMarkersLayer")!);

  // These are toggled based on zoom level.
  layerData.set("megablockLocations", L.layerGroup());
  layerData.set("megamallLocations", L.layerGroup());
  layerData.set("megablockAndMegamallLocations", L.layerGroup());

  // Default view starts with the combined layer.
  mymap.addLayer(layerData.get("megablockAndMegamallLocations")!);

  // Placeholders used by the Layers modal.
  layerData.set("testLayer2", L.layerGroup());
  layerData.set("testLayer3", L.layerGroup());
}

/**
 * Wires zoom changes to show/hide the megablock/megamall layers.
 * Matches the behavior previously embedded directly in `components/mapApp.tsx`.
 */
export function wireZoomLayerVisibility(
  mymap: L.Map,
  layerData: Map<String, L.LayerGroup>,
): void {
  mymap.on("zoomend", () => {
    const zoomLevel = mymap.getZoom();

    if (zoomLevel >= 21) {
      if (!mymap.hasLayer(layerData.get("megablockLocations")!)) {
        mymap.addLayer(layerData.get("megablockLocations")!);
      }
      if (!mymap.hasLayer(layerData.get("megamallLocations")!)) {
        mymap.addLayer(layerData.get("megamallLocations")!);
      }
      if (mymap.hasLayer(layerData.get("megablockAndMegamallLocations")!)) {
        mymap.removeLayer(layerData.get("megablockAndMegamallLocations")!);
      }
    } else {
      if (mymap.hasLayer(layerData.get("megablockLocations")!)) {
        mymap.removeLayer(layerData.get("megablockLocations")!);
      }
      if (mymap.hasLayer(layerData.get("megamallLocations")!)) {
        mymap.removeLayer(layerData.get("megamallLocations")!);
      }
      if (!mymap.hasLayer(layerData.get("megablockAndMegamallLocations")!)) {
        mymap.addLayer(layerData.get("megablockAndMegamallLocations")!);
      }
    }
  });
}

