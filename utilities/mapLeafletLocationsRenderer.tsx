import L, { divIcon, icon } from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import type { LayerGroup } from 'leaflet';
import React from 'react';
import { enrichLocation, getTargetLayer } from '@/utilities/mapLocationUtils';

// Map Icons
import { createSvgIcon } from '@mui/material/utils';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';  // Arcade
import TempleBuddhistIcon from '@mui/icons-material/TempleBuddhist';  //Chaple
import WorkIcon from '@mui/icons-material/Work'; // Employment
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'; // Entertainment
import RamenDiningIcon from '@mui/icons-material/RamenDining'; // Food
import NightlifeIcon from '@mui/icons-material/Nightlife'; // Lounge
import SpeakerIcon from '@mui/icons-material/Speaker'; // Music
// Office
import WcIcon from '@mui/icons-material/Wc'; // Porto
import SimCardIcon from '@mui/icons-material/SimCard'; // Service
import LocalMallIcon from '@mui/icons-material/LocalMall'; // Store

// Allegiance Icons
// https://www.iconarchive.com/show/material-icons-by-pictogrammers/dna-icon.html // Helix loaded below
import ControlCameraIcon from '@mui/icons-material/ControlCamera'; // Endline
import ViewInArIcon from '@mui/icons-material/ViewInAr'; // Reboot?
import EarbudsIcon from '@mui/icons-material/Earbuds'; // Syndicate?

import HiveIcon from '@mui/icons-material/Hive'; // Megamall
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'; // Medical
import LocalPoliceIcon from '@mui/icons-material/LocalPolice'; // Security

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Info
import AdjustIcon from '@mui/icons-material/Adjust'; // Default

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';

import AttributionIcon from '@mui/icons-material/Attribution'; // Individual Location Pin
import AddIcon from '@mui/icons-material/Add'; // New Location

// TODO these should probably move to a constants file
const MEGABLOCK_NW = 'L950362737';
const MEGABLOCK_SE = 'L822128842';
const MEGAMALL_NW = 'L174138988';
const MEGAMALL_SE = 'L205837229';
const LOCATOR = 'L401233115';

const DnaIcon = createSvgIcon(
  <path d="M4,2H6V4C6,5.44 6.68,6.61 7.88,7.78C8.74,8.61 9.89,9.41 11.09,10.2L9.26,11.39C8.27,10.72 7.31,10 6.5,9.21C5.07,7.82 4,6.1 4,4V2M18,2H20V4C20,6.1 18.93,7.82 17.5,9.21C16.09,10.59 14.29,11.73 12.54,12.84C10.79,13.96 9.09,15.05 7.88,16.22C6.68,17.39 6,18.56 6,20V22H4V20C4,17.9 5.07,16.18 6.5,14.79C7.91,13.41 9.71,12.27 11.46,11.16C13.21,10.04 14.91,8.95 16.12,7.78C17.32,6.61 18,5.44 18,4V2M14.74,12.61C15.73,13.28 16.69,14 17.5,14.79C18.93,16.18 20,17.9 20,20V22H18V20C18,18.56 17.32,17.39 16.12,16.22C15.26,15.39 14.11,14.59 12.91,13.8L14.74,12.61M7,3H17V4L16.94,4.5H7.06L7,4V3M7.68,6H16.32C16.08,6.34 15.8,6.69 15.42,7.06L14.91,7.5H9.07L8.58,7.06C8.2,6.69 7.92,6.34 7.68,6M9.09,16.5H14.93L15.42,16.94C15.8,17.31 16.08,17.66 16.32,18H7.68C7.92,17.66 8.2,17.31 8.58,16.94L9.09,16.5M7.06,19.5H16.94L17,20V21H7V20L7.06,19.5Z" />,
  'DnaIcon'
);


export interface LeafletLocationsRendererParams {
  layerData: Map<string, LayerGroup>;
  locations: any[];
  userId: string;
  linkedLocationId: string;
  onMarkerClick: (leafletMarker: L.Marker) => void;
  infoModalState: any;
  selectedLocationId: string;
  updateField: Function;
}

export interface LeafletLocationPinsRendererParams {
  layerData: Map<string, LayerGroup>;
  pins: any[];
  onMarkerClick: (leafletMarker: L.Marker) => void;
}

// This does a little hacking to render a materialUi icon as a leaflet marker
const getIconSettings = (materialIcon: any, color: string) => {
  return {
    mapIconUrl: `
      <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 240">
        <defs>
          <filter id="f1" x="0" y="0"><feGaussianBlur in="SourceGraphic" stdDeviation="7" /></filter>
        </defs>
        <path fill="#ffffff90" filter="url(#f1)" transform="translate(7.5 120) scale(0.9 0.5)" d="M74 0L149 40L144 120L74 240L4 120L4 40z"/>
        <path fill="${color}" stroke-width="4px" stroke="#000000" d="M74 0L149 40L144 120L74 240L4 120L4 40z"/>
        <svg version="1" xmlns="http://www.w3.org/2000/svg" width="90%" x="8px" y="-30px">
          ${(materialIcon ? ReactDOMServer.renderToStaticMarkup(materialIcon) : '')}
        </svg>
      </svg>`,
    mapIconColor: color
  };
};

// maybe this should move to locations render util
const getDivIcon = (materialIcon: any, color: string) => {
  const settings = getIconSettings(materialIcon, color);
  return L.divIcon({
    className: 'leaflet-data-marker',
    html: L.Util.template(settings.mapIconUrl, settings),
    iconAnchor: [15, 48],
    iconSize: [30, 48],
    tooltipAnchor: [2, -30]
  });
};

// Cyberpunk 2077 Blue #5191ff

// Colorblind friendly(ish) colors - used for map markers (comments render color squares in some IDEs)
const cyberGreen = '#009E73'; // #009E73
const cyberOrange = '#D55E00'; // #D55E00
const cyberBlueDark = '#0072B2'; // #0072B2
const cyberBlueLight = '#56B4E9'; // #56B4E9
const cyberYellow = '#F0E442'; // #F0E442
const neoPink = '#D45893'; // #D45893
const neoOrange = '#FCAC6F'; // #FCAC6F
const neoGreen = '#47E15D'; // #47E15D
const rebootRed = '#BB0000'; // #FF0000
const white = '#FFFFFF'; // #FFFFFF
const red = '#FF0000'; // #FF0000

// TODO this should be synced with the list in mapInfoModal in some way
const VENUE_ICON_MAP = new Map<string, any>([
  ['arcade', {icon: SportsEsportsIcon, iconColor: neoOrange, pinColor: cyberBlueDark}],
  ['chapel', {icon: TempleBuddhistIcon, iconColor: cyberOrange, pinColor: cyberBlueDark}],
  ['employment', {icon: WorkIcon, iconColor: cyberYellow, pinColor: cyberBlueDark}],
  ['entertainment', {icon: TheaterComedyIcon, iconColor: cyberYellow, pinColor: cyberBlueDark}],
  ['food', {icon: RamenDiningIcon, iconColor: cyberYellow, pinColor: cyberBlueDark}],
  ['lounge', {icon: NightlifeIcon, iconColor: cyberYellow, pinColor: cyberBlueDark}],
  ['music', {icon: SpeakerIcon, iconColor: cyberYellow, pinColor: cyberBlueDark}],
  ['office', {icon: HelpOutlineOutlinedIcon, iconColor: cyberYellow, pinColor: cyberBlueDark}],
  ['porto', {icon: WcIcon, iconColor: white, pinColor: cyberOrange}],
  ['service', {icon: SimCardIcon, iconColor: cyberYellow, pinColor: cyberBlueDark}],
  ['store', {icon: LocalMallIcon, iconColor: cyberYellow, pinColor: cyberBlueDark}],
  
  ['endline', {icon: ControlCameraIcon, iconColor: cyberBlueDark, pinColor: neoGreen}],
  ['helix', {icon: DnaIcon, iconColor: cyberBlueDark, pinColor: cyberYellow}],
  ['reboot', {icon: ViewInArIcon, iconColor: white, pinColor: rebootRed}],
  ['syndicate', {icon: EarbudsIcon, iconColor: white, pinColor: cyberOrange}],

  ['dev', {icon: AdjustIcon, iconColor: white, pinColor: red}],
  ['info', {icon: InfoOutlinedIcon, iconColor: white, pinColor: red}],
  ['megablock', {icon: HiveIcon, iconColor: cyberBlueDark, pinColor: cyberYellow}],
  ['megamall', {icon: LocalMallIcon, iconColor: cyberBlueDark, pinColor: cyberYellow}],
  ['medical', {icon: HealthAndSafetyIcon, iconColor: white, pinColor: cyberOrange}],
  ['security', {icon: LocalPoliceIcon, iconColor: white, pinColor: cyberOrange}],

  ['location_pin', {icon: AttributionIcon, iconColor: white, pinColor: cyberGreen}],
  ['new_location', {icon: AddIcon, iconColor: cyberYellow, pinColor: cyberGreen}],
]);

const getVenueIconAndColor = (venuetype: string): { icon: React.ReactElement; color: string } => {
  const vt = (venuetype || '').toLowerCase();

  // Try exact match first
  let match = VENUE_ICON_MAP.get(vt);

  // Fallback to partial match
  if (!match) {
    // Array.from(VENUE_ICON_MAP) turns the map into [[key, value], ...]
    const partialMatch = Array.from(VENUE_ICON_MAP.entries())
      .find(([key]) => vt.includes(key));    
    if (partialMatch) match = partialMatch[1];
  }

  if (match) {
    const IconSource = match.icon;
    
    const innerSvg = <IconSource style={{ color: match.iconColor }} />;

    return {
      icon: innerSvg,
      color: match.pinColor
    };
  }

  // Default fallback rendered as string
  return { 
    icon: <AdjustIcon style={{ color: cyberYellow }} />, 
    color: cyberBlueDark 
  };
};

export function renderLocationsToLeafletLayers(params: LeafletLocationsRendererParams): void {
  const {
    layerData,
    locations,
    userId,
    linkedLocationId,
    onMarkerClick,
    infoModalState,
    selectedLocationId,
    updateField,
  } = params;

  // 1. Setup & Clear Layers
  const requiredLayers = ['locationMarkersLayer', 'megablockLocations', 'megamallLocations', 'megablockAndMegamallLocations', 'devLayer', 'pinsLayer', 'mylocations', 'unverified'];
  for (const key of requiredLayers) {
    const layer = layerData.get(key);
    if (!layer) {
      console.log('Failed to load ' + key);
      return; // Safety check
    }
    layer.clearLayers();
  }

  // 2. Constants & Bounds (Consider moving these to a config file)
  // Find corners of mega structures for bounding boxes
  const megablockNW = locations.find(loc => loc.id === MEGABLOCK_NW) ?? {lat: '35.079368', long: '-117.822524'};
  const megablockSE = locations.find(loc => loc.id === MEGABLOCK_SE) ?? {lat: '35.078996', long: '-117.822285'};
  const megamallNW = locations.find(loc => loc.id === MEGAMALL_NW) ?? {lat: '35.079656', long: '-117.822066'};
  const megamallSE = locations.find(loc => loc.id === MEGAMALL_SE) ?? {lat: '35.079379', long: '-117.821903'};

  const megablockRect = L.latLngBounds(
    L.latLng(megablockNW.lat, megablockNW.long),
    L.latLng(megablockSE.lat, megablockSE.long),
  );
  const megamallRect = L.latLngBounds(
    L.latLng(megamallNW.lat, megamallNW.long),
    L.latLng(megamallSE.lat, megamallSE.long),
  );

  // Visual aids for Devs
  L.rectangle(megablockRect).addTo(layerData.get('devLayer')!);
  L.rectangle(megamallRect).addTo(layerData.get('devLayer')!);

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
    let targetLayer = getTargetLayer(loc, latlng, layerData, { userId, linkedLocationId, megablockRect, megamallRect });

    // Create the marker
    const { icon, color } = getVenueIconAndColor(loc.venuetype ?? '');
    const leafletMarker: L.Marker = L.marker(latlng, {
      icon: getDivIcon(icon, color),
      autoPan: true,
      draggable: (infoModalState === 'edit' && loc.id === selectedLocationId)
    })
      .addTo(targetLayer)
      .on('click', () => onMarkerClick(leafletMarker))
      .on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        updateField('lat', newPos.lat.toFixed(6)); // Your state for the DB
        updateField('long', newPos.lng.toFixed(6)); // Your state for the DB
      })
    ;

    // Handle metadata and tooltips
    leafletMarker.bindTooltip(loc.tooltip?.name ? loc.tooltip?.name : loc.name, { permanent: true, direction: 'right' }).closeTooltip();
    (leafletMarker as any).id = loc.id;

    // Dev features
    if (loc.id === LOCATOR) {
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
    onMarkerClick,
  } = params;

  const requiredLayers = ['pinsLayer'];
  for (const key of requiredLayers) {
    const layer = layerData.get(key);
    if (!layer) {
      console.log('Failed to load ' + key);
      return; // Safety check
    }
    layer.clearLayers();
  }

  pins.forEach((pin: any) => {
    if (pin.lat == null || pin.long == null) return;
    const latlng = L.latLng(pin.lat, pin.long);

    // Create the marker
    const { icon, color } = getVenueIconAndColor('location_pin');
    const leafletMarker: L.Marker = L.marker(latlng, { icon: getDivIcon(icon, color), autoPan: true })
      .addTo(layerData.get('pinsLayer')!)
      .on('click', () => onMarkerClick)
    ;

    const isoString: string = pin.ts;
    const date: Date = new Date(isoString);
    date.setFullYear(date.getFullYear() + 200); // 200 year jump to 22xx

    // Returns a human-readable string based on the user's locale (e.g., '3/20/2224, 8:00:00 AM')
    const readableDate: string = date.toLocaleString(); 

    leafletMarker.bindTooltip(pin.name + ' [' + pin.userid + ']<br>' + readableDate, { permanent: true, direction: 'right' });
  });
};

export function renderNewLocationPin(latLng: L.LatLng, mymap: L.Map, updateField: Function): L.Marker {
  const { icon, color } = getVenueIconAndColor('new_location');
  const newMarker = L.marker(latLng, {
    icon: getDivIcon(icon, color),
    autoPan: true,
    draggable: true,
  }).on('dragend', (e) => {
    const newPos = e.target.getLatLng();
    updateField('lat', newPos.lat.toFixed(6)); // Your state for the DB
    updateField('long', newPos.lng.toFixed(6)); // Your state for the DB
  }).addTo(mymap);

  newMarker.setZIndexOffset(2000);

  newMarker.bindTooltip('New Location', { permanent: true, direction: 'right' });

  return newMarker;
}