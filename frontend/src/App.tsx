// src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Box, Typography } from '@mui/material';

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {isLoggedIn && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <Box p={2}>
        <Typography variant="h4">Welcome to the App!</Typography>
      </Box>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

