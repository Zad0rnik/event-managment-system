import type { Metadata } from 'next';
import { Box } from '@mui/material';
import {
  ThemeProvider,
  QueryProvider,
  SnackbarProvider,
} from '@/components/providers';
import { Navbar } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'EventHub - Event Management System',
  description:
    'Discover and manage events with EventHub. Create, browse, and explore events on an interactive map.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>
        <QueryProvider>
          <ThemeProvider>
            <SnackbarProvider>
              <Box
                sx={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Navbar />
                <Box component="main" sx={{ flex: 1, py: 3 }}>
                  {children}
                </Box>
              </Box>
            </SnackbarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
