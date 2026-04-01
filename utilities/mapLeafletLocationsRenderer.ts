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

  // TODO: the two mega* locations down _need_ separate layers, maybe we should rename these and consolidate
  const megablockLocations = layerData.get("megablockLocations") as LayerGroup | undefined;   // These are hidden unless zoomed in
  const megamallLocations = layerData.get("megamallLocations") as LayerGroup | undefined;   // These are hidden unless zoomed in
  const megablockAndMegamallLocations = layerData.get("megablockAndMegamallLocations") as LayerGroup | undefined;   // These are hidden unless zoomed out
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

  // Create megablock meta icon (This will come from DB)
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

  // Create megamall meta icon (This will come from DB)
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

  L.rectangle(megablockRect).addTo(devLayer);
  L.rectangle(megamallRect).addTo(devLayer);

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

    
    // Filter locations into the appropriate layers
    // Be aware that markers will go into the first layer they match top to bottom in this ifelse block
    let targetLayer: LayerGroup = locationMarkersLayer;
    if (!loc.verified && (        // Only add to "My Locations" if it isn't verified, verified locs will always be shown
        loc.owner === userId ||      // You own it
        loc.createdby === userId ||     // You created it
        (factions ?? []).some((faction: any) => faction.id === loc.owner)) // Your faction owns it
    ) { 
      targetLayer = myLocationsLayer;

    } else if (!loc.verified) {
      targetLayer = unverifiedLayer;

    } else if (loc.owner === "C461879533" || loc.venuetype === "dev") { // Neonav Maint.
      targetLayer = devLayer;

    } else if (megablockRect.contains(latlng)) { // If marker is within megablock or megamall area,
      targetLayer = megablockLocations;

    } else if (megamallRect.contains(latlng)) {  //add to corresponding layer group so it can be toggled with zoom.
      targetLayer = megamallLocations;

    } else if (loc.owner === "C231465509") { // Neo City Admin
      targetLayer = eventLayer;
      
    }

    const leafletMarker = L.marker(latlng, {
      icon: getDivIcon(venueIcon, venueColor),
    })
      .addTo(targetLayer)
      .on("click", () => {
        onMarkerClick(leafletMarker);
      })
      .on('dragend', (e) => {
        console.log(leafletMarker.getLatLng().lat.toFixed(6) + ", " + leafletMarker.getLatLng().lng.toFixed(6));
      });

    leafletMarker.bindTooltip(loc.name, { permanent: true, direction: "right" });
    if (loc.id === "L999999999") { // TODO change this to a real id once it is in the DB
      leafletMarker.dragging?.enable();
    }
    (leafletMarker as any).id = loc.id;
  });
}

