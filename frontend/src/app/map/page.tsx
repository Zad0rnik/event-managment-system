'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Map as MapIcon } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { useEvents } from '@/hooks';
import { Category, categoryLabels, EventsQueryParams } from '@/types';

const EventMap = dynamic(
  () => import('@/components/map/EventMap').then((mod) => mod.EventMap),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        variant="rectangular"
        sx={{ width: '100%', height: '100%', borderRadius: 2 }}
      />
    ),
  }
);

export default function MapViewPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filters, setFilters] = useState<EventsQueryParams>({
    limit: 100,
  });

  const { data, isLoading, isError, error } = useEvents(filters);

  const eventsWithCoords = data?.data.filter(
    (e) => e.latitude != null && e.longitude != null
  );

  const handleCategoryChange = (value: string) => {
    setFilters({
      ...filters,
      category: value as Category | undefined,
    });
  };

  return (
    <Container maxWidth="xl" sx={{ height: 'calc(100vh - 140px)' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #e2e8f0, #818cf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <MapIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            Map View
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore events on the map
            {eventsWithCoords && (
              <Chip
                label={`${eventsWithCoords.length} events with location`}
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filters.category || ''}
            label="Filter by Category"
            onChange={(e) => handleCategoryChange(e.target.value)}
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {Object.values(Category).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {categoryLabels[cat]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error
            ? error.message
            : 'Failed to load events. Please try again.'}
        </Alert>
      )}

      <Paper
        sx={{
          height: 'calc(100% - 100px)',
          overflow: 'hidden',
          borderRadius: 3,
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            sx={{ width: '100%', height: '100%' }}
          />
        ) : data?.data && data.data.length > 0 ? (
          <EventMap events={data.data} />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <MapIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No events to display</Typography>
            <Typography variant="body2">
              Events with location coordinates will appear here
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

