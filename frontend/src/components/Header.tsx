// src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext'; // 👈 FIX THIS PATH IF WRONG

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { isLoggedIn, toggleLogin } = useAuth();

  return (
    <AppBar position="static">
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
