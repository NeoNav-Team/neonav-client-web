'use client';

import 'styles/leaflet.css';
import styles from '@/styles/generic.module.css';
import React, {useEffect, useRef, useState} from 'react';

import L from 'leaflet';
import 'leaflet-rotate';
import {
  Autocomplete,
  Box,
  Container,
  Modal,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import FooterNav from '@/components/footerNav';
import ReviewDialog from '@/components/reviewDialog';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import EventIcon from '@mui/icons-material/Event';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { DeleteForever } from '@mui/icons-material';
import { MapInfoModal } from '@/components/mapInfoModal';
import { Context as NnContext } from '@/components/context/nnContext';
import { NnProviderValues } from '@/components/context/nnTypes';
import MapLayersModal from '@/components/mapLayersModal';
import { initStaticLayerGroups, wireZoomLayerVisibility, handleZoomNameToggle } from '@/utilities/mapLeafletLayerUtils';
import { renderLocationsToLeafletLayers, renderLocationPinsToLeafletLayers, renderNewLocationPin } from '@/utilities/mapLeafletLocationsRenderer';
import { NEONAV_MAINT } from '@/utilities/constants';
import { getSettingsCookie, setSettingsCookie } from '../utilities/cookieContext';


interface PageContainerProps {
  params?: {
    id: string;
  }
}

interface RotateControl extends L.Control {
  _arrow: HTMLElement;
  _map: L.Map;
  _update(): void;
  _reset(e: L.LeafletEvent): void;
  getContainer(): HTMLElement;
}

const SVG_MAP_FILE = '/Winter2026v2.svg'
const LRG_SVG_MAP_FILE = '/Winter2026_large_v1.svg'

const EMPTY_LOCATION = {id: '', name: '', description: '', venuetype: '', openState: '', nextTimeMsg: '', prettyhours: [], rating: '', ownerisfaction: false, owner: '', ownername: '', ownerlink: '', creator: '', reviews: [], neosite: '', verified: false, tooltip: {name: '', lat: 0, long: 0}};

class CustomTileLayer extends L.TileLayer {
  constructor(options?: L.TileLayerOptions) {
    super('', options); // Pass an empty URL, as getTileUrl will generate it
  }

  // Only ever show "default" tile
  getTileUrl(coords: L.Coords) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEABIABABYgdoOhwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kGFwAcDSfXW4wAAAMtSURBVHja7d2xbcMwEIZRK2DrQkAGyQych8N6EHYZgKkCBNcpEPwXfK9Uk1AHfKDc3NHPsR7Alj68AhAAQACAnbT64PU93/oPfD0/3/43//7txJnT5/89d2rm5p87f529GwD4BAAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEALjF0c+xvAbYk+WgD8tBLQe1HBTwGwAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIAXGQ9OLgBADtq9UFiV7398DNy7tTMzT93/jp7NwDwCQAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgBcdfRzLK8B9tTqg8SuevvhZ+TcqZmbf+78dfY+AcBvAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAALewHBTcAAABAAQA2EOrDxK76u2Hn5Fzp2Zu/rnz19m7AYBPAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAOCqo59jeQ2wp1YfJHbV2w8/I+dOzdz8c+evs/cJAH4DAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAIB/sh4c3ACAHbX6ILGr3n74GTl3aubmnzt/nb0bAPgEAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAK46+jmW1wB7avVBYle9/fAzcu7UzM0/d/46e58A4DcAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAA4E52A4IbACAAgAAAe/gBFkfRtvZXmQcAAAAASUVORK5CYII='.valueOf();
  }
}

const custom = function (options?: L.TileLayerOptions): CustomTileLayer {
  return new CustomTileLayer(options);
};

// Global variable to be able to reference map pieces after they are initialized. TODO probably should be in a more react-ful storage
const myMapObjects = new Map<string, any>();
const layerData = new Map<string, L.LayerGroup>();

export default function MapApp(props: PageContainerProps): JSX.Element {
  // A wall of styles to animate and resize the modal, footer, and map container
  const modalStyle_0 = {
    position: 'absolute' as 'absolute',
    top: '100dvh',
    height: '0vh',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.1s ease-in-out',
  };
  const modalStyle_10 = {
    position: 'absolute' as 'absolute',
    top: 'min(90dvh, calc(100dvh - 96px))',
    height: '10vh',
    minHeight: '96px',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.3s ease-in-out',
  };
  const modalStyle_30 = {
    position: 'absolute' as 'absolute',
    top: '70dvh',
    height: '30vh',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.3s ease-in-out',
  };
  const modalStyle_50 = {
    position: 'absolute' as 'absolute',
    top: '50dvh',
    height: '50vh',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.3s ease-in-out',
  };
  const modalStyle_90 = {
    position: 'absolute' as 'absolute',
    top: '10dvh',
    height: '90vh',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.3s ease-in-out',
  };
  const flexFooter = {
    position: 'absolute',
    top: 'calc(100dvh - 174px)',
    width: '100%',
    transition: 'all 0.3s ease-in-out',
  };
  const flexFooterFront = {
    position: 'absolute',
    top: 'calc(100dvh - 174px)',
    width: '100%',
    transition: 'all 0.3s ease-in-out',
    zIndex: '1400', // We need it to render above modal at 1300
  };
  const flexFooterHidden = {
    position: 'absolute',
    top: 'calc(100dvh - 64px)',
    width: '100%',
    transition: 'all 0.1s ease-in-out',
  };
  const mapFull = {
    height: '100dvh',
    transition: 'all 0.3s ease-in-out',
  };
  const mapEdit = {
    height: '50dvh',
    transition: 'all 0.3s ease-in-out',
  };
  const mapRef = useRef(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [userLocationKnown, setUserLocationKnown] = useState(false);
  const [lastKnownLocation, setLastKnownLocation] = useState<L.LatLng>(L.latLng(0, 0));
  const [lastKnownLocationAccuracy, setLastKnownLocationAccuracy] = useState(1400);
  const [lastKnownLocationHeading, setLastKnownLocationHeading] = useState(0);  // Currently unused but available
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [linkedLocationId, setLinkedLocationId] = useState('');
  const [markerFromLinkShown, setMarkerFromLinkShown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(EMPTY_LOCATION);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalSizeStyle, setInfoModalSizeStyle] = useState(modalStyle_0);
  const [infoModalSize, setInfoModalSize] = useState(0);
  const [infoModalState, setInfoModalState] = useState<'view' | 'edit' | 'create'>('view');
  const [showLayerModal, setShowLayerModal] = useState(false);
  const [layerModalSizeStyle, setLayerModalSizeStyle] = useState(modalStyle_0);
  const [layerStates, setLayerStates] = useState<Record<string, boolean>>({
    pinsLayer: false,
    devLayer: false,
    mylocations: false,
    unverified: false,
  });
  const stateRef = useRef(infoModalState);
  const [searchBarOptions, setSearchBarOptions] = useState([] as any);
  const [footerStyle, setFooterStyle] = useState(flexFooter);
  const [mapStyle, setMapStyle] = useState(mapFull);
  const [mapBearing, setMapBearing] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editLocationFormData, setEditLocationFormData] = React.useState({name: '', lat: 0, long: 0, owner: '', description: '', venuetype: '', hours: [] as any, tooltip: {name: '', lat: 0, long: 0, rotation: 0,}});

  const { state,
    setAlert = (severity: string, message: string) => {},
    fetchUnverifiedLocations = () => {},
    fetchLocationById = (id: string) => {},
    createLocation = (doc: any) => {},
    createFactionLocation = (faction: any, doc: any) => {},
    verifyLocation = (id: string) => {},
    updateLocation = (id: string, doc:any) => {},
    deleteLocation = (id: string) => {},
    addLocationPin = (lat: string, long: string) => {},
    fetchLocationPins = (id: string) => {},
    deleteLocationPins = () => {},
    fetchAllFactions = () => {},
    fetchFactionDetails = (id: string) => {},
  }: NnProviderValues = React.useContext(NnContext);

  const EVENT_CENTER = L.latLng(35.081840, -117.822262);
  const ACCURACY_LIMIT = 200;

  const options: L.MapOptions = {
    center: L.latLng(35.0798889, -117.8222298), // Intersection of Main & Alpha
    zoom: 18,
    minZoom: 18,
    maxZoom: 22,
    zoomSnap: 0.5,
    rotate: true,
    bearing: 0,
    maxBounds: EVENT_CENTER.toBounds(1400), // Roughly center of whole venue
    keyboard: false,  // Disable keyboard interaction; breaks a ton of stuff when editing a location
  };

  const openInfoModal = () => {
    setInfoModalSize(10);
    setInfoModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooterHidden);
    setShowInfoModal(true);
    // Timeout is required for animation to start
    setTimeout(() => {
      setInfoModalSizeStyle(modalStyle_10);
    }, 0);
  }

  const closeInfoModal = () => {
    setInfoModalSize(0);
    setInfoModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooter);
    setTimeout(() => {
      setShowInfoModal(false);
    }, 100);
  }

  const startEditMode = () => {
    // Find the current source of truth for the selected location
    const foundLocation = state?.network?.collections?.locations?.find(
      (loc) => loc.id === selectedLocationId
    );

    // Load that data into the form state before changing the mode
    if (foundLocation) {
      setEditLocationFormData({
        name: foundLocation.name || '',
        lat: foundLocation.lat || 0,
        long: foundLocation.long || 0,
        owner: foundLocation.owner || '',
        description: foundLocation.description || '',
        venuetype: foundLocation.venuetype || '',
        hours: foundLocation.hours || [],
        tooltip: foundLocation.tooltip || { 
          name: foundLocation?.name || '', 
          lat: foundLocation?.lat || 0, 
          long: foundLocation?.long || 0, 
          rotation: foundLocation?.rotation || 0 
        }
      });
    }

    setInfoModalState('edit');
    setInfoModalSizeStyle(modalStyle_50);
    // Timeout is required for animation to start
    setTimeout(() => {
      setMapStyle(mapEdit);
    }, 0);
    // Wait for animation to complete before invalidating size
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 300);
  }

  const startCreateMode = () => {
    // Open the info modal
    setInfoModalSize(90);
    setInfoModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooterFront);
    setShowInfoModal(true);
    // Timeout is required for animation to start
    setTimeout(() => {
      setInfoModalSizeStyle(modalStyle_50);
    }, 0);

    if (!mapInstanceRef.current) return; // Shouldn't get hit, but just in case

    // Create new leaflet marker at the center of user view or current user's location if they are on site
    let currentUserLocation = mapInstanceRef.current?.getCenter() as L.LatLng;
    if (userLocationKnown && EVENT_CENTER.toBounds(1400).contains(lastKnownLocation) && lastKnownLocationAccuracy < ACCURACY_LIMIT) {
      currentUserLocation = lastKnownLocation;
    }
    const newMarker = renderNewLocationPin(currentUserLocation, mapInstanceRef.current, updateField);
    myMapObjects.set('newMarker', newMarker);
    mapInstanceRef.current.panTo(currentUserLocation);
    
    setEditLocationFormData({
      name: 'New Location',
      lat: currentUserLocation.lat,
      long: currentUserLocation.lng,
      owner: state?.network?.selected?.account || '',
      description: '',
      venuetype: '',
      hours: [], // Hours can't be set during create
      tooltip: {
        name: '',
        lat: 0,
        long: 0,
        rotation: 0,
      }
    });
    setInfoModalState('create');
    setInfoModalSizeStyle(modalStyle_50);
    // Timeout is required for animation to start
    setTimeout(() => {
      setMapStyle(mapEdit);
    }, 0);
    // Wait for animation to complete before invalidating size
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 300);
  }

  const stopEditMode = () => {
    if (infoModalState === 'edit') {
      setInfoModalSizeStyle(modalStyle_90);
    } else { // Close the modal from "create" mode
      closeInfoModal();
    }
    setInfoModalState('view');
    // Timeout is required for animation to start
    setTimeout(() => {
      setMapStyle(mapFull);
    }, 0);
    // Wait for animation to complete before invalidating size
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 300);
    // Marker Cleanup
    let allMarkers: L.Marker[] = myMapObjects.get('allMarkers') || [];
    let leafletMarker = allMarkers.find((marker: any) => marker.id === selectedLocationId);
    if (leafletMarker) {
      const location = state?.network?.collections?.locations?.find(loc => loc.id === (leafletMarker as any).id);
      leafletMarker.setLatLng(L.latLng(location.lat, location.long));
      // Wait for animation to complete before flying to marker
      setTimeout(() => {
        if (mapInstanceRef.current && leafletMarker) {
          mapInstanceRef.current.panTo(leafletMarker.getLatLng());
        }
      }, 400);
    }
    if (!!myMapObjects.get('newMarker')) {
      myMapObjects.get('newMarker').remove();
      myMapObjects.set('newMarker', undefined);
    }
  }

  const openLayerModal = () => {
    setLayerModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooterHidden);
    setShowLayerModal(true);
    // Timeout is required for animation to start
    setTimeout(() => {
      setLayerModalSizeStyle(modalStyle_30);
    }, 0);
  }

  const closeLayerModal = () => {
    setLayerModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooter);
    setTimeout(() => {
      setShowLayerModal(false);
    }, 100);
  }

  const expandModalFrom10 = () => {
    setInfoModalSizeStyle(modalStyle_90);
    setInfoModalSize(90);
    setFooterStyle(flexFooterFront);
  }

  const colapseModalFrom90 = () => {
    setInfoModalSizeStyle(modalStyle_10);
    setTimeout(() => setInfoModalSize(10), 200);
    setFooterStyle(flexFooterHidden);
  }

  const handleLayerSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const mymap = mapInstanceRef.current;
    const targetLayer = layerData.get(event.target.id) as L.LayerGroup | undefined;
    if (!mymap || !targetLayer) return;

    // Keep the modal switch UI in sync with Leaflet.
    setLayerStates((prev) => ({ ...prev, [event.target.id]: event.target.checked }));
  };

  const handleRotate = (() => {
    const headingA = 0;
    const headingB = -90;

    const mymap = (mapInstanceRef.current as any);
    const rotateControl = mymap.rotateControl as RotateControl;

    if (rotateControl && rotateControl._arrow) {
      const oldArrow = rotateControl._arrow;

      // Clone the arrow to strip ALL hidden plugin listeners
      const newArrow = oldArrow.cloneNode(true) as HTMLElement;
      if (oldArrow.parentNode) {
        oldArrow.parentNode.replaceChild(newArrow, oldArrow);
      }
      // Update the reference in the control object
      rotateControl._arrow = newArrow;

      // Block drag rotation
      L.DomEvent.on(newArrow, 'mousedown touchstart', (e) => {
        L.DomEvent.stopPropagation(e); 
      });

      // Toggle listener
      L.DomEvent.on(newArrow, 'click', (e) => {
        L.DomEvent.stop(e);

        if (stateRef.current !== "view") return;

        const current = mymap.getBearing();
        const next = Math.abs(current - headingA) < 0.1 ? headingB : headingA;

        // Swap road label layers so they are oriented correctly
        if (next == 0) {
          mymap.removeLayer(layerData.get('labelsNorthLeft'));
          mymap.addLayer(layerData.get('labelsNorthUp'));
        } else {
          mymap.removeLayer(layerData.get('labelsNorthUp'));
          mymap.addLayer(layerData.get('labelsNorthLeft'));
        }
        
        mymap.setBearing(next);
        setMapBearing(next);
      });


      // Override _update to prevent the button from being hidden at 0 degrees
      rotateControl._update = function (this: RotateControl) {
        const bearing = this._map.getBearing();
        const container = this.getContainer();

        if (container) {
          container.style.display = 'block'; // Force visibility every update
        }

        // The original plugin logic often sets display: none here if bearing is 0.
        // We override it to only update the visual rotation of the arrow.
        if (this._arrow) {
          this._arrow.style.transform = `rotate(${bearing}deg)`;
        }
      };
      
      // Initial sync
      rotateControl._update();
    }
  });

  function getShallowDiff<T extends object>(obj1: T, obj2: T): Partial<T> {
    const diff: Partial<T> = {};
    
    // Get all unique keys from both objects
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]) as Set<keyof T>;
  
    allKeys.forEach(key => {
      if (obj1[key] !== obj2[key]) {
        diff[key] = obj2[key];
      }
    });
  
    return diff;
  }

  const handleSaveLocationChanges = async () => {
    console.log('Saving form data:', editLocationFormData);
    const foundLocation = state?.network?.collections?.locations?.find(loc => loc.id === selectedLocationId);
    // TODO This is used twice, onces for the diff and once when we create the form, this should be in a function
    const locationFormDiff = getShallowDiff({
      name: foundLocation?.name || '',
      lat: foundLocation?.lat || 0,
      long: foundLocation?.long || 0,
      owner: foundLocation?.owner || '',
      description: foundLocation?.description || '',
      venuetype: foundLocation?.venuetype || '',
      hours: foundLocation?.hours || {},
      tooltip: foundLocation?.tooltip || { name: '', lat: 0, long: 0, rotation: 0,}
    }, editLocationFormData);
    console.log('Reduced form data:', locationFormDiff);
    if (stateRef.current == 'edit') {
      updateLocation(selectedLocationId, locationFormDiff);
      // Give it a second for the location to be updated
      setTimeout(() => {
        fetchLocationById(selectedLocationId);
      }, 1000);
    } else {
      if (editLocationFormData.owner.startsWith('C')) {
        createFactionLocation(editLocationFormData.owner, locationFormDiff);
      } else {
        createLocation(locationFormDiff);
      }
      // Give it a second for the location to be created
      setTimeout(() => {
        fetchUnverifiedLocations();
      }, 1000);
    }

    stopEditMode();
  };

  // A generic helper that doesn't care about the event object
  const updateField = (name: string, value: any) => {
    setEditLocationFormData(prev => {
      // Check if the name contains a dot (e.g., "tooltip.lat")
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as object),
            [child]: value
          }
        };
      }
      // Default flat update
      return { ...prev, [name]: value };
    });
  };
  
  // Simple handler for TextFields
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(e.target.name, e.target.value);
  };
  
  // Simple handler for Selects
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    updateField(e.target.name, e.target.value);
  };
  
  // Add a new empty shift for a specific day
  const addShift = (day: string) => {
    const newShift = { day, open: '09:00', close: '17:00' };
    updateField('hours', [...(editLocationFormData.hours || []), newShift]);
  };

  // Remove a specific shift by its index
  const removeShift = (index: number) => {
    const updatedHours = (editLocationFormData.hours || []).filter((_: any, i: number) => i !== index);
    updateField('hours', updatedHours);
  };

  // Handler to update hours
  const handleHourChange = (index: number, field: 'open' | 'close', newValue: any) => {
    const updatedHours = [...(editLocationFormData.hours || [])] as any[];
    if (!updatedHours[index]) return;
  
    let timeString = newValue ? newValue.format('HH:mm') : null;
  
    // Special Case: If they pick midnight for CLOSE, we store 24:00
    // Also check if they picked a time that matches the start of the day
    if (field === 'close' && (timeString === '00:00' || (newValue && newValue.hour() === 0 && newValue.minute() === 0))) {
      timeString = '24:00';
    }
  
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: timeString
    };
  
    updateField('hours', updatedHours);
  };

  // Map initialization
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const mymap = L.map(mapRef.current, options);
      
      mapInstanceRef.current = mymap;
      mymap.createPane('roadlabels');
      const pane = mymap.getPane('roadlabels');
      if (pane) {
        pane.style.zIndex = '450';
        pane.style.pointerEvents = 'none'; 
      }

      custom({maxZoom: 22,}).addTo(mymap);

      handleRotate();

      // These coords have to be hand dialed to get the svg to overlay just right.
      const imageBounds = L.latLngBounds([[35.085470, -117.825445], [35.078589, -117.819928]]);
      L.imageOverlay(LRG_SVG_MAP_FILE, imageBounds, {
        opacity: 1,
      }).addTo(mymap);

      // useful for aligning the map svg
      // L.rectangle(imageBounds).addTo(mymap);

      L.control.scale({
        position: 'topright',
        imperial: false
      }).addTo(mymap);

      // Set up structural layers (location markers + zoom-toggled megablock/megamall).
      initStaticLayerGroups(mymap, layerData);

      // Fetch cookie that stores layer toggle state
      const saved = getSettingsCookie().mapLayers;
      if (saved) setLayerStates(saved);

      // Listen to zoom level changes to toggle megablock and megamall layers.
      wireZoomLayerVisibility(mymap, layerData);

      // == Set up listeners/hooks ==
      mymap.on('locationfound', (e) => {
        console.log('location accuracy: ' + e.accuracy);
        setUserLocationKnown(true);
        setLastKnownLocation(e.latlng);
        setLastKnownLocationAccuracy(e.accuracy);
        setLastKnownLocationHeading(e.heading);
        let circle = myMapObjects.get('myLocationCircle');
        if (!circle) {
          const color = '#42c6ff'
          const circleSvg = {
            mapIconUrl: `
              <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                <circle fill="${color}" stroke-width="3px" stroke="#FFFFFF" cx="9" cy="9" r="7" fill-opacity="70%"/>
              </svg>`,
            mapIconColor: color
          };
          const circleIcon = L.divIcon({
            className: 'road-label-icon', // Use a custom class to remove default marker styles
            html: L.Util.template(circleSvg.mapIconUrl, circleSvg),
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });
          const circle = L.marker(e.latlng, 
            {
              icon: circleIcon,
              interactive: false,
              pane: 'tooltipPane'
            }
          );
          myMapObjects.set('myLocationCircle', circle);
          circle.addTo(mymap);
        }
        circle.setLatLng(e.latlng);
      });

      // Start location fetching
      if (typeof window !== 'undefined' && window?.isSecureContext) {
        mymap.locate({
          watch: true, // starts continuous watching of location changes
          maximumAge: 15000 // Return cached location if less than this amount of milliseconds passed since last geolocation response
        });
      }
    }

    // Cleanup function
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]);

  // More violation access fixes
  useEffect(() => {
    stateRef.current = infoModalState;
    if (infoModalState != 'view') {
      // Force focus out of the map/markers before the modal renders
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [infoModalState]);

  useEffect(() => {
    fetchUnverifiedLocations();
    fetchLocationPins('all');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnverifiedLocations();
      fetchLocationPins('all');
      
      if (selectedLocationId) {
        fetchLocationById(selectedLocationId);
      }
    }, 60 * 1000);
  
    return () => clearInterval(interval); // Cleanup on unmount or ID change
  }, [selectedLocationId, fetchUnverifiedLocations, fetchLocationPins, fetchLocationById]); 

  // Lots of things to do when the locations update
  useEffect(() => {
    const locations = state?.network?.collections?.locations;
    if (!locations?.length) return;

    const mymap = mapInstanceRef.current;
    const locationMarkersLayer = layerData.get('locationMarkersLayer') as L.LayerGroup | undefined;
    if (!mymap || !locationMarkersLayer) return;

    // If we passed in a location ID, load details for it
    if (!selectedLocationId && props?.params?.id && props?.params?.id.startsWith('L')) {
      setSelectedLocationId(props?.params?.id);
      fetchLocationById(props?.params?.id);
      const location = state?.network?.collections?.locations?.find(loc => loc.id === selectedLocationId);
      // TODO This doesn't actually work because we don't know the owner yet
      if (location?.owner.startsWith('C')) {
        fetchFactionDetails(location.owner);
      }
      setLinkedLocationId(props?.params?.id);
    }

    // Draw all our markers and labels
    renderLocationsToLeafletLayers({
      layerData,
      locations,
      linkedLocationId,
      userId: state?.network?.selected?.account!,
      onMarkerClick: (leafletMarker) => {
        if (stateRef.current != 'view') {
          // Fix access violations due to focus
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          return;
        }
        setSelectedLocationId((leafletMarker as any).id);
        fetchLocationById((leafletMarker as any).id);
        const location = state?.network?.collections?.locations?.find(loc => loc.id === (leafletMarker as any).id);
        if (location.owner.startsWith('C')) {
          fetchFactionDetails(location.owner);
        }
        mymap.panTo(leafletMarker.getLatLng());
        openInfoModal();
      },
      infoModalState,
      selectedLocationId,
      updateField,
    });

    // Hide names when we zoom way out
    handleZoomNameToggle(mymap, layerData, selectedLocationId);

    // Store all our markers
    myMapObjects.set('allMarkers', []);
    layerData.forEach((layer, layerName) => {
      layer.eachLayer((layerPart) => {
        if (layerPart instanceof L.Marker) {
          myMapObjects.get('allMarkers').push(layerPart);
        }
      });
    });
  }, [state?.network?.collections?.locations]);

  // Things to do when a location is selected, should also update when locations data updates
  useEffect(() => {
    let locations = state?.network?.collections?.locations || [];
    if (locations.length > 0 && selectedLocationId && !!locations.find(loc => loc.id === selectedLocationId)) {
      const foundLocation = locations.find(loc => loc.id === selectedLocationId);
      // Set the neosite data if we have it
      if ((state?.network?.entity as any).id === foundLocation.owner) {
        foundLocation.neosite = (state?.network?.entity as any).neosite;
      }
      setSelectedLocation(foundLocation);
      if (stateRef.current === 'view') {
        setEditLocationFormData({
          name: foundLocation.name || '',
          lat: foundLocation.lat || 0,          // Hidden from input, but kept in state
          long: foundLocation.long || 0,        // Hidden from input, but kept in state
          owner: foundLocation.owner || '',
          description: foundLocation.description || '',
          venuetype: foundLocation.venuetype || '',
          hours: foundLocation.hours || {},
          tooltip: foundLocation.tooltip || {
            name: foundLocation?.name || '', 
            lat: foundLocation?.lat || 0,
            long: foundLocation?.long || 0,
            rotation: foundLocation?.rotation || 0,
          }
        })
      }
    }

    // This is where we flyTo and open a location that was linked in
    if (props?.params?.id && props?.params?.id.startsWith('L') && !markerFromLinkShown) {
      const mymap = mapInstanceRef.current;
      if (mymap) {
        let allMarkers: L.Marker[] = myMapObjects?.get('allMarkers') || [];
        let leafletMarker = allMarkers.find((marker: any) => marker.id === props?.params?.id);
        if (leafletMarker && !mymap.hasLayer(leafletMarker)) {
          leafletMarker.addTo(mymap);
        }
        if (leafletMarker) {
          mymap.flyTo(leafletMarker.getLatLng(), 21);
          openInfoModal();
          setMarkerFromLinkShown(true);
        }
      }
    }
  }, [selectedLocationId, state?.network?.collections?.locations, infoModalState]);

  // Populate searchBarOptions when layers are toggled or locations update
  // Hide and show layers based on new layer state
  useEffect(() => {
    // Hide/show layers on map
    const mymap = mapInstanceRef.current;
    if (!mymap) return;
    Object.entries(layerStates).forEach(([layer, isActive]) => {
      const targetLayer = (layerData.get(layer) as L.LayerGroup);
      if (isActive && !mymap.hasLayer(targetLayer)) {
        mymap.addLayer(targetLayer);
      }
      if (!isActive && mymap.hasLayer(targetLayer)) {
        mymap.removeLayer(targetLayer);
      }
    });

    // We may have shown layers, hide names when we zoom way out
    handleZoomNameToggle(mymap, layerData, selectedLocationId);

    // Update searchBarOptions
    const locations = state?.network?.collections?.locations;
    const userId = state?.network?.selected?.account;
    if (locations) {
      setSearchBarOptions(
        locations
          .filter((loc) => (
            (
              // Show all verified locations
              loc.verified
              // Show unverified locations if that layer is on
              || (layerStates.unverified && !(loc.owner === userId || loc.creator === userId))
              // Show owned locations if that layer is on
              || (layerStates.mylocations && (loc.owner === userId || loc.creator === userId))
            )
            && loc?.venuetype?.toLowerCase() !== "dev")) // Hide all the dev markers from search
          .sort((a, b) => -b.name.localeCompare(a.name))
          .sort((a, b) => -b.venuetype.localeCompare(a.venuetype)) || []
      );
    }
    setSettingsCookie({mapLayers: layerStates});
  }, [layerStates, state?.network?.collections?.locations]);

  useEffect(() => {
    const pins = state?.network?.collections?.locationPins;
    if (!pins?.length) return;

    const mymap = mapInstanceRef.current;
    const locationMarkersLayer = layerData.get('pinsLayer') as L.LayerGroup | undefined;
    if (!mymap || !locationMarkersLayer) return;

    renderLocationPinsToLeafletLayers({
      layerData,
      pins,
      onMarkerClick: (leafletMarker: L.Marker) => {
        mymap.panTo(leafletMarker.getLatLng());
      },
    });
  }, [state?.network?.collections?.locationPins]);

  return (
    <Container disableGutters style={{
      height: 'calc(100% - 64px)',
      minWidth: '100vw',
      background: 'rgba(0,0,0,0.55)',
      position: 'absolute',
      top: '64px',
      overflow: 'hidden'
    }}>
      <div ref={mapRef} id='map' style={mapStyle}/>
      <Autocomplete
        style={{position: 'absolute', top: '12px', left: '70px', zIndex: '1100', backgroundColor: '#120458', border: '1px solid #ff00ff', borderRadius: '5px', width:'calc(100% - 180px'}}
        options={searchBarOptions}
        groupBy={(option: any) => option.venuetype}
        getOptionLabel={(option: any) => option.name}
        renderInput={(params) => <TextField {...params} label='Search' />}
        onChange={(event, location, reason) => {
          if (reason === 'selectOption' && location && location.lat && location.long) {
            const map = mapInstanceRef.current;
            if (map) {
              map.flyTo([location.lat, location.long], 21); 
            }
          }
        }}
      />
      <Modal
        open={showInfoModal}
        onClose={closeInfoModal}
        hideBackdrop={infoModalState != 'view'}
        disableEnforceFocus={infoModalState != 'view'}
        disableScrollLock={infoModalState != 'view'}
        sx={{
          '& .MuiModal-backdrop': {
            backgroundColor: 'rgba(93, 28, 194, 0.2)', // Change the color and opacity
          },
          pointerEvents: (infoModalState != 'view') ? 'none' : 'auto',
        }}
      >
        <Box sx={infoModalSizeStyle}
          className={styles.submenuPane}
          data-augmented-ui='tl-clip tr-clip-y br-2-clip-x both'>
          <MapInfoModal 
            key={selectedLocationId}
            location={selectedLocation}
            size={infoModalSize}
            onExpand={expandModalFrom10}
            onCollapse={colapseModalFrom90}
            isAdmin={state?.network?.selected?.account === NEONAV_MAINT}
            mode={infoModalState} // 'view', 'edit', etc.
            formData={editLocationFormData}
            handlers={{
              setTextFormData: handleTextChange,
              setSelectFormData: handleSelectChange,
              handleHourChange: handleHourChange,
              addShift: addShift,
              removeShift: removeShift,
            }}
          />
        </Box>
      </Modal>
      <MapLayersModal
        open={showLayerModal}
        onClose={closeLayerModal}
        layerModalSizeStyle={layerModalSizeStyle}
        layerStates={layerStates}
        onToggle={handleLayerSwitch}
        showDev={state?.network?.selected?.account === NEONAV_MAINT}
      />
      {/* TODO Move Footer into dedicated modual */}
      {/* Footer for editing locations */}
      <Box sx={footerStyle} hidden={!showInfoModal || infoModalState === 'view'}> 
        <FooterNav
          firstHexProps={{
            icon: infoModalState === "create" ? <></> : <DeleteForever />,
            tooltipText: infoModalState === "create" ? '' : 'Delete Location',
            dialog: 'Delete Location? Ths cannot be undone!',
            disabled: (selectedLocation.verified && state?.network?.selected?.account != NEONAV_MAINT) || infoModalState === "create" ,
            handleAction: () => {
              deleteLocation(selectedLocationId);
              stopEditMode();
              closeInfoModal();
              setTimeout(() => {
                fetchUnverifiedLocations(); // Pull latest location data after delete
              }, 1000);
            }
          }}
          secondHexProps={{
            icon: <CancelIcon />,
            tooltipText: 'Discard Changes',
            handleAction: stopEditMode,
          }}
          bigHexProps={{
            disabled: true,
          }}
          thirdHexProps={{
            icon: <SaveIcon />,
            tooltipText: 'Save Changes',
            handleAction: handleSaveLocationChanges,
          }}
          fourthHexProps={{
            disabled: true,
          }}
        />
        <ReviewDialog
          id={selectedLocationId}
          open={reviewDialogOpen}
          handleClose={() => {
            setTimeout(() => {
              fetchLocationById(selectedLocationId); // Pull latest location data after posting review
            }, 1000);
            setReviewDialogOpen(false);
          }}
        />
      </Box>
      {/* Footer for viewing locations */}
      <Box sx={footerStyle} hidden={!showInfoModal || infoModalState != 'view'}>
        <FooterNav
          firstHexProps={{
            icon: <ShareLocationIcon/>,
            disabled: !window.isSecureContext, // Can't affect clipboard on unsecure connection
            tooltipText: 'Share This Location',
            handleAction: () => {
              if (window.isSecureContext) {
                navigator.clipboard.writeText('@' + selectedLocationId);
                //TODO need to fix: alert pops under modal
                setAlert('success', 'Copied location to clipboard!');
              }
            },
          }}
          secondHexProps={{
            icon: <RateReviewIcon/>,
            tooltipText: 'Add A Review',
            handleAction: () => setReviewDialogOpen(true),
          }}
          bigHexProps={{
            icon: <EditLocationAltIcon/>,
            tooltipText: Math.abs(mapBearing) > 0.1 ? 'Unavailable When Rotated' : 'Edit Location',
            disabled: 
              !(state?.network?.selected?.account === NEONAV_MAINT ||           // User is admin
                state?.network?.selected?.account === selectedLocation.owner || // User is owner
                (state?.network?.selected?.account === selectedLocation.creator && // User is creator
                 !selectedLocation.verified)
              ) ||
              Math.abs(mapBearing) > 0.1   // Disable edit when rotated
            ,
            handleAction: () => {
              fetchAllFactions();
              startEditMode();
            },
          }}
          thirdHexProps={{
            icon: <EventIcon/>,
            link: '/events/' + selectedLocationId,
            tooltipText: 'Events',
          }}
          fourthHexProps={
            // Set up button only if we are admin and the location isn't verified
            state?.network?.selected?.account === NEONAV_MAINT && !selectedLocation.verified ? {
              icon: <CheckCircleOutlineIcon />,
              dialog: 'Verify Location? Ths cannot be undone.',
              handleAction: () => {
                verifyLocation(selectedLocationId);
              },
              tooltipText: 'Verify Location',
            } : {
              disabled: true,
            }
          }
        />
      </Box>
      {/* Footer for default map view */}
      <Box sx={footerStyle} hidden={showInfoModal}>
        <FooterNav
          firstHexProps={{
            icon: <PersonPinCircleIcon/>,
            tooltipText: userLocationKnown ? 'Share Your Location' : 'Location Unavailable To Share',
            dialog: lastKnownLocationAccuracy > ACCURACY_LIMIT ? 
              'Broadcast your position? Your coordinates will be shared with your factions and mutual friends. Your location data currently has low accuracy.' :
              'Broadcast your position? Your coordinates will be shared with your factions and mutual friends.',
            handleAction: () => {
              if (mapRef.current && userLocationKnown) {
                addLocationPin(lastKnownLocation.lat.toString(), lastKnownLocation.lng.toString());
                setTimeout(() => { // Grab latest pins since we just updated
                  fetchLocationPins('all');
                }, 1000);
              }
            },
            disabled: !userLocationKnown,
          }}
          secondHexProps={{
            icon: <AddLocationIcon/>,
            tooltipText: Math.abs(mapBearing) > 0.1 ? 'Unavailable When Rotated' : 'Add A Location',
            disabled: Math.abs(mapBearing) > 0.1,   // Disable edit when rotated
            handleAction: () => {
              setSelectedLocationId('');
              setSelectedLocation(EMPTY_LOCATION);
              fetchAllFactions();
              startCreateMode();
            },
          }}
          bigHexProps={{
            icon: <FilterListIcon/>,
            tooltipText: 'Layers',
            handleAction: openLayerModal,
          }}
          thirdHexProps={{
            icon: userLocationKnown ? <MyLocationIcon/> : <LocationSearchingIcon/>,
            tooltipText: userLocationKnown ? 'Show Your Location' : 'Location Unavailable',
            handleAction: () => {
              if (mapInstanceRef.current) {
                let mymap = mapInstanceRef.current;
                if (userLocationKnown) {
                  mymap.flyTo(lastKnownLocation, 21);
                } else {
                  // If the user clicks the location button but we don't know where they are, try kicking off locate again 
                  mymap.locate({watch: true, maximumAge: 15000});
                }
              }
            },
            disabled: typeof window === 'undefined' || !window?.isSecureContext,
          }}
          fourthHexProps={{
            icon: <LocationDisabledIcon/>,
            tooltipText: 'Delete Your Shared Locations',
            dialog: 'Delete all location history? Your previously shared positions will be deleted for everyone. This cannot be undone.',
            handleAction: () => {
              if (mapRef.current) {
                deleteLocationPins();
                setTimeout(() =>{  // Grab latest pins since we just updated
                  fetchLocationPins('all');
                }, 1000)
              }
            },
          }}
        />
      </Box>
    </Container>
  )
}
