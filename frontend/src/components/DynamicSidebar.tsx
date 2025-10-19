// src/components/DynamicSidebar.tsx
import React, { useMemo } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Cable as CableIcon,
  BugReport as BugReportIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
  currentEndpoint: string | null;
  onEndpointSelect: (endpoint: string) => void;
}

// Map endpoint names to icons and display names
const endpointConfig: Record<string, { icon: React.ReactElement; label: string }> = {
  ports: { icon: <CableIcon />, label: 'Ports' },
  diagnostics: { icon: <BugReportIcon />, label: 'Diagnostics' },
  configuration: { icon: <SettingsIcon />, label: 'Configuration' },
  maintenance: { icon: <BuildIcon />, label: 'Maintenance' },
};

export default function DynamicSidebar({
  open,
  onClose,
  width,
  currentEndpoint,
  onEndpointSelect,
}: SidebarProps) {
  const { serverInfo } = useAppSelector((state) => state.server);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Extract GET endpoints from serverInfo.links (exclude identification and picture)
  const getEndpoints = useMemo(() => {
    if (!serverInfo?.links) return [];

    // Get unique GET endpoints from links, excluding identification and picture
    const endpoints = serverInfo.links
      .filter(link =>
        link.method === 'GET' &&
        link.rel !== 'identification' &&
        link.rel !== 'picture'
      )
      .map(link => link.rel)
      .filter((rel, index, self) => self.indexOf(rel) === index); // Remove duplicates

    return endpoints;
  }, [serverInfo]);

  const handleNavigate = (endpoint: string) => {
    onEndpointSelect(endpoint);
    // Auto-close on mobile after selection
    if (isMobile) {
      onClose();
    }
  };

  const handleHomeClick = () => {
    onEndpointSelect('');
    // Auto-close on mobile after selection
    if (isMobile) {
      onClose();
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={isMobile ? 'temporary' : 'persistent'}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        {/* Navigation List */}
        <List disablePadding sx={{ py: 2 }}>
          {/* Home Button */}
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={!currentEndpoint}
              onClick={handleHomeClick}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          {/* Endpoint Navigation - Only show if there are endpoints (after login) */}
          {getEndpoints.map((endpoint) => {
            const config = endpointConfig[endpoint] || {
              icon: <DashboardIcon />,
              label: endpoint.charAt(0).toUpperCase() + endpoint.slice(1),
            };

            return (
              <ListItem key={endpoint} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={currentEndpoint === endpoint}
                  onClick={() => handleNavigate(endpoint)}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {config.icon}
                  </ListItemIcon>
                  <ListItemText primary={config.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}