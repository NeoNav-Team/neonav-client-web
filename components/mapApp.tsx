'use client';

import React from "react";
import { MapInteractionCSS } from 'react-map-interaction';
import { Container } from '@mui/material';

interface PageContainerProps {}

const MAP_FILE = '/neomap_mobile.png';

export default function MapApp(props:PageContainerProps):JSX.Element {

  return (
    <Container disableGutters style={{
      height: 'calc(100% - 64px)',
      minWidth: '100vw',
      background:'rgba(0,0,0,0.55)',
      position: 'absolute',
      top: '64px',
      overflow: 'hidden'
    }}>
      <MapInteractionCSS 
        showControls
        defaultValue={{scale: .15,translation: { x: -300, y: -50}}}
        translationBounds={{
          yMin: -10000, yMax: 0, xMin: -150000, xMax: 0
        }}
      >
        <img src={MAP_FILE} alt='Neotropolis Map' />
      </MapInteractionCSS>
    </Container>
  )
}