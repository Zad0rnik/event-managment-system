'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import Link from 'next/link';
import { Category, categoryLabels, Event } from '@/types';

const eventSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  date: z.string().min(1, 'Date is required'),
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(500, 'Location must be less than 500 characters'),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .nullable()
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .nullable()
    .optional(),
  category: z.nativeEnum(Category),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
}

export function EventForm({ initialData, onSubmit, isLoading }: EventFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          date: format(new Date(initialData.date), "yyyy-MM-dd'T'HH:mm"),
          location: initialData.location,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          category: initialData.category,
        }
      : {
          title: '',
          description: '',
          date: '',
          location: '',
          latitude: null,
          longitude: null,
          category: Category.OTHER,
        },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Event Title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                placeholder="Enter a descriptive title for your event"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date & Time"
                type="datetime-local"
                fullWidth
                error={!!errors.date}
                helperText={errors.date?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select {...field} label="Category" MenuProps={{ disableScrollLock: true }}>
                  {Object.values(Category).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <FormHelperText>{errors.category.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Location"
                fullWidth
                error={!!errors.location}
                helperText={errors.location?.message}
                placeholder="Enter the event location (e.g., Convention Center, NYC)"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="latitude"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? null : parseFloat(val));
                }}
                label="Latitude"
                type="number"
                fullWidth
                error={!!errors.latitude}
                helperText={errors.latitude?.message || 'Optional: for map display'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">°</InputAdornment>
                  ),
                }}
                inputProps={{ step: 'any', min: -90, max: 90 }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="longitude"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? null : parseFloat(val));
                }}
                label="Longitude"
                type="number"
                fullWidth
                error={!!errors.longitude}
                helperText={errors.longitude?.message || 'Optional: for map display'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">°</InputAdornment>
                  ),
                }}
                inputProps={{ step: 'any', min: -180, max: 180 }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={6}
                error={!!errors.description}
                helperText={errors.description?.message}
                placeholder="Describe your event in detail..."
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Event' : 'Create Event'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
