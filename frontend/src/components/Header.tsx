// src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  sidebarWidth: number;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen, sidebarWidth }) => {
  const { isLoggedIn, toggleLogin } = useAuth();

  return (
    <AppBar
      position="static"
      sx={{
        ml: sidebarOpen ? `${sidebarWidth}px` : 0,
        width: sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
      }}
    >
      <Toolbar>
        {isLoggedIn && (
          <IconButton edge="start" color="inherit" onClick={onToggleSidebar}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit" onClick={toggleLogin}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;