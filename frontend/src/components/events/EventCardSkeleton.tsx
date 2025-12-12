'use client';

import { Card, CardContent, Skeleton, Box } from '@mui/material';

export function EventCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ pt: 4 }}>
        <Skeleton
          variant="rectangular"
          width={80}
          height={24}
          sx={{ borderRadius: 2, mb: 2 }}
        />
        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: '1.25rem', width: '80%', mb: 2 }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
          }}
        >
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton
            variant="text"
            sx={{ fontSize: '0.875rem', width: '60%' }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton
            variant="text"
            sx={{ fontSize: '0.875rem', width: '70%' }}
          />
        </Box>
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: '0.875rem', width: '50%' }}
        />
      </CardContent>
    </Card>
  );
}
