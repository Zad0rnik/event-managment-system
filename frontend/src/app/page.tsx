'use client';

import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  Alert,
  Paper,
} from '@mui/material';
import { EventBusy } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useEvents, useDeleteEvent } from '@/hooks';
import { EventsQueryParams } from '@/types';
import {
  EventCard,
  FilterBar,
  ConfirmDialog,
  EventCardSkeleton,
} from '@/components/events';

export default function EventsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<EventsQueryParams>({
    sortBy: 'date',
    sortOrder: 'asc',
    page: 1,
    limit: 12,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(
    null
  );

  const { data, isLoading, isError, error } = useEvents(filters);
  const deleteEvent = useDeleteEvent();

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent.mutateAsync(eventToDelete);
      enqueueSnackbar('Event deleted successfully', {
        variant: 'success',
      });
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch {
      enqueueSnackbar('Failed to delete event', { variant: 'error' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
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
          Discover Events
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find and explore events happening around you
        </Typography>
      </Box>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error
            ? error.message
            : 'Failed to load events. Please try again.'}
        </Alert>
      )}

      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={viewMode === 'grid' ? 4 : 6}
              key={index}
            >
              <EventCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : data?.data.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'background.paper',
          }}
        >
          <EventBusy
            sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
          >
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search || filters.category
              ? 'Try adjusting your filters or search terms'
              : 'Be the first to create an event!'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {data?.data.map((event) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={viewMode === 'grid' ? 4 : 6}
                key={event.id}
              >
                <EventCard
                  event={event}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>

          {data && data.meta.totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
              }}
            >
              <Pagination
                count={data.meta.totalPages}
                page={data.meta.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleteEvent.isPending}
      />
    </Container>
  );
}
