import L from "leaflet";
import type { LayerGroup } from "leaflet";

export interface LeafletLocationsRendererParams {
  mymap: L.Map;
  layerData: Map<String, LayerGroup>;
  locations: any[];
  extraMarkers?: any[];
  userId?: string;
  factions?: any[];
  getVenueIconAndColor: (venuetype: string) => { icon: any; color: string };
  getDivIcon: (materialIcon: any, color: string) => any;
  compressHoursAcrossMidnight: (hoursData: any[]) => any[];
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
    compressHoursAcrossMidnight,
    onMarkerClick,
  } = params;

  const locationMarkersLayer = layerData.get("locationMarkersLayer") as LayerGroup | undefined;
  if (!locationMarkersLayer) return;

  const megablockLocations = layerData.get("megablockLocations") as LayerGroup | undefined;
  const megamallLocations = layerData.get("megamallLocations") as LayerGroup | undefined;
  const megablockAndMegamallLocations = layerData.get(
    "megablockAndMegamallLocations",
  ) as LayerGroup | undefined;

  if (!megablockLocations || !megamallLocations || !megablockAndMegamallLocations) return;

  // Clear to avoid marker duplication across refreshes.
  locationMarkersLayer.clearLayers();
  megablockLocations.clearLayers();
  megamallLocations.clearLayers();
  megablockAndMegamallLocations.clearLayers();

  const allLocations = locations.concat(extraMarkers ?? []);

  const megablockRect = L.latLngBounds(
    L.latLng(35.079398, -117.822520),
    L.latLng(35.079091, -117.822274),
  );
  const megamallRect = L.latLngBounds(
    L.latLng(35.079605, -117.822139),
    L.latLng(35.079321, -117.821962),
  );

  // Create megablock meta icon
  const megablockLoc = {
    id: "L000000000",
    name: "Megablock 01",
    owner: "",
    venuetype: "megablock",
    verified: true,
    pos: megablockRect.getCenter(),
  };
  const { icon: megablockIcon, color: megablockColor } = getVenueIconAndColor(megablockLoc.venuetype);
  const megablockMarker = L.marker(megablockLoc.pos, {
    icon: getDivIcon(megablockIcon, megablockColor),
  })
    .addTo(megablockAndMegamallLocations)
    .on("click", () => {
      mymap.flyTo(megablockMarker.getLatLng());
    });
  megablockMarker.bindTooltip(megablockLoc.name, { permanent: true, direction: "right" });

  // Create megamall meta icon
  const megamallLoc = {
    id: "L000000000",
    name: "Megamall",
    owner: "",
    venuetype: "megablock",
    verified: true,
    pos: megamallRect.getCenter(),
  };
  const { icon: megamallIcon, color: megamallColor } = getVenueIconAndColor(megamallLoc.venuetype);
  const megamallMarker = L.marker(megamallLoc.pos, {
    icon: getDivIcon(megamallIcon, megamallColor),
  })
    .addTo(megablockAndMegamallLocations)
    .on("click", () => {
      mymap.flyTo(megamallMarker.getLatLng());
    });
  megamallMarker.bindTooltip(megamallLoc.name, { permanent: true, direction: "right" });

  allLocations.forEach((loc: any) => {
    const lat = loc.pos?.lat ?? loc.pos?.latitude;
    const lng = loc.pos?.lng ?? loc.pos?.longitude;
    if (lat == null || lng == null) return;

    const { icon: venueIcon, color: venueColor } = getVenueIconAndColor(loc.venuetype ?? "");

    const markerInfo = {
      id: loc.id,
      name: loc.name ?? "",
      owner: loc.owner ?? "",
      venuetype: loc.venuetype ?? "",
      verified: !!loc.verified,
      pos: L.latLng(lat, lng),
      hours: loc.hours ?? [],
      reviews: loc.reviews ?? [],
      ownername: loc.ownername ?? "",
      prettyhours: compressHoursAcrossMidnight(loc.hours ?? []),
      showtooltip: true,
      icon: venueIcon,
      color: venueColor,
    };

    // If marker is within megablock or megamall area, add to corresponding layer group so it can be toggled with zoom.
    let targetLayer: LayerGroup = locationMarkersLayer;
    if (megablockRect.contains(markerInfo.pos)) {
      targetLayer = megablockLocations;
    } else if (megamallRect.contains(markerInfo.pos)) {
      targetLayer = megamallLocations;
    }

    const canSee =
      markerInfo.verified ||
      markerInfo.owner === userId ||
      (markerInfo.owner.startsWith("C") &&
        (factions ?? []).some((faction: any) => faction.id === markerInfo.owner));

    if (!canSee) return;

    const leafletMarker = L.marker(markerInfo.pos, {
      icon: getDivIcon(markerInfo.icon, markerInfo.color),
    })
      .addTo(targetLayer)
      .on("click", () => {
        onMarkerClick(leafletMarker);
      });

    leafletMarker.bindTooltip(markerInfo.name, { permanent: true, direction: "right" });
    (leafletMarker as any).neonavdata = markerInfo;
  });
}

