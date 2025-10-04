### Todo list:

- [x] React + Vite + TypeScript + Material-UI libraries initialization
- [x] Dynamic table with vertical scale
- [x] Backend data of general information
- [x] Backend data of image/pic
- [ ] Frontend fetching data and CSS for main page
- [ ] Authentication & Authorization 
- [ ] Dynamic sidebar when sign-in
- [ ] Dynamic list contents for menu sidebar
- [ ] Backend data of menu sidebar
- [ ] Test other data on menu sidebar
- [ ] Test app locally (npm + Docker)
- [ ] Test deployment on Kubernetes (depl/ingr/svc + Prometheus + Grafana)
- [ ] Production 

### Architect used:
* Keep REST/OpenAPI for static + control logic
* Separate realtime using Redis Pub/Sub + WebSocket layer
            
![image](https://github.com/user-attachments/assets/d3db8611-6c94-4d49-b00f-466922ef09c2)

or

                                         +-------------------------------+
                                         |         React Frontend        |
                                         |-------------------------------|
                                         |  - REST (SWR/Axios)           |
                                         |  - socket.io-client           |
                                         |  - listen 'sensor:update'     |
                                         +---------------▲---------------+
                                                         |
                                               [ connect socket.io ]
                                               [ show realtime chart ]
                                                         |
                               +-------------------------+-------------------------+
                               |            Unified Backend Server                |
                               |--------------------------------------------------|
                               | - REST API (OpenAPI)                             |
                               | - Generate fake data mỗi 1s                      |
                               |     setInterval(...)                             |
                               | - Redis.publish('sensor:update', data)           |
                               |                                                  |
                               | - Redis.subscribe('sensor:update')               |
                               | - socket.io.emit('sensor:update', data)          |
                               |                                                  |
                               | - socket.io-redis-adapter (optional for scale)   |
                               +-------------------------▲------------------------+
                                                         |
                                                 +-------+-------+
                                                 |     Redis     |
                                                 |   Pub/Sub     |
                                                 +---------------+

