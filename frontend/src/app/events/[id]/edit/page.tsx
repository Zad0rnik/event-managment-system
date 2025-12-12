'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { useEvent, useUpdateEvent } from '@/hooks';
import { EventForm } from '@/components/events';
import { UpdateEventInput } from '@/types';

interface EditEventPageProps {
  params: { id: string };
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { data: event, isLoading, isError, error } = useEvent(params.id);
  const updateEvent = useUpdateEvent();

  const handleSubmit = async (data: UpdateEventInput) => {
    try {
      await updateEvent.mutateAsync({
        id: params.id,
        event: {
          ...data,
          latitude: data.latitude ?? undefined,
          longitude: data.longitude ?? undefined,
        },
      });
      enqueueSnackbar('Event updated successfully!', { variant: 'success' });
      router.push(`/events/${params.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={100} height={40} />
          <Skeleton variant="text" sx={{ fontSize: '2.5rem', width: '60%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%' }} />
        </Box>
        <Paper sx={{ p: 4 }}>
          <Skeleton variant="rectangular" height={400} />
        </Paper>
      </Container>
    );
  }

  if (isError || !event) {
    return (
      <Container maxWidth="md">
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

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href={`/events/${params.id}`}
          startIcon={<ArrowBack />}
          color="inherit"
          sx={{ mb: 2 }}
        >
          Back to Event
        </Button>
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
          }}
        >
          Edit Event
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update the event details below
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(26, 26, 46, 0.7) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          isLoading={updateEvent.isPending}
        />
      </Paper>
    </Container>
  );
}

