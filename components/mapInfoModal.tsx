import React from 'react';
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
} from '@mui/material';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CastleIcon from '@mui/icons-material/Castle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PersonIcon from '@mui/icons-material/Person';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

import { Context as NnContext } from '@/components/context/nnContext';
import { NnProviderValues } from '@/components/context/nnTypes';
import ItemReview from '@/components/itemReview';
import SimpleScrollContainer from '@/components/simpleScrollContainer';
import { NEONAV_MAINT } from '@/utilities/constants';

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

// TODO this should be synced with the map in mapLeafletLocationsRenderer in some way
const VENUE_TYPES = [
  'Arcade',
  'Chapel',
  'Employment',
  'Endline Solutions',
  'Entertainment',
  'Helix Industries',
  'Info',
  'Lounge',
  'Music',
  'Office',
  'Reboot Syndicate',
  'Sentinels',
  'Service',
  'Store',
];

const DEV_VENUES = [
  'Dev',
  'Food (Vendor)',
  'Medical',
  'Megablock',
  'Megamall',
  'Porto',
  'Road',
  'Security',
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
  if (mode != 'view') {
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
    <Stack direction='row' spacing={1} justifyContent='space-between' alignItems='center'>
      <Typography sx={modalTitleStyle} onClick={onExpand}>{location.name}</Typography>
      <IconButton onClick={onExpand} onMouseDown={handleMouseUpDownIgnore} onMouseUp={handleMouseUpDownIgnore}>
        <ExpandLessIcon/>
      </IconButton>
    </Stack>
    <Typography sx={modalBodyStyle} component='p'>
      {location.venuetype}
    </Typography>
    <Typography sx={modalBodyStyle} component='p'>{location.openState} ⋅ {location.nextTimeMsg}</Typography>
  </Box>
);

const FullView = ({ location, onCollapse }: any) =>  {
  const { state, }: NnProviderValues = React.useContext(NnContext);
  
  return (
    <Box sx={{ minWidth: '100%', height:'calc(90vh - 150px)' }} >
      <Stack direction='row' spacing={1} justifyContent='space-between' alignItems='center'>
        <Typography sx={modalTitleStyle} onClick={onCollapse}>
          {location.name}
        </Typography>
        <IconButton onClick={onCollapse} onMouseDown={handleMouseUpDownIgnore} onMouseUp={handleMouseUpDownIgnore}>
          <ExpandMoreIcon/>
        </IconButton>
      </Stack>
      <SimpleScrollContainer sx={{padding: 0, overflowY: 'auto', display: 'block', }}>
        <Stack direction='column'
          spacing={0.5}
          justifyContent='flex-start'
          alignItems='flex-start'
        >
          <Typography sx={modalBodyStyle} component='p'>
            [{location.id}]
          </Typography>
          <Typography sx={modalBodyStyle} component='p'>
            {location.rating}
          </Typography>
          <Typography sx={modalBodyStyle} component='p'>
            {location.venuetype}
          </Typography>
          <Typography sx={modalBodyStyle} component='p'>{location.openState} ⋅ {location.nextTimeMsg}</Typography>
          <Divider color='secondary' flexItem/>
          <Typography sx={modalBodyStyle} component='p'>
            {(location.ownerisfaction ?
              <CastleIcon fontSize='inherit'/> : <PersonIcon />)}
            &nbsp;⋅&nbsp;
            <Link
              href={`${location.ownerlink}`}>
              {location.ownername}
            </Link>
          </Typography>
          <Divider color='secondary' flexItem/>
          <Typography sx={modalBodyStyle} component='p'><QueryBuilderIcon fontSize='inherit'/>&nbsp;{location.openState}</Typography>
          <TableContainer component={Paper} style={{padding: '1vh'}}>
            <Table aria-label='simple table'>
              <TableBody>
                {location.prettyhours.map((row: any) => (
                  <TableRow
                    key={row.day}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell component='th' scope='row' sx={modalBodyStyle}>
                      {row.day}
                    </TableCell>
                    <TableCell align='right' sx={modalBodyStyle}>
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
          <Divider color='secondary' flexItem/>
          <Typography sx={modalBodyStyle} component='p'>
            <LocationCityIcon fontSize='inherit'/>
            &nbsp;⋅&nbsp;
            <Link href={`/sites?site=${location.neosite}`}>
              {!!location.neosite && location.ownername}
            </Link>
          </Typography>
          {(location.description && <Divider color='secondary' flexItem/>)}
          <Typography sx={modalBodyStyle} component='p'>
            {location.description}
          </Typography>
          <Divider color='secondary' flexItem/>
          <Typography sx={modalBodyStyle} component='p'>
            {location.rating}
          </Typography>
        </Stack>
        <Stack
          spacing={0}
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
        >
          {!location.reviews || location.reviews.length === 0 && (
            <Typography sx={modalBodyStyle} component='p'>Be the first to leave a review!</Typography>
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
                    canDelete={
                      state?.network?.selected.account === reviewItem.reviewer ||
                      state?.network?.selected.account === location.owner ||
                      state?.network?.selected.account === NEONAV_MAINT
                    }
                  />
                </div>
              );
            })}
        </Stack>
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

    const currentUserId = state?.network?.selected?.account;

    // Default: Assign to Current User if creating
    if (currentUserId) {
      let prettyName = '';
      if (currentUserId.startsWith('C')) {
        const factionName = state?.user?.factions?.find(faction => faction.id === currentUserId)?.name;
        prettyName = `${factionName} `;
      }
      options.set(currentUserId, `${prettyName}(You)`);
    }

    // 2. Existing Owner (if different)
    if (!isCreateMode && location?.owner && location.owner !== currentUserId) {
      options.set(location.owner, `${location.ownername || ''} (Current)`);
    }

    // 3. Factions from Context
    (state?.network?.collections?.factions ?? []).forEach((f: any) => {
      if (f.id != currentUserId && f.id != location?.owner) {
        options.set(f.id, `${f.name}`);
      }
    });

    // Build sorted array
    const sortedArray = [...options.entries()].sort((a, b) => -b[1].replace("The ", "").localeCompare(a[1].replace("The ", "")));

    return sortedArray;
  }, [state?.network?.collections?.factions]);

  // Admin only venue types
  const availableVenueTypes = React.useMemo(() => {
    if (isAdmin) {
      return [...VENUE_TYPES, ...DEV_VENUES];
    }
    return VENUE_TYPES;
  }, [isAdmin]);

  return (
    <SimpleScrollContainer>
      <Box sx={{ p: 2, maxHeight: '80vh', width:'100%', overflowY: 'auto', pointerEvents: 'auto', }}>
        <Typography sx={modalTitleStyle}>
          {isCreateMode ? 'CREATE NEW LOCATION' : `MODIFYING: ${location.id}`}
        </Typography>
        
        <Stack spacing={2.5} sx={{ mt: 2 }}>
          {/* SECTION 1: CORE FIELDS (Locked if verified & not admin) */}
          <Typography variant='overline' sx={{ color: 'rgba(255,255,255,0.5)' }}>Core Identity</Typography>
          
          <TextField 
            label='Location Name' name='name' fullWidth 
            value={formData.name} onChange={setTextFormData} 
            disabled={!canEditCore} variant='filled'
            helperText={!canEditCore ? 'Verified: Locked' : ''}
          />

          {/* Venue Type Dropdown */}
          <FormControl fullWidth variant='filled' disabled={!canEditCore}>
            <InputLabel>Venue Type</InputLabel>
            <Select
              name='venuetype'
              value={formData.venuetype}
              onChange={setSelectFormData}
              renderValue={(value) => {
                // Logic to handle invalid values
                const option = VENUE_TYPES.find(opt => opt === value);
                return option ? option : `${value}`; 
              }}
              MenuProps={{
                MenuListProps: {
                  sx: { pb: '90px' }
                }
              }}
            >
              {availableVenueTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Owner Dropdown */}
          <FormControl fullWidth variant='filled' disabled={!canEditCore}>
            <InputLabel>Primary Owner</InputLabel>
            <Select
              name='owner'
              value={formData.owner}
              onChange={setSelectFormData}
              MenuProps={{
                MenuListProps: {
                  sx: { pb: '90px' }
                }
              }}
            >
              {ownerOptions.map(([id, name]) => (
                <MenuItem key={id} value={id}>{'[' + id + '] ' + name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ borderColor: 'secondary.main' }} />

          {/* SECTION 2: METADATA (Always editable by Owner or Admin) */}
          {( !isCreateMode && 
            <>
              <Typography variant='overline' sx={{ color: 'rgba(255,255,255,0.5)' }}>Business Hours</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>

                {/* Loop through days of the week to keep things organized */}
                {['wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'monday', 'tuesday', ].map((dayName) => {
                  // Filter the hours array for just this day
                  const dayShifts = (formData.hours || []).filter((h: any) => h.day === dayName);

                  return (
                    <Box key={dayName} sx={{ mb: 2, p: 1, borderLeft: '2px solid', borderColor: 'secondary.main', pl: 2 }}>
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle2' sx={{ color: 'primary.main' }}>{dayName}</Typography>
                        <IconButton size='small' onClick={() => addShift(dayName)} color='primary'>
                          <AddIcon fontSize='small' />
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
                          <Stack key={globalIndex} direction='row' spacing={1} sx={{ mt: 1 }} alignItems='center'>
                            <MobileTimePicker
                              label='Open'
                              ampm={false}
                              inputFormat='HH:mm'
                              value={parseTime(shift.open)}
                              onChange={(val) => handleHourChange(globalIndex, 'open', val)}
                              renderInput={(params) => <TextField {...params} size='small' />}
                            />

                            <Typography sx={{ opacity: 0.5 }}>—</Typography>

                            <MobileTimePicker
                              label='Close'
                              ampm={false}
                              inputFormat='HH:mm'
                              value={parseTime(shift.close)}
                              onChange={(val) => handleHourChange(globalIndex, 'close', val)}
                              renderInput={(params) => {
                                // INTERCEPT DISPLAY: If value is midnight of next day, show 24:00
                                const displayValue = shift.close === '24:00' ? '24:00' : params.inputProps?.value;
                                return <TextField {...params} size='small' inputProps={{ ...params.inputProps, value: displayValue }} />;
                              }}
                            />
                            <IconButton size='small' onClick={() => removeShift(globalIndex)} color='primary'>
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </Stack>
                        );
                      })}
                      {dayShifts.length === 0 && (
                        <Typography variant='caption' sx={{ opacity: 0.4 }}>Closed / No hours set</Typography>
                      )}
                    </Box>
                  );
                })}
              </LocalizationProvider>
            </>
          )}
          <Typography variant='overline' sx={{ color: 'rgba(255,255,255,0.5)' }}>Display Data</Typography>
          <TextField 
            label='Description' name='description' fullWidth multiline rows={3}
            value={formData.description} onChange={setTextFormData} 
          />

          {/* SECTION 3: ADMIN ONLY (Per your backend authorizedAdmin check) */}
          {isAdmin && (
            <>
              <Divider sx={{ borderColor: 'primary.main', my: 1 }} />
              <Typography variant='overline' sx={{ color: 'primary.main', display: 'block', mb: 1 }}>
                Admin Protocols: Tooltip Data
              </Typography>
              
              <Stack spacing={2}>
                <TextField 
                  label='Short Location Name' 
                  name='tooltip.name' 
                  fullWidth 
                  value={formData.tooltip.name} 
                  onChange={setTextFormData} 
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField 
                    label='Latitude' 
                    name='tooltip.lat' 
                    type='number'
                    fullWidth 
                    value={formData.tooltip.lat} 
                    onChange={setTextFormData} 
                  />
                  <TextField 
                    label='Longitude' 
                    name='tooltip.long' 
                    type='number'
                    fullWidth 
                    value={formData.tooltip.long} 
                    onChange={setTextFormData} 
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField 
                    label='Rotation' 
                    name='tooltip.rotation' 
                    type='number'
                    fullWidth 
                    value={formData.tooltip.rotation} 
                    onChange={setTextFormData} 
                  />
                  <TextField
                    disabled={true} 
                    label='' 
                    name='placeholder' 
                    type='number'
                    fullWidth 
                    value=''
                    onChange={setTextFormData} 
                  />
                </Box>
              </Stack>
            </>
          )}

          {/* COORDINATE READ-ONLY (Visual confirmation only) */}
          <Stack direction='row' spacing={2}>
            { isCreateMode ? (
              <>
                <Typography variant='caption'>LAT: {formData.lat}</Typography>
                <Typography variant='caption'>LONG: {formData.long}</Typography>
              </>
            ) : (
              <>
                <Typography variant='caption'>(OLD) LAT: {location.lat}</Typography>
                <Typography variant='caption'>LONG: {location.long}</Typography>
                <Typography variant='caption'> | </Typography>
                <Typography variant='caption'>(NEW) LAT: {formData.lat}</Typography>
                <Typography variant='caption'>Long: {formData.long}</Typography>
              </>
            )}
          </Stack>
          <div key='spacer'><Box sx={{height: '50px'}}/></div>
        </Stack>
      </Box>
    </SimpleScrollContainer>
  );
};
