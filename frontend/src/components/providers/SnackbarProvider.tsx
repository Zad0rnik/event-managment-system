'use client';

import { SnackbarProvider as NotistackProvider } from 'notistack';
import { type ReactNode } from 'react';

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({
  children,
}: SnackbarProviderProps) {
  return (
    <NotistackProvider
      maxSnack={3}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {children}
    </NotistackProvider>
  );
}
