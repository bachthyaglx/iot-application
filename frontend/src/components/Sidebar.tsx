// src/components/Sidebar.tsx
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        <ListItem><ListItemText primary="Dashboard" /></ListItem>
        <ListItem><ListItemText primary="Settings" /></ListItem>
        <ListItem><ListItemText primary="Profile" /></ListItem>
      </List>
    </Drawer>
  );
}
