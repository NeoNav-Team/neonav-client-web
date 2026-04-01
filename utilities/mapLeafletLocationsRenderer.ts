import L from "leaflet";
import type { LayerGroup } from "leaflet";
import { compressHoursAcrossMidnight, generateOpenMessages } from "@/utilities/mapTimeUtils";

export interface LeafletLocationsRendererParams {
  mymap: L.Map;
  layerData: Map<String, LayerGroup>;
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

  const locationMarkersLayer = layerData.get("locationMarkersLayer") as LayerGroup | undefined;
  if (!locationMarkersLayer) return;

  const megablockLocations = layerData.get("megablockLocations") as LayerGroup | undefined;
  const megamallLocations = layerData.get("megamallLocations") as LayerGroup | undefined;
  const megablockAndMegamallLocations = layerData.get("megablockAndMegamallLocations") as LayerGroup | undefined;
  if (!megablockLocations || !megamallLocations || !megablockAndMegamallLocations) return;

  const devLayer = layerData.get("devLayer") as LayerGroup | undefined;
  if (!devLayer) return;

  const eventLayer = layerData.get("eventLayer") as LayerGroup | undefined;
  if (!eventLayer) return;

  const myLocationsLayer = layerData.get("mylocations") as LayerGroup | undefined;
  if (!myLocationsLayer) return;

  const unverifiedLayer = layerData.get("unverified") as LayerGroup | undefined;
  if(!unverifiedLayer) return;

  // Clear to avoid marker duplication across refreshes.
  locationMarkersLayer.clearLayers();
  megablockLocations.clearLayers();
  megamallLocations.clearLayers();
  megablockAndMegamallLocations.clearLayers();
  devLayer.clearLayers();
  eventLayer.clearLayers();
  myLocationsLayer.clearLayers();
  unverifiedLayer.clearLayers();

  const allLocations = locations.concat(extraMarkers ?? []);

  // TODO: These should be calculated from the database.
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
    pos: megablockRect.getCenter(), // This marker will be at the entrance to the megablock, so it will pull pos from DB
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
    pos: megamallRect.getCenter(), // This marker will be at the entrance to the megamall, so it will pull pos from DB
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
    const lat = loc.lat;
    const long = loc.long;
    if (lat == null || long == null) return;

    const latlng = L.latLng(lat, long);

    const { icon: venueIcon, color: venueColor } = getVenueIconAndColor(loc.venuetype ?? "");

    // This if check should go away once we get rid of "allLocations" because everything is in the database
    if (locations.find(location => loc.id === location.id)) {
      const thisloc = locations.find(location => loc.id === location.id);

      thisloc.ownerisfaction = loc.owner.startsWith("C");
      thisloc.ownerlink = thisloc.ownerisfaction  ? '/factions/' + loc.owner : '/contacts/' + loc.owner;

      thisloc.prettyhours = compressHoursAcrossMidnight(loc.hours ?? []);

      const {openState, nextTimeMsg} = generateOpenMessages(thisloc.prettyhours);
      thisloc.openState = openState ? openState : "Closed";
      thisloc.nextTimeMsg = nextTimeMsg ? nextTimeMsg : "";

      // Do calculations to average rating
      thisloc.rating = "No reviews";
      if (thisloc.reviews?.length > 0) {
        let ratingSum = 0;
        thisloc.reviews.forEach((review: any) => {
          ratingSum += review.rating;
        });
        thisloc.rating = "Rating: " + ratingSum / thisloc.reviews.length;
      }
    }

    // If marker is within megablock or megamall area, add to corresponding layer group so it can be toggled with zoom.
    let targetLayer: LayerGroup = locationMarkersLayer;
    if (loc.owner === "C231465509") { // Neo City Admin
      targetLayer = eventLayer;
    } else if (loc.owner === "C461879533") { // Neonav Maint.
      targetLayer = devLayer;
    } else if (megablockRect.contains(latlng)) {
      targetLayer = megablockLocations;
    } else if (megamallRect.contains(latlng)) {
      targetLayer = megamallLocations;
    }

    const canSee =
      (!!loc.verified) || // Can always see verified locations
      loc.owner === userId || // Can see locations you own
      (loc.owner.startsWith("C") &&
        (factions ?? []).some((faction: any) => faction.id === loc.owner)); // Can see locations your faction owns

    if (!canSee) return;

    const leafletMarker = L.marker(latlng, {
      icon: getDivIcon(venueIcon, venueColor),
    })
      .addTo(targetLayer)
      .on("click", () => {
        onMarkerClick(leafletMarker);
      });

    leafletMarker.bindTooltip(loc.name, { permanent: true, direction: "right" });
    (leafletMarker as any).id = loc.id;
  });
}

