import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Link {
  href: string;
  rel: string;
  method: string;
}

interface ServerInfo {
  context: string;
  id: string;
  title: string;
  version: {
    instance: string;
    model: string;
  };
  created: string;
  base: string;
  security: string;
  links: Link[];
}

interface EndpointResult {
  url: string;
  data: any;
  method: string;
  fetchedAt: string;
}

interface EndpointData {
  [key: string]: EndpointResult;
}

interface ServerState {
  serverUrl: string;
  serverInfo: ServerInfo | null;
  endpointData: EndpointData;
  loading: boolean;
  error: string | null;
}

const initialState: ServerState = {
  serverUrl: '',
  serverInfo: null,
  endpointData: {},
  loading: false,
  error: null,
};

// Async thunk để fetch server info
export const discoverServer = createAsyncThunk(
  'server/discover',
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch server info');
      }
      const data = await response.json();
      return { url, data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk để fetch tất cả endpoints
export const fetchAllEndpoints = createAsyncThunk(
  'server/fetchAllEndpoints',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { server: ServerState };
    const { serverUrl, serverInfo } = state.server;

    if (!serverInfo || !serverInfo.links) {
      return rejectWithValue('No server info available');
    }

    try {
      const results: EndpointData = {};

      await Promise.all(
        serverInfo.links.map(async (link) => {
          try {
            const fullUrl = `${serverUrl}${link.href}`;

            // Special handling for /picture endpoint
            if (link.rel === 'picture') {
              const response = await fetch(fullUrl);
              if (response.ok) {
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);

                results[link.rel] = {
                  url: fullUrl,
                  data: {
                    objectUrl,
                    contentType: response.headers.get('Content-Type') || 'image/jpeg',
                    filename: 'device-image.jpg',
                  },
                  method: link.method,
                  fetchedAt: new Date().toISOString(),
                };
              }
            } else {
              // JSON endpoints - Only fetch GET methods
              if (link.method === 'GET') {
                const response = await fetch(fullUrl);
                if (response.ok) {
                  const data = await response.json();
                  results[link.rel] = {
                    url: fullUrl,
                    data,
                    method: link.method,
                    fetchedAt: new Date().toISOString(),
                  };
                }
              } else {
                // Store POST/PUT/DELETE endpoints info without fetching
                results[link.rel] = {
                  url: fullUrl,
                  data: null,
                  method: link.method,
                  fetchedAt: new Date().toISOString(),
                };
              }
            }
          } catch (err) {
            console.error(`Failed to fetch ${link.href}:`, err);
          }
        })
      );

      return results;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    clearServerData: (state) => {
      // Revoke object URLs trước khi clear
      Object.values(state.endpointData).forEach(endpoint => {
        if (endpoint.data?.objectUrl) {
          URL.revokeObjectURL(endpoint.data.objectUrl);
        }
      });

      state.serverInfo = null;
      state.endpointData = {};
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Discover server
      .addCase(discoverServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(discoverServer.fulfilled, (state, action) => {
        state.loading = false;
        state.serverUrl = action.payload.url;
        state.serverInfo = action.payload.data;
      })
      .addCase(discoverServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch all endpoints
      .addCase(fetchAllEndpoints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEndpoints.fulfilled, (state, action) => {
        state.loading = false;
        state.endpointData = action.payload;
      })
      .addCase(fetchAllEndpoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearServerData, setError } = serverSlice.actions;
export default serverSlice.reducer;