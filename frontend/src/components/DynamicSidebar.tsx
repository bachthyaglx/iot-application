// src/components/DynamicSidebar.tsx
import { Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
}

export default function DynamicSidebar({ open, onClose, width }: SidebarProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="persistent"
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
      <List sx={{ pt: 2 }}>
        <ListItem><ListItemText primary="Dashboard" /></ListItem>
        <ListItem><ListItemText primary="Settings" /></ListItem>
        <ListItem><ListItemText primary="Profile" /></ListItem>
      </List>
    </Drawer>
  );
}