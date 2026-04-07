import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import CastleIcon from "@mui/icons-material/Castle";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PersonIcon from '@mui/icons-material/Person';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

import { Context as NnContext } from "@/components/context/nnContext";
import { NnProviderValues } from "@/components/context/nnTypes";
import ItemReview from "@/components/itemReview";
import SimpleScrollContainer from "@/components/simpleScrollContainer";

const modalTitleStyle = {
  fontFamily: 'Jura',
  fontSize: '18px',
  letterSpacing: '0.05rem',
  padding: '10px 16px 0',
  filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
}

const modalBodyStyle = {
  fontFamily: 'Jura',
  fontSize: '14px',
  padding: '0px 16px 0',
  filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
}

const VENUE_TYPES = [
  "Arcade", "Bar", "Food", "Restaurant", "Dining", "Entertainment", "Music", "Porto",
];

const handleMouseUpDownIgnore = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};


interface MapInfoModalProps {
  location: any;
  size: number;
  onExpand: () => void;
  onCollapse: () => void;
  isAdmin: boolean;
  mode?: 'view' | 'edit' | 'create'; // Add this for your future features
  formData: any;
  handlers: any;
}

export const MapInfoModal = ({ location, size, onExpand, onCollapse, isAdmin, mode = 'view', formData, handlers }: MapInfoModalProps) => {
  if (mode != "view") {
    return (
      <EditLocationForm 
        location={location} 
        formData={formData}
        isAdmin={isAdmin}
        {...handlers}
      />
    );
  }
  
  return (
    <>
      {size === 10 && <SmallView location={location} onExpand={onExpand} />}
      {size === 90 && <FullView location={location} onCollapse={onCollapse} />}
    </>
  );
};

// Break these into smaller functions in the same file to keep it clean
const SmallView = ({ location, onExpand }: any) => (
  <Box>
    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
      <Typography sx={modalTitleStyle} onClick={onExpand}>{location.name}</Typography>
      <IconButton onClick={onExpand} onMouseDown={handleMouseUpDownIgnore} onMouseUp={handleMouseUpDownIgnore}>
        <ExpandLessIcon/>
      </IconButton>
    </Stack>
    <Typography sx={modalBodyStyle} component="p">
      {location.venuetype}
    </Typography>
    <Typography sx={modalBodyStyle} component="p">{location.openState} ⋅ {location.nextTimeMsg}</Typography>
  </Box>
);

const FullView = ({ location, onCollapse }: any) =>  {
  const { deleteLocationReview = (id:string, reviewid:string) => {}, }: NnProviderValues = React.useContext(NnContext);
  
  return (
    <Box>
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
        <Typography sx={modalTitleStyle} onClick={onCollapse}>
          {location.name}
        </Typography>
        <IconButton onClick={onCollapse} onMouseDown={handleMouseUpDownIgnore} onMouseUp={handleMouseUpDownIgnore}>
          <ExpandMoreIcon/>
        </IconButton>
      </Stack>
      <Stack direction="column"
        spacing={0.5}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography sx={modalBodyStyle} component="p">
          [{location.id}]
        </Typography>
        <Typography sx={modalBodyStyle} component="p">
          {location.rating}
        </Typography>
        <Typography sx={modalBodyStyle} component="p">
          {location.venuetype}
        </Typography>
        <Typography sx={modalBodyStyle} component="p">{location.openState} ⋅ {location.nextTimeMsg}</Typography>
        <Divider color="secondary" flexItem/>
        <Typography sx={modalBodyStyle} component="p">
          {(location.ownerisfaction ?
            <CastleIcon fontSize="inherit"/> : <PersonIcon />)}
          &nbsp;⋅&nbsp;
          <Link
            href={`${location.ownerlink}`}>
            {location.ownername}
          </Link>
        </Typography>
        <Divider color="secondary" flexItem/>
        <Typography sx={modalBodyStyle} component="p"><QueryBuilderIcon fontSize="inherit"/>&nbsp;{location.openState}</Typography>
        <TableContainer component={Paper} style={{padding: '1vh'}}>
          <Table aria-label="simple table">
            <TableBody>
              {location.prettyhours.map((row: any) => (
                <TableRow
                  key={row.day}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell component="th" scope="row" sx={modalBodyStyle}>
                    {row.day}
                  </TableCell>
                  <TableCell align="right" sx={modalBodyStyle}>
                    {row.hours.map((hourBlock: string, index: number) => (
                      <span key={index}>
                        {hourBlock}
                        {index < row.hours.length - 1 && <br/>}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider color="secondary" flexItem/>
        <Typography sx={modalBodyStyle} component="p">
          <LocationCityIcon fontSize="inherit"/>
          &nbsp;⋅&nbsp;
          <Link href={`/sites/${location.neocities}`}>
            {!!location.neocities && location.ownername}
          </Link>
        </Typography>
        {(location.description && <Divider color="secondary" flexItem/>)}
        <Typography sx={modalBodyStyle} component="p">
          {location.description}
        </Typography>
        <Divider color="secondary" flexItem/>
        <Typography sx={modalBodyStyle} component="p">
          {location.rating}
        </Typography>
      </Stack>
      <SimpleScrollContainer>
        <Box sx={{minWidth: "100%", height: "30vh"}}>
          <Stack
            spacing={0}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <div key="spacer"><Box sx={{height: "110px"}}/></div>
            {!location.reviews || location.reviews.length === 0 && (
              <Typography sx={modalBodyStyle} component="p">Be the first to leave a review!</Typography>
            )}
            {location.reviews?.length >= 1 &&
              location.reviews.filter((reviewItem: any) => !!reviewItem.review).map((reviewItem: any) => {
                const {_id, reviewer, ts, reviewerName, rating, review} = reviewItem;
                return (
                  <div key={`${ts}-container`}>
                    <ItemReview
                      id={location.id}
                      reviewid={_id}
                      reviewerName={reviewerName}
                      reviewer={reviewer}
                      ts={ts}
                      review={review}
                      rating={rating}
                      isAdmin={true}
                      onDelete={deleteLocationReview}
                    />
                  </div>
                );
              })}
          </Stack>
        </Box>
      </SimpleScrollContainer>
    </Box>
  );
}

const EditLocationForm = ({ location, formData, isAdmin, ...handlers}: any) => {
  const { setTextFormData, setSelectFormData, handleHourChange, addShift, removeShift } = handlers;
  const { state, }: NnProviderValues = React.useContext(NnContext);

  const isCreateMode = !location?.id;

  const isVerified = location.verified === true;
  const canEditCore = isAdmin || !isVerified || isCreateMode;

  // Prepare Owner Options
  const ownerOptions = React.useMemo(() => {
    const options = new Map();

    const currentUserId = state?.user?.profile?.auth?.userid;

    // Default: Assign to Current User if creating
    if (currentUserId) {
      options.set(currentUserId, `${state?.user?.profile?.meta?.username || 'You'} (You)`);
    }

    // 2. Existing Owner (if different)
    if (!isCreateMode && location?.owner && location.owner !== currentUserId) {
      options.set(location.owner, `${location.ownername || location.owner} (Current)`);
    }

    // 3. Factions from Context
    (state?.network?.collections?.factions ?? []).forEach((f: any) => {
      options.set(f.id, `[${f.id}] ${f.name} [Faction]`);
    });

    return Array.from(options.entries());
  }, [state?.network?.collections?.factions]);

  // Admin only venue types
  if (isAdmin && !VENUE_TYPES.includes("Megamall")) {
    VENUE_TYPES.push("Megamall", "Megablock", "Dev");
  }

  return (
    <SimpleScrollContainer>
      <Box sx={{ p: 2, maxHeight: '80vh', width:'100%', overflowY: 'auto', pointerEvents: 'auto', }}>
        <Typography sx={modalTitleStyle}>
          {isCreateMode ? "CREATE NEW LOCATION" : `MODIFYING: ${location.id}`}
        </Typography>
        
        <Stack spacing={2.5} sx={{ mt: 2 }}>
          {/* SECTION 1: CORE FIELDS (Locked if verified & not admin) */}
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)' }}>Core Identity</Typography>
          
          <TextField 
            label="Location Name" name="name" fullWidth 
            value={formData.name} onChange={setTextFormData} 
            disabled={!canEditCore} variant="filled"
            helperText={!canEditCore ? "Verified: Locked" : ""}
          />

          {/* Venue Type Dropdown */}
          <FormControl fullWidth variant="filled" disabled={!canEditCore}>
            <InputLabel>Venue Type</InputLabel>
            <Select
              name="venuetype"
              value={formData.venuetype}
              onChange={setSelectFormData}
              MenuProps={{
                MenuListProps: {
                  sx: { pb: '90px' }
                }
              }}
            >
              {VENUE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Owner Dropdown */}
          <FormControl fullWidth variant="filled" disabled={!canEditCore}>
            <InputLabel>Primary Owner</InputLabel>
            <Select
              name="owner"
              value={formData.owner}
              onChange={setSelectFormData}
              MenuProps={{
                MenuListProps: {
                  sx: { pb: '90px' }
                }
              }}
            >
              {ownerOptions.map(([id, name]) => (
                <MenuItem key={id} value={id}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ borderColor: 'secondary.main' }} />

          {/* SECTION 2: METADATA (Always editable by Owner or Admin) */}
          {( !isCreateMode && 
            <>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)' }}>Business Hours</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>

                {/* Loop through days of the week to keep things organized */}
                {['wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'monday', 'tuesday', ].map((dayName) => {
                  // Filter the hours array for just this day
                  const dayShifts = (formData.hours || []).filter((h: any) => h.day === dayName);

                  return (
                    <Box key={dayName} sx={{ mb: 2, p: 1, borderLeft: '2px solid', borderColor: 'secondary.main', pl: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>{dayName}</Typography>
                        <IconButton size="small" onClick={() => addShift(dayName)} color="primary">
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      {dayShifts.map((shift: any, localIndex: number) => {
                        const globalIndex = formData.hours.indexOf(shift);

                        // Helper to parse value: if '24:00', treat as end of day for the picker UI
                        const parseTime = (val: string | null) => {
                          if (val === '24:00') return dayjs().startOf('day').add(1, 'day');
                          return val ? dayjs(val, 'HH:mm') : null;
                        };

                        return (
                          <Stack key={globalIndex} direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
                            <MobileTimePicker
                              label="Open"
                              ampm={false}
                              inputFormat="HH:mm"
                              value={parseTime(shift.open)}
                              onChange={(val) => handleHourChange(globalIndex, 'open', val)}
                              renderInput={(params) => <TextField {...params} size="small" />}
                            />

                            <Typography sx={{ opacity: 0.5 }}>—</Typography>

                            <MobileTimePicker
                              label="Close"
                              ampm={false}
                              inputFormat="HH:mm"
                              value={parseTime(shift.close)}
                              onChange={(val) => handleHourChange(globalIndex, 'close', val)}
                              renderInput={(params) => {
                                // INTERCEPT DISPLAY: If value is midnight of next day, show 24:00
                                const displayValue = shift.close === '24:00' ? '24:00' : params.inputProps?.value;
                                return <TextField {...params} size="small" inputProps={{ ...params.inputProps, value: displayValue }} />;
                              }}
                            />
                            <IconButton size="small" onClick={() => removeShift(globalIndex)} color="primary">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        );
                      })}
                      {dayShifts.length === 0 && (
                        <Typography variant="caption" sx={{ opacity: 0.4 }}>Closed / No hours set</Typography>
                      )}
                    </Box>
                  );
                })}
              </LocalizationProvider>
            </>
          )}
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)' }}>Display Data</Typography>
          <TextField 
            label="Description" name="description" fullWidth multiline rows={3}
            value={formData.description} onChange={setTextFormData} 
          />

          {/* SECTION 3: ADMIN ONLY (Per your backend authorizedAdmin check) */}
          {isAdmin && (
            <>
              <Divider sx={{ borderColor: 'primary.main' }} />
              <Typography variant="overline" sx={{ color: 'primary.main' }}>Admin Protocols</Typography>
              <TextField 
                label="Tooltip" name="tooltip" fullWidth 
                value={formData.tooltip} onChange={setTextFormData} 
              />
            </>
          )}

          {/* COORDINATE READ-ONLY (Visual confirmation only) */}
          <Stack direction="row" spacing={2}>
            { isCreateMode ? (
              <>
                <Typography variant="caption">LAT: {formData.lat}</Typography>
                <Typography variant="caption">LONG: {formData.long}</Typography>
              </>
            ) : (
              <>
                <Typography variant="caption">(OLD) LAT: {location.lat}</Typography>
                <Typography variant="caption">LONG: {location.long}</Typography>
                <Typography variant="caption"> | </Typography>
                <Typography variant="caption">(NEW) LAT: {formData.lat}</Typography>
                <Typography variant="caption">Long: {formData.long}</Typography>
              </>
            )}
          </Stack>
          <div key="spacer"><Box sx={{height: "50px"}}/></div>
        </Stack>
      </Box>
    </SimpleScrollContainer>
  );
};
