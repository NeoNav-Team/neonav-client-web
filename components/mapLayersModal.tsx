'use client';

import React from "react";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Modal,
  Stack,
  Switch,
} from "@mui/material";
import styles from "@/styles/generic.module.css";

export type MapLayersModalLayerId = "eventLayer" | "devLayer" | "myLocationsLayer" | "unverifiedLayer";

export interface MapLayersModalProps {
  open: boolean;
  onClose: () => void;
  layerModalSizeStyle: any;
  layerStates: Record<string, boolean>;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MapLayersModal(props: MapLayersModalProps): JSX.Element {
  const { open, onClose, layerModalSizeStyle, layerStates, onToggle } = props;

  const layerIds: MapLayersModalLayerId[] = ["eventLayer", "devLayer", "myLocationsLayer", "unverifiedLayer"];
  const labels: Record<MapLayersModalLayerId, string> = {
    eventLayer: "Event Locations",
    devLayer: "Dev Layer",
    myLocationsLayer: "My Locations",
    unverifiedLayer: "Unverified Locations",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiModal-backdrop": {
          backgroundColor: "rgba(93, 28, 194, 0.2)", // Match existing modal styling
        },
      }}
    >
      <Box
        sx={layerModalSizeStyle}
        className={styles.submenuPane}
        data-augmented-ui="tl-clip tr-clip-y br-2-clip-x both"
      >
        <Stack direction="column" spacing={1} justifyContent="center" alignItems="center">
          <FormGroup>
            {layerIds.map((layerId) => {
              const checked = layerStates?.[layerId] ?? false;
              return (
                <FormControlLabel
                  key={layerId}
                  control={
                    <Switch
                      color="warning"
                      id={layerId}
                      checked={checked}
                      onChange={onToggle}
                    />
                  }
                  label={labels[layerId]}
                />
              );
            })}
          </FormGroup>
        </Stack>
      </Box>
    </Modal>
  );
}

