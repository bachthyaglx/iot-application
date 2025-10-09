import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { discoverServer, fetchAllEndpoints } from '../store/serverSlice';

interface ServerDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FetchHistoryItem {
  url: string;
  status: 'success' | 'error';
  timestamp: string;
  title?: string;
}

const HISTORY_KEY = 'server_fetch_history';
const MAX_HISTORY = 10;
const IMAGE_FETCH_TIMEOUT = 5000;

const ServerDialog: React.FC<ServerDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.server);
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState<FetchHistoryItem[]>([]);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const [fetchingImages, setFetchingImages] = useState<Set<string>>(new Set());

  // Load history from localStorage only once
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // Memoized function to get image endpoint
  const getImageEndpoint = useCallback((url: string): string => {
    const base = url.replace(/\/api\/?$/, '');
    return `${base}/api/picture`;
  }, []);

  // Optimized image fetching with timeout and abort controller
  const fetchImage = useCallback(async (url: string): Promise<void> => {
    const imageEndpoint = getImageEndpoint(url);

    if (imageCache[imageEndpoint] || fetchingImages.has(imageEndpoint)) {
      return;
    }

    setFetchingImages(prev => new Set(prev).add(imageEndpoint));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT);

    try {
      const response = await fetch(imageEndpoint, { signal: controller.signal });
      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageCache(prev => ({ ...prev, [imageEndpoint]: objectUrl }));
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Failed to fetch image:', err);
      }
    } finally {
      clearTimeout(timeoutId);
      setFetchingImages(prev => {
        const next = new Set(prev);
        next.delete(imageEndpoint);
        return next;
      });
    }
  }, [imageCache, fetchingImages, getImageEndpoint]);

  // Batch fetch images for history - only for successful items
  useEffect(() => {
    if (!open || history.length === 0) return;

    const fetchImagesInBatches = async () => {
      const visibleItems = history.slice(0, 5).filter(item => item.status === 'success');
      await Promise.all(visibleItems.map(item => fetchImage(item.url)));

      if (history.length > 5) {
        setTimeout(() => {
          const remainingItems = history.slice(5).filter(item => item.status === 'success');
          remainingItems.forEach(item => fetchImage(item.url));
        }, 500);
      }
    };

    fetchImagesInBatches();
  }, [open, history, fetchImage]);

  // Optimized add to history
  const addToHistory = useCallback((url: string, status: 'success' | 'error', title?: string) => {
    setHistory(prevHistory => {
      const newItem: FetchHistoryItem = {
        url,
        status,
        timestamp: new Date().toISOString(),
        title,
      };

      const updatedHistory = [newItem, ...prevHistory];
      const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY);

      requestIdleCallback(() => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
      });

      return trimmedHistory;
    });
  }, []);

  // Helper function to try fetch with a specific URL
  const tryFetch = useCallback(async (url: string): Promise<{ success: boolean; result?: any; title?: string }> => {
    try {
      const result = await dispatch(discoverServer(url)).unwrap();

      if (result) {
        const title = result.data?.title || result.data?.id || undefined;

        await Promise.all([
          dispatch(fetchAllEndpoints()).unwrap(),
          fetchImage(url)
        ]);

        return { success: true, result, title };
      }

      return { success: false };
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err);
      return { success: false };
    }
  }, [dispatch, fetchImage]);

  // Main search handler with auto-retry logic
  const handleSearch = useCallback(async (url?: string) => {
    let urlToFetch = url || inputUrl;
    if (!urlToFetch) return;

    const hasProtocol = urlToFetch.startsWith('http://') || urlToFetch.startsWith('https://');

    // If user explicitly specified protocol, use it
    if (hasProtocol) {
      const result = await tryFetch(urlToFetch);

      if (result.success) {
        addToHistory(urlToFetch, 'success', result.title);
        setInputUrl('');
        onClose();
      } else {
        addToHistory(urlToFetch, 'error');
      }
      return;
    }

    // If no protocol specified, try both http and https
    console.log('No protocol specified, trying both http:// and https://');

    // Try http:// first (common for local development)
    const httpUrl = `http://${urlToFetch}`;
    console.log('Trying HTTP:', httpUrl);
    const httpResult = await tryFetch(httpUrl);

    if (httpResult.success) {
      addToHistory(httpUrl, 'success', httpResult.title);
      setInputUrl('');
      onClose();
      return;
    }

    // If http failed, try https://
    const httpsUrl = `https://${urlToFetch}`;
    console.log('HTTP failed, trying HTTPS:', httpsUrl);
    const httpsResult = await tryFetch(httpsUrl);

    if (httpsResult.success) {
      addToHistory(httpsUrl, 'success', httpsResult.title);
      setInputUrl('');
      onClose();
      return;
    }

    // Both failed, save the http version as error
    console.error('Both HTTP and HTTPS failed');
    addToHistory(httpUrl, 'error');
  }, [inputUrl, tryFetch, addToHistory, onClose]);

  // Row click handler
  const handleRowClick = useCallback((item: FetchHistoryItem) => {
    handleSearch(item.url);
  }, [handleSearch]);

  // Handle Enter key
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputUrl && !loading) {
      handleSearch();
    }
  }, [inputUrl, loading, handleSearch]);

  // Memoized date formatter
  const formatDateTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Memoized image URL getter
  const getImageUrl = useCallback((url: string): string | undefined => {
    return imageCache[getImageEndpoint(url)];
  }, [imageCache, getImageEndpoint]);

  // Memoized table height
  const tableMaxHeight = useMemo(() => {
    return history.length > 5 ? 500 : 'auto';
  }, [history.length]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
      keepMounted={false}
    >
      <DialogTitle>Server Dialog</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Server URL"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          disabled={loading}
          size="small"
          onKeyPress={handleKeyPress}
          autoComplete="off"
          autoFocus
          sx={{ mt: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {history.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              mt: 3,
              maxHeight: tableMaxHeight,
              border: '1px solid #e0e0e0',
              '& .MuiTable-root': {
                minWidth: 650
              }
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: 100, bgcolor: 'background.paper' }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>
                    Server
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: 80, textAlign: 'center', bgcolor: 'background.paper' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: 140, bgcolor: 'background.paper' }}>
                    Date/Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item, index) => {
                  const imageUrl = item.status === 'success' ? getImageUrl(item.url) : undefined;

                  return (
                    <TableRow
                      key={`${item.timestamp}-${index}`}
                      hover
                      onClick={() => handleRowClick(item)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        height: 92 // Fixed height for all rows (60px image + 2*16px padding)
                      }}
                    >
                      <TableCell sx={{ py: 2, height: 92 }}>
                        {item.status === 'success' && imageUrl ? (
                          <Avatar
                            src={imageUrl}
                            variant="rounded"
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: 'grey.300'
                            }}
                          >
                            ?
                          </Avatar>
                        ) : (
                          <Box sx={{ width: 60, height: 60 }} />
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 300,
                          py: 2,
                          height: 92
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: 500,
                              color: 'text.primary'
                            }}
                            title={item.url}
                          >
                            {item.url}
                          </Typography>
                          {item.title && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: 'block',
                                mt: 0.5
                              }}
                            >
                              {item.title}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', py: 2, height: 92 }}>
                        {item.status === 'success' ? (
                          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 28 }} />
                        ) : (
                          <CancelIcon sx={{ color: 'error.main', fontSize: 28 }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', py: 2, height: 92 }}>
                        {formatDateTime(item.timestamp)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          onClick={() => handleSearch()}
          disabled={loading || !inputUrl}
        >
          {loading ? 'Connecting...' : 'Connect'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServerDialog;