import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { discoverServer, fetchAllEndpoints } from '../store/serverSlice';

interface ServerDiscoveryDialogProps {
  open: boolean;
  onClose: () => void;
}

const ServerDiscoveryDialog: React.FC<ServerDiscoveryDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { serverUrl, loading, error } = useAppSelector((state) => state.server);
  const [inputUrl, setInputUrl] = useState(serverUrl || 'http://localhost:3001/api');

  const handleSearch = async () => {
    try {
      // Fetch server info
      const result = await dispatch(discoverServer(inputUrl)).unwrap();

      // Nếu thành công, fetch tất cả endpoints
      if (result) {
        await dispatch(fetchAllEndpoints()).unwrap();
        // Đóng dialog sau khi fetch xong
        onClose();
      }
    } catch (err) {
      console.error('Failed to discover server:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle>🔍 Connect to Server</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField
            fullWidth
            label="Server URL"
            placeholder="http://localhost:3001/api"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={loading}
            size="small"
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            onClick={handleSearch}
            disabled={loading || !inputUrl}
            sx={{ minWidth: '120px' }}
          >
            {loading ? 'Connecting...' : 'Connect'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServerDiscoveryDialog;