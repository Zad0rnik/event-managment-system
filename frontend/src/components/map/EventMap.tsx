'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { Box, Typography, Chip, Button } from '@mui/material';
import { CalendarMonth, LocationOn } from '@mui/icons-material';
import { format } from 'date-fns';
import Link from 'next/link';
import { Event, categoryLabels, categoryColors } from '@/types';
import 'leaflet/dist/leaflet.css';

interface EventMapProps {
  events: Event[];
}

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapBoundsHandler({ events }: { events: Event[] }) {
  const map = useMap();

  const eventsWithCoords = events.filter(
    (e) => e.latitude != null && e.longitude != null
  );

  if (eventsWithCoords.length > 0) {
    const bounds = new LatLngBounds(
      eventsWithCoords.map((e) => [e.latitude!, e.longitude!])
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }

  return null;
}

export function EventMap({ events }: EventMapProps) {
  const eventsWithCoords = events.filter(
    (e) => e.latitude != null && e.longitude != null
  );

  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const defaultZoom = 4;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {eventsWithCoords.length > 0 && (
        <MapBoundsHandler events={eventsWithCoords} />
      )}

      {eventsWithCoords.map((event) => (
        <Marker
          key={event.id}
          position={[event.latitude!, event.longitude!]}
          icon={customIcon}
        >
          <Popup maxWidth={280} minWidth={280}>
            <Box
              sx={{
                p: 2,
                bgcolor: '#1a1a2e',
                width: 280,
                borderRadius: '12px',
              }}
            >
              <Chip
                label={categoryLabels[event.category]}
                size="small"
                sx={{
                  backgroundColor: categoryColors[event.category],
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  mb: 1,
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#e2e8f0',
                  mb: 1,
                  lineHeight: 1.3,
                }}
              >
                {event.title}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <CalendarMonth sx={{ fontSize: 14, color: '#818cf8' }} />
                <Typography variant="caption" sx={{ color: '#c4c9d4' }}>
                  {format(new Date(event.date), 'MMM d, yyyy • h:mm a')}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1.5,
                }}
              >
                <LocationOn sx={{ fontSize: 14, color: '#f472b6' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#c4c9d4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {event.location}
                </Typography>
              </Box>
              <Button
                component={Link}
                href={`/events/${event.id}`}
                variant="contained"
                size="small"
                fullWidth
              >
                View Details
              </Button>
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
