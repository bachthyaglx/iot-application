// src/components/Header.tsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StorageIcon from '@mui/icons-material/Storage';
import { useAuth } from '../contexts/AuthContext';
import ServerDiscoveryDialog from './ServerDiscoveryDialog';
import LoginDialog from './LoginDialog';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  sidebarWidth: number;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen, sidebarWidth }) => {
  const { isLoggedIn, logout } = useAuth();
  const [serverDialogOpen, setServerDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Khi click Login/Logout
  const handleLoginClick = () => {
    if (isLoggedIn) {
      logout(); // Xóa token + set isLoggedIn = false
    } else {
      setLoginDialogOpen(true);
    }
  };

  return (
    <>
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

          {/* Server Discovery Icon */}
          <Tooltip title="Connect to Server">
            <IconButton
              color="inherit"
              onClick={() => setServerDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              <StorageIcon />
            </IconButton>
          </Tooltip>

          <Button color="inherit" onClick={handleLoginClick}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Server Discovery Dialog */}
      <ServerDiscoveryDialog
        open={serverDialogOpen}
        onClose={() => setServerDialogOpen(false)}
      />

      {/* Login Dialog */}
      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
    </>
  );
};

export default Header;
