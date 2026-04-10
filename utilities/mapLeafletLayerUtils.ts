import L from 'leaflet';

/**
 * Initializes the layer groups that are 'structural' (location markers + megablock/megamall visibility)
 * and adds the required groups to the map.
 * Layer names set here that should be togglable must match MapLayersModalLayerId in mapLayersModal.tsx
 */
export function initStaticLayerGroups(
  mymap: L.Map,
  layerData: Map<string, L.LayerGroup>,
): void {
  // Location markers are always visible.
  layerData.set('locationMarkersLayer', L.layerGroup());
  mymap.addLayer(layerData.get('locationMarkersLayer')!);

  // Dev location markers used by maintainance staff
  layerData.set('devLayer', L.layerGroup());

  // Personal location pin markers
  layerData.set('pinsLayer', L.layerGroup());

  // These are toggled based on zoom level.
  layerData.set('megablockLocations', L.layerGroup());
  layerData.set('megamallLocations', L.layerGroup());
  layerData.set('megablockAndMegamallLocations', L.layerGroup());

  // Default view starts with the combined layer.
  mymap.addLayer(layerData.get('megablockAndMegamallLocations')!);

  // Placeholders used by the Layers modal.
  layerData.set('mylocations', L.layerGroup());
  layerData.set('unverified', L.layerGroup());
}

/**
 * Wires zoom changes to show/hide the megablock/megamall layers.
 * Matches the behavior previously embedded directly in `components/mapApp.tsx`.
 */
export function wireZoomLayerVisibility(
  mymap: L.Map,
  layerData: Map<string, L.LayerGroup>
): void {
  mymap.on('zoomend', () => {
    const zoomLevel = mymap.getZoom();

    if (zoomLevel >= 21) {
      if (!mymap.hasLayer(layerData.get('megablockLocations')!)) {
        mymap.addLayer(layerData.get('megablockLocations')!);
      }
      if (!mymap.hasLayer(layerData.get('megamallLocations')!)) {
        mymap.addLayer(layerData.get('megamallLocations')!);
      }
      if (mymap.hasLayer(layerData.get('megablockAndMegamallLocations')!)) {
        mymap.removeLayer(layerData.get('megablockAndMegamallLocations')!);
      }
    } else {
      if (mymap.hasLayer(layerData.get('megablockLocations')!)) {
        mymap.removeLayer(layerData.get('megablockLocations')!);
      }
      if (mymap.hasLayer(layerData.get('megamallLocations')!)) {
        mymap.removeLayer(layerData.get('megamallLocations')!);
      }
      if (!mymap.hasLayer(layerData.get('megablockAndMegamallLocations')!)) {
        mymap.addLayer(layerData.get('megablockAndMegamallLocations')!);
      }
    }

    handleZoomNameToggle(mymap, layerData, '');
  });
  
}

export function handleZoomNameToggle(
  mymap: L.Map,
  layerData: Map<string, L.LayerGroup>,
  selectedLocationId: string
): void {
  const zoomLevel = mymap.getZoom();
  // When we are zoomed in, always show names
  if (zoomLevel >= 20) {
    layerData.forEach((layer) => {
      layer.eachLayer((layerPart) => {
        if (layerPart instanceof L.Marker) {
          layerPart.openTooltip();
        }
      });
    });
  } else {
    layerData.forEach((layer) => {
      layer.eachLayer((layerPart) => {
        if (layerPart instanceof L.Marker) {
          if ((layerPart as any).id === selectedLocationId) {  // When we are zoomed out, show name if it is selected
            layerPart.openTooltip();
          } else {
            layerPart.closeTooltip();
          }
        }
      });
    });
  }
}

