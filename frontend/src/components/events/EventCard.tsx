'use client';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
  CalendarMonth,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { format } from 'date-fns';
import { Event, categoryLabels, categoryColors } from '@/types';

interface EventCardProps {
  event: Event;
  onDelete?: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const formattedDate = format(
    new Date(event.date),
    'MMM d, yyyy • h:mm a'
  );

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -12,
          left: 16,
          zIndex: 1,
        }}
      >
        <Chip
          label={categoryLabels[event.category]}
          size="small"
          sx={{
            backgroundColor: categoryColors[event.category],
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            boxShadow: `0 4px 12px ${
              categoryColors[event.category]
            }66`,
          }}
        />
      </Box>
      <CardContent sx={{ pt: 4, pb: 1, flex: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            minHeight: '2.6em',
          }}
        >
          {event.title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
          }}
        >
          <CalendarMonth
            sx={{ fontSize: 18, color: 'primary.main' }}
          />
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            mb: 2,
          }}
        >
          <LocationOn
            sx={{ fontSize: 18, color: 'secondary.main', mt: 0.25 }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {event.location}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            opacity: 0.8,
          }}
        >
          {event.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ justifyContent: 'flex-end', px: 2, pb: 2, pt: 0 }}
      >
        <Tooltip title="View Details">
          <IconButton
            component={Link}
            href={`/events/${event.id}`}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Event">
          <IconButton
            component={Link}
            href={`/events/${event.id}/edit`}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'info.main' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Event">
          <IconButton
            size="small"
            onClick={() => onDelete?.(event.id)}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
