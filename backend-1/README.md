### Run project

```bash
npm run dev
```

### Swagger-UI doccuments

```bash
eg: http://localhost:3001/api-docs

```

### Realtime data via websocket, flow

[socketPublisher.js]
⮕ Redis PUB "sensor:temperature"
  * Every 1 second, send 1 message to Redis Pub/Sub channel sensor:*
  * Format: { value, timestamp }

[realtime-server.js]
⮕ Redis SUB "sensor:*" 
⮕ Cache into Redis "latest:*"
⮕ Send to Socket.IO clients
⮕ Update latestData (RAM)
  * Get data from Redis
  * Update:
  * Redis key latest:type (for REST API fallback)
  * Global variable latestData in RAM
  * Send via socket.io to each subscribed client(type)

[dataController.js]
⮕ Read from latestData (RAM) ⮕ return JSON
  * Returns latest sensor data when client calls REST API (/api/data)
  * For frontend or non-WebSocket apps (server.js handle this, for testing only)

[Frontend]
⮕ WebSocket realtime update
⮕ REST API fallback (/api/data)
  * Send subscription to server
  * Receive realtime data and plot graph
  * If no socket connection (or first time) → use REST /api/data