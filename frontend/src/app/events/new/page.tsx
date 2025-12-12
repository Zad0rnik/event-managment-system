'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { useCreateEvent } from '@/hooks';
import { EventForm } from '@/components/events';
import { CreateEventInput } from '@/types';

export default function CreateEventPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createEvent = useCreateEvent();

  const handleSubmit = async (data: CreateEventInput) => {
    try {
      const event = await createEvent.mutateAsync({
        ...data,
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
      });
      enqueueSnackbar('Event created successfully!', {
        variant: 'success',
      });
      router.push(`/events/${event.id}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create event';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="md">
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
          Create New Event
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the details below to create a new event
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 4,
          background:
            'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(26, 26, 46, 0.7) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <EventForm
          onSubmit={handleSubmit}
          isLoading={createEvent.isPending}
        />
      </Paper>
    </Container>
  );
}
