'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Event as EventIcon,
  Map as MapIcon,
  Add as AddIcon,
  CalendarMonth,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Events', href: '/', icon: <EventIcon /> },
  { label: 'Map View', href: '/map', icon: <MapIcon /> },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <CalendarMonth sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h6" fontWeight={700}>
          EventHub
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              onClick={handleDrawerToggle}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(129, 140, 248, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(129, 140, 248, 0.25)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ px: 2, pt: 2 }}>
        <Button
          component={Link}
          href="/events/new"
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleDrawerToggle}
        >
          Create Event
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <CalendarMonth
              sx={{ color: 'primary.main', fontSize: 32 }}
            />
            <Typography
              variant="h6"
              component="div"
              fontWeight={700}
              sx={{
                background:
                  'linear-gradient(135deg, #818cf8, #f472b6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              EventHub
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {!isMobile && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    backgroundColor:
                      pathname === item.href
                        ? 'rgba(129, 140, 248, 0.15)'
                        : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(129, 140, 248, 0.25)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                component={Link}
                href="/events/new"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ ml: 2 }}
              >
                Create Event
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
