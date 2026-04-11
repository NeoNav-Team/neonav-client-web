'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../styles/generic.module.css';
import itemStyles from '../styles/item.module.css';
import { Context as NnContext } from './context/nnContext';
import { NnEvent, NnProviderValues } from './context/nnTypes';
import FooterNav from './footerNav';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VerifiedIcon from '@mui/icons-material/Verified';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { use100vh } from 'react-div-100vh';
import { imageUrl } from '../utilities/constants';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

type EventView = 'events' | 'plan' | 'locations' | 'manage';

interface SelectedLocation {
  id: string;
  name: string;
}

const flexContainer = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  alignContent: 'space-around',
  alignItems: 'stretch',
};

const flexBody = {
  order: 0,
  flex: '1',
  alignSelf: 'auto',
  width: '100%',
  minWidth: '100%',
  minHeight: '50vh',
  overflow: 'hidden',
};

const flexFooter = {
  order: 0,
  flex: '0 1 24px',
  alignSelf: 'flex-end',
  width: '100%',
};

const scrollSx = {
  overflow: 'auto',
  display: 'flex',
  padding: '1vh 2vh',
  width: '100%',
  maxHeight: '100%',
  maxWidth: '100%',
  overflowX: 'hidden' as const,
  overflowY: 'auto' as const,
  '&::-webkit-scrollbar': { width: '0.69em' },
  '&::-webkit-scrollbar-track': { boxShadow: 'inset 0 0 6px var(--color-2)' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--color-2)',
    outline: '1px solid var(--color-1)',
  },
};

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '600px',
  boxShadow: 24,
};

const VIEW_LABELS: Record<EventView, string> = {
  events: 'EVENTS',
  plan: 'MY PLAN',
  locations: 'LOCATIONS',
  manage: 'MANAGE',
};

// Returns the day's 4AM–4AM bounds in local time
const getDayBounds = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setHours(4, 0, 0, 0);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  end.setHours(4, 0, 0, 0);
  return { start, end };
};

const getInitialDate = (): Date => {
  const now = new Date();
  if (now.getHours() < 4) now.setDate(now.getDate() - 1);
  now.setHours(12, 0, 0, 0);
  return now;
};

const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

const formatTime = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).replace(' AM', 'AM').replace(' PM', 'PM');
  } catch {
    return iso;
  }
};

interface EventsAppProps {
  initialLocationId?: string;
}

export default function EventsApp({ initialLocationId }: EventsAppProps): JSX.Element {
  const FULL_HEIGHT = use100vh() || 600;
  const FLEX_HEIGHT = FULL_HEIGHT - 75;
  const TOOLBAR_HEIGHT = 76;
  const SCROLL_HEIGHT = FULL_HEIGHT - 114 - TOOLBAR_HEIGHT;

  const {
    state,
    fetchAllEvents = () => {},
    fetchUserEventsAttending = () => {},
    fetchUserEventsMine = () => {},
    fetchLocationEvents = (_id: string) => {},
    fetchAllLocations = () => {},
    rsvpEvent = (_id: string) => {},
    updateEvent = (_id: string, _payload: any) => {},
    createEvent = (_locationId: string, _payload: any) => {},
    cancelEvent = (_id: string, _payload: any) => {},
    fetchLocationById = (_id: string) => {},
  }: NnProviderValues = useContext(NnContext);

  const userId = state?.user?.profile?.auth?.userid || '';
  const accountId = state?.network?.selected?.account || userId;
  const contextEvents: NnEvent[] = useMemo(
    () => (state?.network?.collections?.events as NnEvent[]) || [],
    [state?.network?.collections?.events],
  );
  const locations: any[] = useMemo(
    () => state?.network?.collections?.locations || [],
    [state?.network?.collections?.locations],
  );
  const factions: any[] = useMemo(
    () => state?.network?.collections?.factions || [],
    [state?.network?.collections?.factions],
  );

  const [view, setView] = useState<EventView>(initialLocationId ? 'locations' : 'events');
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(
    initialLocationId ? { id: initialLocationId, name: initialLocationId } : null,
  );
  const [fetchedViews, setFetchedViews] = useState<Set<string>>(new Set());
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
  const [rsvpOverrides, setRsvpOverrides] = useState<Record<string, boolean>>({});
  const [modalEvent, setModalEvent] = useState<NnEvent | null>(null);
  const [editFields, setEditFields] = useState<{ name: string; description: string; open: string; close: string } | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showUnverified, setShowUnverified] = useState(false);
  const [locationsFetchDone, setLocationsFetchDone] = useState(() => locations.length > 0);
  const locationsChangeCount = useRef(0);
  const [createFields, setCreateFields] = useState<{ name: string; description: string; open: string; close: string; locationId: string }>({ name: '', description: '', open: '', close: '', locationId: '' });
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAutoAdvanced = useRef(false);
  const pageOpenTime = useRef<Date>(new Date());

  const viewKey = view === 'locations' && selectedLocation
    ? `locations_${selectedLocation.id}`
    : view;

  const getLocationName = useCallback(
    (locationId: string): string => {
      const loc = locations.find((l: any) => l.id === locationId);
      return loc?.name || locationId;
    },
    [locations],
  );

  useEffect(() => {
    if (!modalEvent?.location) return;
    const loc = locations.find((l: any) => l.id === modalEvent.location);
    if (loc && !loc.ownername) {
      fetchLocationById(loc.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalEvent]);

  useEffect(() => {
    if (locations.length === 0) fetchAllLocations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    locationsChangeCount.current += 1;
    if (locationsChangeCount.current > 1) setLocationsFetchDone(true);
  }, [locations]);

  // Once locations load, resolve the real name for an initial location
  useEffect(() => {
    if (!initialLocationId || locations.length === 0) return;
    const loc = locations.find((l: any) => l.id === initialLocationId);
    if (loc) {
      setSelectedLocation({ id: initialLocationId, name: loc.name || initialLocationId });
    }
  }, [initialLocationId, locations]);

  const doFetchForView = useCallback(
    (v: EventView, locId?: string) => {
      if (v === 'events') fetchAllEvents();
      else if (v === 'plan') fetchUserEventsAttending();
      else if (v === 'manage') fetchUserEventsMine();
      else if (v === 'locations' && locId) fetchLocationEvents(locId);
    },
    [fetchAllEvents, fetchUserEventsAttending, fetchUserEventsMine, fetchLocationEvents],
  );

  useEffect(() => {
    if (fetchedViews.has(viewKey)) return;
    if (view === 'locations' && !selectedLocation) return;
    doFetchForView(view, selectedLocation?.id);
    setFetchedViews((prev) => new Set([...prev, viewKey]));
  }, [view, selectedLocation, viewKey, fetchedViews, doFetchForView]);

  // Auto-scroll to current time
  useEffect(() => {
    if ((view === 'events' || (view === 'locations' && selectedLocation)) && contextEvents.length > 0) {
      requestAnimationFrame(() => {
        if (!scrollRef.current) return;
        const nowMs = Date.now();
        const items = scrollRef.current.querySelectorAll<HTMLElement>('[data-open-ms]');
        let target: HTMLElement | null = null;
        for (let i = 0; i < items.length; i++) {
          if (parseInt(items[i].dataset.openMs || '0', 10) >= nowMs) {
            target = items[i];
            break;
          }
        }
        if (target) {
          const containerRect = scrollRef.current.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          scrollRef.current.scrollTop += targetRect.top - containerRect.top;
        }
      });
    }
  }, [contextEvents, view, selectedLocation]);

  // On initial events load, skip forward to the nearest day that has events
  useEffect(() => {
    if (view !== 'events' || hasAutoAdvanced.current || !fetchedViews.has('events') || contextEvents.length === 0) return;
    hasAutoAdvanced.current = true;
    const visibleEvents = contextEvents.filter((e) => !e.cancelled);
    const { start, end } = getDayBounds(selectedDate);
    const hasEventsToday = visibleEvents.some((e) => {
      if (!e.open) return false;
      const t = new Date(e.open);
      return t >= start && t < end;
    });
    if (!hasEventsToday) {
      const dayStart = new Date(selectedDate);
      dayStart.setHours(4, 0, 0, 0);
      const next = visibleEvents
        .filter((e) => e.open && new Date(e.open) >= dayStart)
        .sort((a, b) => new Date(a.open!).getTime() - new Date(b.open!).getTime())[0];
      if (next) {
        const d = new Date(next.open!);
        if (d.getHours() < 4) d.setDate(d.getDate() - 1);
        d.setHours(12, 0, 0, 0);
        setSelectedDate(d);
      }
    }
  }, [contextEvents, fetchedViews, view, selectedDate]);

  const handleViewChange = (newView: EventView) => {
    setView(newView);
    setSelectedLocation(null);
    setRsvpOverrides({});
    setFetchedViews((prev) => {
      const next = new Set(prev);
      next.delete(newView);
      return next;
    });
  };

  const handleDatePrev = () =>
    setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });

  const handleDateNext = () =>
    setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });

  const handleLocationSelect = (locId: string, locName: string) => {
    setSelectedLocation({ id: locId, name: locName });
    setRsvpOverrides({});
  };

  const isUserAttending = (event: NnEvent): boolean => {
    const dbid = event.dbid || '';
    if (rsvpOverrides[dbid] !== undefined) return rsvpOverrides[dbid];
    return event.attendees?.includes(userId) || false;
  };

  const isUserOwner = (event: NnEvent): boolean => event.owner === userId;

  const handleRsvp = (event: NnEvent) => {
    if (!event.dbid || isUserOwner(event) || rsvpLoading) return;
    const dbid = event.dbid;
    setRsvpLoading(dbid);
    setRsvpOverrides((prev) => ({ ...prev, [dbid]: !isUserAttending(event) }));
    rsvpEvent(dbid);
    setTimeout(() => setRsvpLoading(null), 1000);
  };

  const filteredEvents = useMemo((): NnEvent[] => {
    if (view === 'locations' && !selectedLocation) return [];
    const now = new Date();
    const sorted = contextEvents
      .filter((e) => {
        if (!e.open) return false;
        if (view === 'events' && e.location) {
          const loc = locations.find((l: any) => l.id === e.location);
          if (!loc) return false;
          if (!showUnverified && !loc.verified) return false;
        }
        if (e.cancelled) {
          // cancelled: only show if future AND user has RSVP'd (or is owner)
          const isFuture = new Date(e.open) > now;
          const attending = e.attendees?.includes(userId);
          const isOwner = e.owner === accountId;
          return isFuture && (attending || isOwner);
        }
        return true;
      })
      .sort((a, b) => {
        const diff = new Date(a.open || '').getTime() - new Date(b.open || '').getTime();
        return diff !== 0 ? diff : (a.location || '').localeCompare(b.location || '');
      });
    if (view === 'manage') {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return sorted.filter((e) => new Date(e.open!) >= cutoff);
    }
    const { start, end } = getDayBounds(selectedDate);
    return sorted.filter((e) => {
      const t = new Date(e.open!);
      return t >= start && t < end;
    });
  }, [contextEvents, selectedDate, view, selectedLocation, userId, accountId, showUnverified, locations]);

  const filteredLocations = useMemo(() =>
    locations
      .filter((l: any) => (l.venuetype || '').toLowerCase() !== 'dev')
      .filter((l: any) => showUnverified || l.verified === true)
      .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '')),
  [locations, showUnverified],
  );

  const showRsvpButton = view !== 'manage';
  const isFetching = !fetchedViews.has(viewKey) && view !== 'locations';
  const showDatePicker = view !== 'manage' && !(view === 'locations' && !selectedLocation);
  const showVerifiedToggle = view === 'events' || view === 'locations';

  // ─── Event item ─────────────────────────────────────────────────────────────
  const renderEventItem = (event: NnEvent) => {
    const attending = isUserAttending(event);
    const owner = isUserOwner(event);
    const loading = rsvpLoading === event.dbid;
    const locName = getLocationName(event.location || '');
    const openTime = event.open ? formatTime(event.open) : '?';
    const closeTime = event.close ? formatTime(event.close) : '?';
    const attendeeCount = event.attendees?.length ?? 0;

    return (
      <Box
        key={event.dbid}
        style={{ padding: '1vh 0', width: '100%' }}
        data-open-ms={event.open ? new Date(event.open).getTime() : 0}
      >
        {/* Start time header — top left, Garden-style */}
        <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="flex-start">
          <Box sx={{ maxWidth: '72%' }}>
            <div className={itemStyles.subtitleLine} data-augmented-ui="tl-clip both" style={event.cancelled ? { backgroundColor: 'var(--color-danger, #7b0000)' } : undefined}>
              <div className={itemStyles.name}>{openTime}</div>
            </div>
          </Box>
        </Stack>
        {/* Main content row */}
        <div
          className={itemStyles.statusLine}
          data-augmented-ui="tr-clip inlay"
          onClick={() => {
            setModalEvent(event);
            setEditFields({ name: event.name || '', description: event.description || '', open: event.open || '', close: event.close || '' });
          }}
          style={{ cursor: 'pointer', ...(event.cancelled ? { backgroundColor: 'var(--color-danger, #7b0000)' } : {}) }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography component="div">
                <span className={itemStyles.name}>{event.name || '[Unnamed Event]'}</span>
              </Typography>
              <Typography component="div">
                <span className={itemStyles.action}>{locName}</span>
                {'  '}
                <span className={itemStyles.comment} style={{ paddingLeft: 4 }}>
                  {event.ownername || event.owner}
                </span>
              </Typography>
            </Box>
            {showRsvpButton && (
              <IconButton
                size="small"
                disabled={owner || loading}
                color={owner ? 'default' : attending ? 'success' : 'primary'}
                title={owner ? 'Hosting' : attending ? 'Attending — click to leave' : 'RSVP'}
                onClick={(e) => { e.stopPropagation(); handleRsvp(event); }}
                sx={{ flexShrink: 0, p: '2px' }}
              >
                {owner || attending
                  ? <CheckCircleIcon fontSize="small" />
                  : <RadioButtonUncheckedIcon fontSize="small" />}
              </IconButton>
            )}
          </Stack>
        </div>
        {/* Time / attendee badge — bottom right, Garden-style */}
        <Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="flex-end">
          <Box sx={{ maxWidth: '72%' }}>
            <div className={itemStyles.dateLine} data-augmented-ui="br-clip both">
              <Stack direction="row" spacing={1}>
                <div className={itemStyles.dateText}>{openTime}–{closeTime}</div>
                <div className={itemStyles.dateText}>
                  <span>{attendeeCount} going</span>
                </div>
              </Stack>
            </div>
          </Box>
        </Stack>
      </Box>
    );
  };

  // ─── Location item ───────────────────────────────────────────────────────────
  const renderLocationItem = (loc: any) => (
    <Box
      key={loc.id}
      style={{ padding: '1vh 0', width: '100%' }}
      onClick={() => handleLocationSelect(loc.id, loc.name || loc.id)}
    >
      <div
        className={itemStyles.statusLine}
        data-augmented-ui="tr-clip inlay"
        style={{ cursor: 'pointer' }}
      >
        <Typography component="div">
          <span className={itemStyles.name}>{loc.name || loc.id}</span>
        </Typography>
        {loc.description && (
          <Typography component="div">
            <span className={itemStyles.action}>{loc.description}</span>
          </Typography>
        )}
      </div>
    </Box>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Container disableGutters style={{ height: '100%' }}>
      <div
        className={styles.darkPane}
        style={{ height: '100%', maxHeight: 'calc(100% - 74px)', marginTop: '70px' }}
        data-augmented-ui="tr-rect br-clip bl-clip both"
      >
        <Box sx={{ ...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT, transform: 'translateZ(0)' }}>

          {/* ── Toolbar ── */}
          <Box sx={{ flex: '0 0 auto', width: '100%' }}>
            {/* View buttons as subtitleLine header */}
            <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both" style={{ overflow: 'hidden' }}>
              <Box sx={{ width: 'calc(100% - 48px)' }}>
                <ButtonGroup variant="text" size="small" fullWidth>
                  {(Object.keys(VIEW_LABELS) as EventView[]).map((v) => (
                    <Button
                      key={v}
                      variant={view === v ? 'contained' : 'text'}
                      color="primary"
                      onClick={() => handleViewChange(v)}
                      sx={{ textTransform: 'none', fontSize: '0.85rem', fontFamily: 'Jura', py: 0.25 }}
                    >
                      {VIEW_LABELS[v]}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            </div>

            {/* Date selector + verified toggle */}
            {(showDatePicker || showVerifiedToggle) && (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                {view === 'locations' && selectedLocation && (
                  <IconButton size="small" onClick={() => { setSelectedLocation(null); setRsvpOverrides({}); }} title="Back">
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                )}
                {showDatePicker && (
                  <>
                    <IconButton size="small" onClick={handleDatePrev}>
                      <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ minWidth: 120, textAlign: 'center' }}>
                      <Typography
                        variant="caption"
                        className={itemStyles.dateText}
                        sx={{ fontSize: '1.1rem', display: 'block' }}
                      >
                        {formatDate(selectedDate)}
                      </Typography>
                      {view === 'locations' && selectedLocation && (
                        <Typography
                          variant="caption"
                          className={itemStyles.dateText}
                          sx={{ fontSize: '0.7rem', display: 'block', opacity: 0.7 }}
                          noWrap
                        >
                          {selectedLocation.name}
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" onClick={handleDateNext}>
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
                {showVerifiedToggle && (
                  <Tooltip title={showUnverified ? 'Show verified only' : 'Show all locations'}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowUnverified(v => !v)}>
                      <IconButton size="small" color={showUnverified ? 'default' : 'primary'}>
                        <VerifiedIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" className={itemStyles.dateText} color={showUnverified ? 'text.disabled' : 'primary'}>
                        VERIFIED
                      </Typography>
                    </span>
                  </Tooltip>
                )}
              </Stack>
            )}
          </Box>

          {/* ── Scroll body ── */}
          <Box sx={{ ...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {view === 'locations' && !selectedLocation ? (
              <Box ref={scrollRef} sx={{ ...scrollSx, flexDirection: 'column' }}>
                <Stack spacing={0} sx={{ width: '100%' }}>
                  {!locationsFetchDone && locations.length === 0 ? (
                    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '40vh' }}>
                      <CircularProgress color="secondary" />
                    </Stack>
                  ) : filteredLocations.length === 0 ? (
                    <Box style={{ padding: '1vh 0', width: '100%' }}>
                      <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay">
                        <Typography component="div" sx={{ textAlign: 'center', opacity: 0.6 }}>
                          <span className={itemStyles.dateText}>No locations found.</span>
                        </Typography>
                      </div>
                    </Box>
                  ) : (
                    filteredLocations.map(renderLocationItem)
                  )}
                </Stack>
              </Box>
            ) : isFetching ? (
              <Stack direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '40vh' }}>
                <CircularProgress color="secondary" />
              </Stack>
            ) : (
              <Box ref={scrollRef} sx={{ ...scrollSx, flexDirection: 'column' }}>
                <Stack spacing={0} sx={{ width: '100%' }}>
                  {filteredEvents.length === 0 ? (
                    <Box style={{ padding: '1vh 0', width: '100%' }}>
                      <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay">
                        <Typography component="div" sx={{ textAlign: 'center', opacity: 0.6 }}>
                          <span className={itemStyles.dateText}>
                            {fetchedViews.has(viewKey) ? 'No events this day.' : 'Loading...'}
                          </span>
                        </Typography>
                      </div>
                    </Box>
                  ) : (() => {
                    const now = pageOpenTime.current;
                    const { start, end } = getDayBounds(selectedDate);
                    const isToday = now >= start && now < end;
                    const nowMs = now.getTime();
                    const items: React.ReactNode[] = [];
                    let markerInserted = false;
                    filteredEvents.forEach((event) => {
                      if (isToday && !markerInserted) {
                        const eventMs = event.open ? new Date(event.open).getTime() : 0;
                        if (eventMs > nowMs) {
                          markerInserted = true;
                          items.push(
                            <Stack key="now-marker" direction="row" spacing={1} alignItems="flex-start" justifyContent="flex-start">
                              <Box sx={{ maxWidth: '72%' }}>
                                <div className={itemStyles.subtitleLine} data-augmented-ui="tl-clip both" style={{ opacity: 0.5 }}>
                                  <div className={itemStyles.name}>▶ {formatTime(now.toISOString())}</div>
                                </div>
                              </Box>
                            </Stack>
                          );
                        }
                      }
                      items.push(renderEventItem(event));
                    });
                    if (isToday && !markerInserted) {
                      items.push(
                        <Stack key="now-marker" direction="row" spacing={1} alignItems="flex-start" justifyContent="flex-start">
                          <Box sx={{ maxWidth: '72%' }}>
                            <div className={itemStyles.subtitleLine} data-augmented-ui="tl-clip both" style={{ opacity: 0.5 }}>
                              <div className={itemStyles.name}>▶ {formatTime(now.toISOString())}</div>
                            </div>
                          </Box>
                        </Stack>
                      );
                    }
                    return items;
                  })()}
                </Stack>
              </Box>
            )}
          </Box>

          {/* ── Footer ── */}
          {view === 'manage' && (
            <Box sx={flexFooter}>
              <FooterNav
                bigHexProps={{
                  icon: <AddIcon />,
                  tooltipText: 'Create Event',
                  handleAction: () => {
                    setCreateFields({ name: '', description: '', open: '', close: '', locationId: '' });
                    setCreateModalOpen(true);
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </div>

      {/* ── Event detail modal ── */}
      <Modal open={!!modalEvent} onClose={() => setModalEvent(null)}>
        <Box sx={modalStyle}>
          <div
            className={styles.darkPane}
            data-augmented-ui="tr-rect br-clip bl-clip both"
            style={{ padding: '16px', backgroundColor: modalEvent?.cancelled ? 'var(--color-danger, #7b0000)' : 'var(--background-color)' }}
          >
            {modalEvent && editFields && (() => {
              const loc = locations.find((l: any) => l.id === modalEvent.location);
              const canEdit = !modalEvent.cancelled && (modalEvent.owner === accountId || (accountId !== userId && loc?.owner === accountId));
              const reloadView = () => {
                setFetchedViews((prev) => { const next = new Set(prev); next.delete(viewKey); return next; });
              };
              const handleSave = () => {
                updateEvent(modalEvent.dbid!, editFields);
                setModalEvent(null);
                reloadView();
              };
              const handleCancel = () => {
                cancelEvent(modalEvent.dbid!, editFields);
                setModalEvent(null);
                reloadView();
              };
              return (
                <Stack spacing={1.5}>
                  {/* Modal header */}
                  <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
                    {canEdit ? (
                      <TextField
                        variant="standard"
                        fullWidth
                        value={editFields.name}
                        onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                        inputProps={{ className: itemStyles.name }}
                        sx={{ '& .MuiInput-underline:before': { borderColor: 'var(--color-2)' } }}
                      />
                    ) : (
                      <Typography variant="h6" className={itemStyles.name}>
                        {modalEvent.cancelled ? `CANCELLED - ${modalEvent.name}` : modalEvent.name}
                      </Typography>
                    )}
                  </div>

                  {/* Open / Close times */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
                      {canEdit ? (
                        <DateTimePicker
                          label="Open"
                          ampm={false}
                          value={editFields.open ? dayjs(editFields.open) : null}
                          onChange={(val: Dayjs | null) => setEditFields({ ...editFields, open: val?.isValid() ? val.toISOString() : '' })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              fullWidth
                              inputProps={{ ...params.inputProps, className: itemStyles.dateText }}
                              sx={{ '& .MuiInput-underline:before': { borderColor: 'var(--color-2)' } }}
                            />
                          )}
                        />
                      ) : (
                        <Typography variant="body2" className={itemStyles.dateText}>
                          Start: {modalEvent.open ? new Date(modalEvent.open).toLocaleString() : '—'}
                        </Typography>
                      )}
                    </div>
                    <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
                      {canEdit ? (
                        <DateTimePicker
                          label="Close"
                          ampm={false}
                          value={editFields.close ? dayjs(editFields.close) : null}
                          onChange={(val: Dayjs | null) => setEditFields({ ...editFields, close: val?.isValid() ? val.toISOString() : '' })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              fullWidth
                              inputProps={{ ...params.inputProps, className: itemStyles.dateText }}
                              sx={{ '& .MuiInput-underline:before': { borderColor: 'var(--color-2)' } }}
                            />
                          )}
                        />
                      ) : (
                        <Typography variant="body2" className={itemStyles.dateText}>
                          Close: {modalEvent.close ? new Date(modalEvent.close).toLocaleString() : '—'}
                        </Typography>
                      )}
                    </div>
                  </LocalizationProvider>

                  {/* Description */}
                  {(canEdit || modalEvent.description) && (
                    <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay">
                      {canEdit ? (
                        <TextField
                          variant="standard"
                          fullWidth
                          multiline
                          label="Description"
                          value={editFields.description}
                          onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                          sx={{ '& .MuiInput-underline:before': { borderColor: 'var(--color-2)' } }}
                        />
                      ) : (
                        <Typography variant="body2">{modalEvent.description}</Typography>
                      )}
                    </div>
                  )}

                  {/* Details rows */}
                  <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay">
                    <Typography component="div">
                      <span className={itemStyles.action}>Location</span>
                      {' 》 '}
                      <span className={itemStyles.comment} style={{ paddingLeft: 4 }}>
                        {getLocationName(modalEvent.location || '')}
                      </span>
                    </Typography>
                    <Typography component="div">
                      <span className={itemStyles.action}>Host</span>
                      {' 》 '}
                      <span className={itemStyles.comment} style={{ paddingLeft: 4 }}>
                        {modalEvent.ownername || modalEvent.owner}
                      </span>
                    </Typography>
                    <Typography component="div">
                      <span className={itemStyles.action}>Attendees</span>
                      {' 》 '}
                      <span className={itemStyles.comment} style={{ paddingLeft: 4 }}>
                        {modalEvent.attendees?.length ?? 0}
                      </span>
                    </Typography>
                  </div>

                  {/* Location panel */}
                  {loc && (
                    <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay">
                      <Typography component="div">
                        <span className={itemStyles.action}>Venue</span>
                        {' 》 '}
                        <a href={`/map/${modalEvent.location}`} style={{ color: 'inherit' }}>
                          <span className={itemStyles.comment} style={{ paddingLeft: 4 }}>{loc.name || modalEvent.location}</span>
                        </a>
                      </Typography>
                      {loc.venuetype && (
                        <Typography component="div">
                          <span className={itemStyles.action}>Type</span>
                          {' 》 '}
                          <span className={itemStyles.comment} style={{ paddingLeft: 4 }}>{loc.venuetype}</span>
                        </Typography>
                      )}
                    </div>
                  )}

                  {/* Owner faction panel */}
                  {loc?.owner && (() => {
                    const ownerFaction = factions.find((f: any) => f.id === loc.owner);
                    const ownerName = loc.ownername || ownerFaction?.name;
                    const displayName = ownerName ? `${ownerName} (${loc.owner})` : loc.owner;
                    return (
                      <a href={`/factions/${loc.owner}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay" style={{ cursor: 'pointer' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              component="img"
                              src={imageUrl(loc.owner, true)}
                              alt={displayName}
                              sx={{ width: 32, height: 32, objectFit: 'cover', flexShrink: 0 }}
                            />
                            <Typography component="div">
                              <span className={itemStyles.name}>{displayName}</span>
                            </Typography>
                          </Stack>
                        </div>
                      </a>
                    );
                  })()}

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {canEdit && !modalEvent.cancelled && (
                      <Button variant="outlined" size="small" color="error" onClick={handleCancel}>
                        Cancel Event
                      </Button>
                    )}
                    {canEdit && (
                      <Button variant="contained" size="small" color="primary" onClick={handleSave}>
                        Save
                      </Button>
                    )}
                    <Button variant="outlined" size="small" onClick={() => setModalEvent(null)}>
                      Close
                    </Button>
                  </Stack>
                </Stack>
              );
            })()}
          </div>
        </Box>
      </Modal>
      {/* ── Create event modal ── */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <Box sx={modalStyle}>
          <div
            className={styles.darkPane}
            data-augmented-ui="tr-rect br-clip bl-clip both"
            style={{ padding: '16px', backgroundColor: 'var(--background-color)' }}
          >
            {(() => {
              const adminFactionId = 'f2e3fab8cba8e58170307c2533089d39';
              const isAdminFaction = accountId === adminFactionId;
              const ownedLocations = locations.filter((l: any) =>
                l.venuetype !== 'dev' && (isAdminFaction || l.owner === accountId)
              );
              const handleCreate = () => {
                if (!createFields.locationId || !createFields.name || !createFields.open || !createFields.close) return;
                createEvent(createFields.locationId, {
                  name: createFields.name,
                  description: createFields.description,
                  open: createFields.open,
                  close: createFields.close,
                });
                setCreateModalOpen(false);
              };
              return (
                <Stack spacing={1.5}>
                  <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
                    <Typography variant="h6" className={itemStyles.name}>New Event</Typography>
                  </div>
                  <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay">
                    <Select
                      variant="standard"
                      fullWidth
                      displayEmpty
                      value={createFields.locationId}
                      onChange={(e) => setCreateFields({ ...createFields, locationId: e.target.value })}
                      sx={{ color: 'var(--color-1)' }}
                    >
                      <MenuItem value="" disabled>Select location</MenuItem>
                      {ownedLocations.map((l: any) => (
                        <MenuItem key={l.id} value={l.id}>{l.name || l.id}</MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Event name"
                      value={createFields.name}
                      onChange={(e) => setCreateFields({ ...createFields, name: e.target.value })}
                      inputProps={{ className: itemStyles.name }}
                      sx={{ '& .MuiInput-underline:before': { borderColor: 'var(--color-2)' } }}
                    />
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
                      <DateTimePicker
                        label="Open"
                        ampm={false}
                        value={createFields.open ? dayjs(createFields.open) : null}
                        onChange={(val: Dayjs | null) => setCreateFields({ ...createFields, open: val?.isValid() ? val.toISOString() : '' })}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            fullWidth
                            inputProps={{ ...params.inputProps, className: itemStyles.dateText }}
                            sx={{ '& .MuiInput-underline:before': { borderColor: 'var(--color-2)' } }}
                          />
                        )}
                      />
                    </div>
                    <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
                      <DateTimePicker
                        label="Close"
                        ampm={false}
                        value={createFields.close ? dayjs(createFields.close) : null}
                        onChange={(val: Dayjs | null) => setCreateFields({ ...createFields, close: val?.isValid() ? val.toISOString() : '' })}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            fullWidth
                            inputProps={{ ...params.inputProps, className: itemStyles.dateText }}
                            sx={{ '& .MuiInput-underline:before': { borderColor: 'var(--color-2)' } }}
                          />
                        )}
                      />
                    </div>
                  </LocalizationProvider>
                  <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay">
                    <TextField
                      variant="standard"
                      fullWidth
                      multiline
                      label="Description"
                      value={createFields.description}
                      onChange={(e) => setCreateFields({ ...createFields, description: e.target.value })}
                      sx={{ '& .MuiInput-underline:before': { borderColor: 'var(--color-2)' } }}
                    />
                  </div>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      disabled={!createFields.locationId || !createFields.name || !createFields.open || !createFields.close}
                      onClick={handleCreate}
                    >
                      Create
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => setCreateModalOpen(false)}>
                      Close
                    </Button>
                  </Stack>
                </Stack>
              );
            })()}
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
