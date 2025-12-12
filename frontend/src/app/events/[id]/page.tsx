'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  CalendarMonth,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack,
  Star,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useEvent, useSimilarEvents, useDeleteEvent } from '@/hooks';
import { categoryLabels, categoryColors } from '@/types';
import { ConfirmDialog } from '@/components/events';

const EventMiniMap = dynamic(
  () =>
    import('@/components/map/EventMiniMap').then(
      (mod) => mod.EventMiniMap
    ),
  { ssr: false }
);

interface EventPageProps {
  params: { id: string };
}

export default function EventDetailsPage({ params }: EventPageProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useEvent(params.id);
  const { data: similarEvents, isLoading: similarLoading } =
    useSimilarEvents(params.id, 4);
  const deleteEvent = useDeleteEvent();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEvent.mutateAsync(params.id);
      enqueueSnackbar('Event deleted successfully', {
        variant: 'success',
      });
      router.push('/');
    } catch {
      enqueueSnackbar('Failed to delete event', { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={100} height={40} />
        </Box>
        <Paper sx={{ p: 4 }}>
          <Skeleton
            variant="rectangular"
            width={100}
            height={32}
            sx={{ mb: 2 }}
          />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton
            variant="text"
            sx={{ fontSize: '1rem', width: '60%' }}
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: '1rem', width: '50%', mt: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ mt: 3 }}
          />
        </Paper>
      </Container>
    );
  }

  if (isError || !event) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error ? error.message : 'Event not found'}
        </Alert>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  const formattedDate = format(
    new Date(event.date),
    'EEEE, MMMM d, yyyy'
  );
  const formattedTime = format(new Date(event.date), 'h:mm a');

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          color="inherit"
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 4,
              background:
                'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(26, 26, 46, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Chip
                label={categoryLabels[event.category]}
                sx={{
                  backgroundColor: categoryColors[event.category],
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                {event.title}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 4,
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <CalendarMonth
                  sx={{ color: 'primary.main', fontSize: 28 }}
                />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {formattedDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formattedTime}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <LocationOn
                  sx={{ color: 'secondary.main', fontSize: 28 }}
                />
                <Typography variant="body1">
                  {event.location}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              About this Event
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
            >
              {event.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                component={Link}
                href={`/events/${event.id}/edit`}
                variant="contained"
                startIcon={<EditIcon />}
              >
                Edit Event
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Delete Event
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {event.latitude && event.longitude && (
            <Paper sx={{ p: 2, mb: 3, overflow: 'hidden' }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Location
              </Typography>
              <Box
                sx={{
                  height: 200,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <EventMiniMap
                  latitude={event.latitude}
                  longitude={event.longitude}
                  title={event.title}
                />
              </Box>
            </Paper>
          )}

          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <Star sx={{ color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Similar Events
              </Typography>
            </Box>

            {similarLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={80}
                  />
                ))}
              </Box>
            ) : similarEvents && similarEvents.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {similarEvents.map((similarEvent) => (
                  <Card
                    key={similarEvent.id}
                    component={Link}
                    href={`/events/${similarEvent.id}`}
                    sx={{
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CardContent
                      sx={{ py: 2, '&:last-child': { pb: 2 } }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {similarEvent.title}
                        </Typography>
                        <Chip
                          label={`${Math.round(
                            similarEvent.similarityScore
                          )}%`}
                          size="small"
                          sx={{
                            ml: 1,
                            fontSize: '0.7rem',
                            height: 20,
                            backgroundColor:
                              'rgba(129, 140, 248, 0.2)',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <CalendarMonth sx={{ fontSize: 14 }} />
                        {format(
                          new Date(similarEvent.date),
                          'MMM d, yyyy'
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No similar events found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleteEvent.isPending}
      />
    </Container>
  );
}
