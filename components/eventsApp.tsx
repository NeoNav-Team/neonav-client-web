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
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { use100vh } from 'react-div-100vh';

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
  justifyContent: 'center',
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
  events: 'Events',
  plan: 'My Plan',
  locations: 'Locations',
  manage: 'Manage',
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
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
};

export default function EventsApp(): JSX.Element {
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
  }: NnProviderValues = useContext(NnContext);

  const userId = state?.user?.profile?.auth?.userid || '';
  const contextEvents: NnEvent[] = useMemo(
    () => (state?.network?.collections?.events as NnEvent[]) || [],
    [state?.network?.collections?.events],
  );
  const locations: any[] = useMemo(
    () => state?.network?.collections?.locations || [],
    [state?.network?.collections?.locations],
  );

  const [view, setView] = useState<EventView>('events');
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [fetchedViews, setFetchedViews] = useState<Set<string>>(new Set());
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
  const [rsvpOverrides, setRsvpOverrides] = useState<Record<string, boolean>>({});
  const [modalEvent, setModalEvent] = useState<NnEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    if (locations.length === 0) fetchAllLocations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const sorted = contextEvents
      .filter((e) => !!e.open)
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
  }, [contextEvents, selectedDate, view, selectedLocation]);

  const showRsvpButton = view !== 'manage';
  const isFetching = fetchedViews.has(viewKey) && contextEvents.length === 0 && view !== 'locations';
  const showDatePicker = view !== 'manage' && !(view === 'locations' && !selectedLocation);

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
        {/* Main content row */}
        <div
          className={itemStyles.statusLine}
          data-augmented-ui="tr-clip inlay"
          onClick={() => setModalEvent(event)}
          style={{ cursor: 'pointer' }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography component="div">
                <span className={itemStyles.name}>{event.name || '[Unnamed Event]'}</span>
              </Typography>
              <Typography component="div">
                <span className={itemStyles.action}>{locName}</span>
                {' 》 '}
                <span className={itemStyles.comment} style={{ paddingLeft: 4 }}>
                  {event.ownername || event.owner}
                </span>
              </Typography>
            </Box>
            {showRsvpButton && (
              <Box
                onClick={(e) => { e.stopPropagation(); handleRsvp(event); }}
                sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                <IconButton
                  size="small"
                  disabled={owner || loading}
                  color={owner ? 'default' : attending ? 'success' : 'primary'}
                  title={owner ? 'Hosting' : attending ? 'Attending — click to leave' : 'RSVP'}
                >
                  {owner || attending
                    ? <CheckCircleIcon fontSize="small" />
                    : <RadioButtonUncheckedIcon fontSize="small" />}
                </IconButton>
                <Typography variant="caption" sx={{ lineHeight: 1, minWidth: 48 }}>
                  {loading ? '...' : owner ? 'Hosting' : attending ? 'Attending' : 'RSVP'}
                </Typography>
              </Box>
            )}
          </Stack>
        </div>
        {/* Time / attendee badge — bottom right, Garden-style */}
        <Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="flex-end">
          <Box sx={{ maxWidth: '72%' }}>
            <div className={itemStyles.dateLine} data-augmented-ui="br-clip both">
              <Stack direction="row" spacing={1}>
                <div className={itemStyles.dateText}>{openTime} – {closeTime}</div>
                <div className={itemStyles.dateText}>
                  <span>{attendeeCount} attending</span>
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
        <Box sx={{ ...flexContainer, minHeight: FLEX_HEIGHT, maxHeight: FLEX_HEIGHT }}>

          {/* ── Toolbar ── */}
          <Box sx={{ flex: '0 0 auto', width: '100%' }}>
            {/* View buttons as subtitleLine header */}
            <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
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
            </div>

            {/* Date selector */}
            {showDatePicker && (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                {view === 'locations' && selectedLocation && (
                  <IconButton size="small" onClick={() => { setSelectedLocation(null); setRsvpOverrides({}); }} title="Back">
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton size="small" onClick={handleDatePrev}>
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <Typography
                  variant="caption"
                  className={itemStyles.dateText}
                  sx={{ minWidth: 120, textAlign: 'center', fontSize: '0.85rem' }}
                >
                  {view === 'locations' && selectedLocation
                    ? selectedLocation.name
                    : formatDate(selectedDate)}
                </Typography>
                <IconButton size="small" onClick={handleDateNext}>
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
          </Box>

          {/* ── Scroll body ── */}
          <Box sx={{ ...flexBody, maxHeight: SCROLL_HEIGHT }}>
            {view === 'locations' && !selectedLocation ? (
              <Box ref={scrollRef} sx={{ ...scrollSx, flexDirection: 'column' }}>
                <Stack spacing={0} sx={{ width: '100%' }}>
                  {locations.length === 0 ? (
                    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '40vh' }}>
                      <CircularProgress color="secondary" />
                    </Stack>
                  ) : (
                    locations
                      .filter((l: any) => l.type !== 'dev')
                      .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))
                      .map(renderLocationItem)
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
                  ) : (
                    filteredEvents.map(renderEventItem)
                  )}
                </Stack>
              </Box>
            )}
          </Box>

          {/* ── Footer ── */}
          <Box sx={flexFooter}>
            <FooterNav bigHexProps={{ disabled: true }} />
          </Box>
        </Box>
      </div>

      {/* ── Event detail modal ── */}
      <Modal open={!!modalEvent} onClose={() => setModalEvent(null)}>
        <Box sx={modalStyle}>
          <div
            className={styles.darkPane}
            data-augmented-ui="tr-rect br-clip bl-clip both"
            style={{ padding: '16px' }}
          >
            {modalEvent && (
              <Stack spacing={1.5}>
                {/* Modal header */}
                <div className={itemStyles.subtitleLine} data-augmented-ui="tr-clip both">
                  <Typography variant="h6" className={itemStyles.name}>
                    {modalEvent.name}
                  </Typography>
                </div>

                {/* Description */}
                {modalEvent.description && (
                  <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay">
                    <Typography variant="body2">{modalEvent.description}</Typography>
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

                {/* Time badge */}
                <Stack direction="row" justifyContent="flex-end">
                  <div className={itemStyles.dateLine} data-augmented-ui="br-clip both">
                    <Stack direction="row" spacing={1}>
                      <div className={itemStyles.dateText}>
                        {modalEvent.open ? new Date(modalEvent.open).toLocaleString() : '—'}
                      </div>
                      <div className={itemStyles.dateText}>
                        <span>→ {modalEvent.close ? new Date(modalEvent.close).toLocaleString() : '—'}</span>
                      </div>
                    </Stack>
                  </div>
                </Stack>

                {/* Placeholder */}
                <div className={itemStyles.statusLine} data-augmented-ui="tr-clip inlay" style={{ opacity: 0.45 }}>
                  <Typography variant="caption" className={itemStyles.dateText}>
                    [Location and owner detail panels — coming soon]
                  </Typography>
                </div>

                <Button variant="outlined" size="small" onClick={() => setModalEvent(null)}>
                  Close
                </Button>
              </Stack>
            )}
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
