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


### Other preference:
#### Hybrid separation 
* GraphQL is great for Static part + uniform API structure
* Realtime should be separated by WebSocket layer (Redis Pub/Sub)

![image](https://github.com/user-attachments/assets/33278556-ee0e-4628-86ca-47fa5a34bec5)

### Project tree
```
iot-application
├─ backend-1
│  ├─ .env
│  ├─ .eslintignore
│  ├─ .eslintrc.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ device-1.jpg
│  ├─ README.md
│  ├─ realtime-server.js
│  ├─ server.js
│  └─ src
│     ├─ api.js
│     ├─ controllers
│     │  ├─ authController.js
│     │  ├─ dataController.js
│     │  ├─ deviceInfoController.js
│     │  ├─ pictureController.js
│     │  └─ rootController.js
│     ├─ data-simulator
│     │  ├─ cache.js
│     │  ├─ generator.js
│     │  └─ types.js
│     ├─ models
│     │  ├─ data.js
│     │  ├─ info.js
│     │  ├─ picture.js
│     │  └─ user.js
│     ├─ open-api
│     │  ├─ swagger.json
│     │  └─ swagger.yaml
│     ├─ seeds
│     │  ├─ create_admin.js
│     │  ├─ create_info.js
│     │  └─ upload_picture.js
│     ├─ socket
│     │  └─ socketPublisher.js
│     └─ utils
│        ├─ config.js
│        ├─ genSwagger.js
│        ├─ logger.js
│        ├─ middleware.js
│        ├─ mongo.js
│        ├─ redisClient.js
│        └─ swaggerOptions.js
├─ backend-2
│  ├─ .env
│  ├─ main.py
│  ├─ models
│  │  └─ schemas.py
│  ├─ README.md
│  ├─ requirements.txt
│  ├─ routes
│  │  ├─ auth.py
│  │  ├─ data.py
│  │  ├─ information.py
│  │  ├─ picture.py
│  │  └─ root.py
│  ├─ seeds
│  │  ├─ create_admin.py
│  │  ├─ create_deviceinfo.py
│  │  └─ upload_picture.py
│  ├─ services
│  │  ├─ redis.py
│  │  └─ supabase.py
│  ├─ static
│  │  └─ device-2.jpg
│  ├─ utils
│  │  ├─ cache.py
│  │  └─ jwt_auth.py
│  └─ venv
│     ├─ Include
│     ├─ Lib
│     │  └─ site-packages
│     │     ├─ aiohappyeyeballs
│     │     │  ├─ impl.py
│     │     │  ├─ py.typed
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ _staggered.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ impl.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ _staggered.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ aiohappyeyeballs-2.6.1.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ aiohttp
│     │     │  ├─ .hash
│     │     │  │  ├─ hdrs.py.hash
│     │     │  │  ├─ _cparser.pxd.hash
│     │     │  │  ├─ _find_header.pxd.hash
│     │     │  │  ├─ _http_parser.pyx.hash
│     │     │  │  └─ _http_writer.pyx.hash
│     │     │  ├─ abc.py
│     │     │  ├─ base_protocol.py
│     │     │  ├─ client.py
│     │     │  ├─ client_exceptions.py
│     │     │  ├─ client_proto.py
│     │     │  ├─ client_reqrep.py
│     │     │  ├─ client_ws.py
│     │     │  ├─ compression_utils.py
│     │     │  ├─ connector.py
│     │     │  ├─ cookiejar.py
│     │     │  ├─ formdata.py
│     │     │  ├─ hdrs.py
│     │     │  ├─ helpers.py
│     │     │  ├─ http.py
│     │     │  ├─ http_exceptions.py
│     │     │  ├─ http_parser.py
│     │     │  ├─ http_websocket.py
│     │     │  ├─ http_writer.py
│     │     │  ├─ log.py
│     │     │  ├─ multipart.py
│     │     │  ├─ payload.py
│     │     │  ├─ payload_streamer.py
│     │     │  ├─ py.typed
│     │     │  ├─ pytest_plugin.py
│     │     │  ├─ resolver.py
│     │     │  ├─ streams.py
│     │     │  ├─ tcp_helpers.py
│     │     │  ├─ test_utils.py
│     │     │  ├─ tracing.py
│     │     │  ├─ typedefs.py
│     │     │  ├─ web.py
│     │     │  ├─ web_app.py
│     │     │  ├─ web_exceptions.py
│     │     │  ├─ web_fileresponse.py
│     │     │  ├─ web_log.py
│     │     │  ├─ web_middlewares.py
│     │     │  ├─ web_protocol.py
│     │     │  ├─ web_request.py
│     │     │  ├─ web_response.py
│     │     │  ├─ web_routedef.py
│     │     │  ├─ web_runner.py
│     │     │  ├─ web_server.py
│     │     │  ├─ web_urldispatcher.py
│     │     │  ├─ web_ws.py
│     │     │  ├─ worker.py
│     │     │  ├─ _cparser.pxd
│     │     │  ├─ _find_header.pxd
│     │     │  ├─ _headers.pxi
│     │     │  ├─ _http_parser.cp312-win_amd64.pyd
│     │     │  ├─ _http_parser.pyx
│     │     │  ├─ _http_writer.cp312-win_amd64.pyd
│     │     │  ├─ _http_writer.pyx
│     │     │  ├─ _websocket
│     │     │  │  ├─ .hash
│     │     │  │  │  ├─ mask.pxd.hash
│     │     │  │  │  ├─ mask.pyx.hash
│     │     │  │  │  └─ reader_c.pxd.hash
│     │     │  │  ├─ helpers.py
│     │     │  │  ├─ mask.cp312-win_amd64.pyd
│     │     │  │  ├─ mask.pxd
│     │     │  │  ├─ mask.pyx
│     │     │  │  ├─ models.py
│     │     │  │  ├─ reader.py
│     │     │  │  ├─ reader_c.cp312-win_amd64.pyd
│     │     │  │  ├─ reader_c.pxd
│     │     │  │  ├─ reader_c.py
│     │     │  │  ├─ reader_py.py
│     │     │  │  ├─ writer.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ helpers.cpython-312.pyc
│     │     │  │     ├─ models.cpython-312.pyc
│     │     │  │     ├─ reader.cpython-312.pyc
│     │     │  │     ├─ reader_c.cpython-312.pyc
│     │     │  │     ├─ reader_py.cpython-312.pyc
│     │     │  │     ├─ writer.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ abc.cpython-312.pyc
│     │     │     ├─ base_protocol.cpython-312.pyc
│     │     │     ├─ client.cpython-312.pyc
│     │     │     ├─ client_exceptions.cpython-312.pyc
│     │     │     ├─ client_proto.cpython-312.pyc
│     │     │     ├─ client_reqrep.cpython-312.pyc
│     │     │     ├─ client_ws.cpython-312.pyc
│     │     │     ├─ compression_utils.cpython-312.pyc
│     │     │     ├─ connector.cpython-312.pyc
│     │     │     ├─ cookiejar.cpython-312.pyc
│     │     │     ├─ formdata.cpython-312.pyc
│     │     │     ├─ hdrs.cpython-312.pyc
│     │     │     ├─ helpers.cpython-312.pyc
│     │     │     ├─ http.cpython-312.pyc
│     │     │     ├─ http_exceptions.cpython-312.pyc
│     │     │     ├─ http_parser.cpython-312.pyc
│     │     │     ├─ http_websocket.cpython-312.pyc
│     │     │     ├─ http_writer.cpython-312.pyc
│     │     │     ├─ log.cpython-312.pyc
│     │     │     ├─ multipart.cpython-312.pyc
│     │     │     ├─ payload.cpython-312.pyc
│     │     │     ├─ payload_streamer.cpython-312.pyc
│     │     │     ├─ pytest_plugin.cpython-312.pyc
│     │     │     ├─ resolver.cpython-312.pyc
│     │     │     ├─ streams.cpython-312.pyc
│     │     │     ├─ tcp_helpers.cpython-312.pyc
│     │     │     ├─ test_utils.cpython-312.pyc
│     │     │     ├─ tracing.cpython-312.pyc
│     │     │     ├─ typedefs.cpython-312.pyc
│     │     │     ├─ web.cpython-312.pyc
│     │     │     ├─ web_app.cpython-312.pyc
│     │     │     ├─ web_exceptions.cpython-312.pyc
│     │     │     ├─ web_fileresponse.cpython-312.pyc
│     │     │     ├─ web_log.cpython-312.pyc
│     │     │     ├─ web_middlewares.cpython-312.pyc
│     │     │     ├─ web_protocol.cpython-312.pyc
│     │     │     ├─ web_request.cpython-312.pyc
│     │     │     ├─ web_response.cpython-312.pyc
│     │     │     ├─ web_routedef.cpython-312.pyc
│     │     │     ├─ web_runner.cpython-312.pyc
│     │     │     ├─ web_server.cpython-312.pyc
│     │     │     ├─ web_urldispatcher.cpython-312.pyc
│     │     │     ├─ web_ws.cpython-312.pyc
│     │     │     ├─ worker.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ aiohttp-3.11.18.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.txt
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ aiosignal
│     │     │  ├─ py.typed
│     │     │  ├─ __init__.py
│     │     │  ├─ __init__.pyi
│     │     │  └─ __pycache__
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ aiosignal-1.3.2.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ annotated_types
│     │     │  ├─ py.typed
│     │     │  ├─ test_cases.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ test_cases.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ annotated_types-0.7.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ anyio
│     │     │  ├─ abc
│     │     │  │  ├─ _eventloop.py
│     │     │  │  ├─ _resources.py
│     │     │  │  ├─ _sockets.py
│     │     │  │  ├─ _streams.py
│     │     │  │  ├─ _subprocesses.py
│     │     │  │  ├─ _tasks.py
│     │     │  │  ├─ _testing.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ _eventloop.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _eventloop.cpython-312.pyc
│     │     │  │     ├─ _resources.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _resources.cpython-312.pyc
│     │     │  │     ├─ _sockets.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _sockets.cpython-312.pyc
│     │     │  │     ├─ _streams.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _streams.cpython-312.pyc
│     │     │  │     ├─ _subprocesses.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _subprocesses.cpython-312.pyc
│     │     │  │     ├─ _tasks.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _tasks.cpython-312-pytest-8.3.5.pyc.6652
│     │     │  │     ├─ _tasks.cpython-312.pyc
│     │     │  │     ├─ _testing.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _testing.cpython-312.pyc
│     │     │  │     ├─ __init__.cpython-312-pytest-8.3.5.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ from_thread.py
│     │     │  ├─ lowlevel.py
│     │     │  ├─ py.typed
│     │     │  ├─ pytest_plugin.py
│     │     │  ├─ streams
│     │     │  │  ├─ buffered.py
│     │     │  │  ├─ file.py
│     │     │  │  ├─ memory.py
│     │     │  │  ├─ stapled.py
│     │     │  │  ├─ text.py
│     │     │  │  ├─ tls.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ buffered.cpython-312.pyc
│     │     │  │     ├─ file.cpython-312.pyc
│     │     │  │     ├─ memory.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ memory.cpython-312-pytest-8.3.5.pyc.6652
│     │     │  │     ├─ memory.cpython-312.pyc
│     │     │  │     ├─ stapled.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ stapled.cpython-312.pyc
│     │     │  │     ├─ text.cpython-312.pyc
│     │     │  │     ├─ tls.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ tls.cpython-312.pyc
│     │     │  │     ├─ __init__.cpython-312-pytest-8.3.5.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ to_interpreter.py
│     │     │  ├─ to_process.py
│     │     │  ├─ to_thread.py
│     │     │  ├─ _backends
│     │     │  │  ├─ _asyncio.py
│     │     │  │  ├─ _trio.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ _asyncio.cpython-312.pyc
│     │     │  │     ├─ _trio.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _core
│     │     │  │  ├─ _asyncio_selector_thread.py
│     │     │  │  ├─ _eventloop.py
│     │     │  │  ├─ _exceptions.py
│     │     │  │  ├─ _fileio.py
│     │     │  │  ├─ _resources.py
│     │     │  │  ├─ _signals.py
│     │     │  │  ├─ _sockets.py
│     │     │  │  ├─ _streams.py
│     │     │  │  ├─ _subprocesses.py
│     │     │  │  ├─ _synchronization.py
│     │     │  │  ├─ _tasks.py
│     │     │  │  ├─ _tempfile.py
│     │     │  │  ├─ _testing.py
│     │     │  │  ├─ _typedattr.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ _asyncio_selector_thread.cpython-312.pyc
│     │     │  │     ├─ _eventloop.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _eventloop.cpython-312.pyc
│     │     │  │     ├─ _exceptions.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _exceptions.cpython-312-pytest-8.3.5.pyc.19764
│     │     │  │     ├─ _exceptions.cpython-312.pyc
│     │     │  │     ├─ _fileio.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _fileio.cpython-312.pyc
│     │     │  │     ├─ _resources.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _resources.cpython-312-pytest-8.3.5.pyc.19764
│     │     │  │     ├─ _resources.cpython-312.pyc
│     │     │  │     ├─ _signals.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _signals.cpython-312.pyc
│     │     │  │     ├─ _sockets.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _sockets.cpython-312.pyc
│     │     │  │     ├─ _streams.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _streams.cpython-312.pyc
│     │     │  │     ├─ _subprocesses.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _subprocesses.cpython-312-pytest-8.3.5.pyc.6652
│     │     │  │     ├─ _subprocesses.cpython-312.pyc
│     │     │  │     ├─ _synchronization.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _synchronization.cpython-312.pyc
│     │     │  │     ├─ _tasks.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _tasks.cpython-312.pyc
│     │     │  │     ├─ _tempfile.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _tempfile.cpython-312.pyc
│     │     │  │     ├─ _testing.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _testing.cpython-312.pyc
│     │     │  │     ├─ _typedattr.cpython-312-pytest-8.3.5.pyc
│     │     │  │     ├─ _typedattr.cpython-312.pyc
│     │     │  │     ├─ __init__.cpython-312-pytest-8.3.5.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ from_thread.cpython-312-pytest-8.3.5.pyc
│     │     │     ├─ from_thread.cpython-312.pyc
│     │     │     ├─ lowlevel.cpython-312-pytest-8.3.5.pyc
│     │     │     ├─ lowlevel.cpython-312.pyc
│     │     │     ├─ pytest_plugin.cpython-312-pytest-8.3.5.pyc
│     │     │     ├─ pytest_plugin.cpython-312.pyc
│     │     │     ├─ to_interpreter.cpython-312.pyc
│     │     │     ├─ to_process.cpython-312.pyc
│     │     │     ├─ to_thread.cpython-312-pytest-8.3.5.pyc
│     │     │     ├─ to_thread.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312-pytest-8.3.5.pyc
│     │     │     ├─ __init__.cpython-312-pytest-8.3.5.pyc.19764
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ anyio-4.9.0.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ asyncpg
│     │     │  ├─ cluster.py
│     │     │  ├─ compat.py
│     │     │  ├─ connection.py
│     │     │  ├─ connect_utils.py
│     │     │  ├─ connresource.py
│     │     │  ├─ cursor.py
│     │     │  ├─ exceptions
│     │     │  │  ├─ _base.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ _base.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ introspection.py
│     │     │  ├─ pgproto
│     │     │  │  ├─ buffer.pxd
│     │     │  │  ├─ buffer.pyx
│     │     │  │  ├─ codecs
│     │     │  │  │  ├─ bits.pyx
│     │     │  │  │  ├─ bytea.pyx
│     │     │  │  │  ├─ context.pyx
│     │     │  │  │  ├─ datetime.pyx
│     │     │  │  │  ├─ float.pyx
│     │     │  │  │  ├─ geometry.pyx
│     │     │  │  │  ├─ hstore.pyx
│     │     │  │  │  ├─ int.pyx
│     │     │  │  │  ├─ json.pyx
│     │     │  │  │  ├─ jsonpath.pyx
│     │     │  │  │  ├─ misc.pyx
│     │     │  │  │  ├─ network.pyx
│     │     │  │  │  ├─ numeric.pyx
│     │     │  │  │  ├─ pg_snapshot.pyx
│     │     │  │  │  ├─ text.pyx
│     │     │  │  │  ├─ tid.pyx
│     │     │  │  │  ├─ uuid.pyx
│     │     │  │  │  └─ __init__.pxd
│     │     │  │  ├─ consts.pxi
│     │     │  │  ├─ cpythonx.pxd
│     │     │  │  ├─ debug.pxd
│     │     │  │  ├─ frb.pxd
│     │     │  │  ├─ frb.pyx
│     │     │  │  ├─ hton.pxd
│     │     │  │  ├─ pgproto.cp312-win_amd64.pyd
│     │     │  │  ├─ pgproto.pxd
│     │     │  │  ├─ pgproto.pyi
│     │     │  │  ├─ pgproto.pyx
│     │     │  │  ├─ tohex.pxd
│     │     │  │  ├─ types.py
│     │     │  │  ├─ uuid.pyx
│     │     │  │  ├─ __init__.pxd
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ types.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ pool.py
│     │     │  ├─ prepared_stmt.py
│     │     │  ├─ protocol
│     │     │  │  ├─ codecs
│     │     │  │  │  ├─ array.pyx
│     │     │  │  │  ├─ base.pxd
│     │     │  │  │  ├─ base.pyx
│     │     │  │  │  ├─ pgproto.pyx
│     │     │  │  │  ├─ range.pyx
│     │     │  │  │  ├─ record.pyx
│     │     │  │  │  ├─ textutils.pyx
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ consts.pxi
│     │     │  │  ├─ coreproto.pxd
│     │     │  │  ├─ coreproto.pyx
│     │     │  │  ├─ cpythonx.pxd
│     │     │  │  ├─ encodings.pyx
│     │     │  │  ├─ pgtypes.pxi
│     │     │  │  ├─ prepared_stmt.pxd
│     │     │  │  ├─ prepared_stmt.pyx
│     │     │  │  ├─ protocol.cp312-win_amd64.pyd
│     │     │  │  ├─ protocol.pxd
│     │     │  │  ├─ protocol.pyi
│     │     │  │  ├─ protocol.pyx
│     │     │  │  ├─ record
│     │     │  │  │  └─ __init__.pxd
│     │     │  │  ├─ scram.pxd
│     │     │  │  ├─ scram.pyx
│     │     │  │  ├─ settings.pxd
│     │     │  │  ├─ settings.pyx
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ serverversion.py
│     │     │  ├─ transaction.py
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ _asyncio_compat.py
│     │     │  ├─ _testbase
│     │     │  │  ├─ fuzzer.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ fuzzer.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ cluster.cpython-312.pyc
│     │     │     ├─ compat.cpython-312.pyc
│     │     │     ├─ connection.cpython-312.pyc
│     │     │     ├─ connect_utils.cpython-312.pyc
│     │     │     ├─ connresource.cpython-312.pyc
│     │     │     ├─ cursor.cpython-312.pyc
│     │     │     ├─ introspection.cpython-312.pyc
│     │     │     ├─ pool.cpython-312.pyc
│     │     │     ├─ prepared_stmt.cpython-312.pyc
│     │     │     ├─ serverversion.cpython-312.pyc
│     │     │     ├─ transaction.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ _asyncio_compat.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ asyncpg-0.30.0.dist-info
│     │     │  ├─ AUTHORS
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ async_timeout
│     │     │  ├─ py.typed
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ async_timeout-5.0.1.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  ├─ WHEEL
│     │     │  └─ zip-safe
│     │     ├─ attr
│     │     │  ├─ converters.py
│     │     │  ├─ converters.pyi
│     │     │  ├─ exceptions.py
│     │     │  ├─ exceptions.pyi
│     │     │  ├─ filters.py
│     │     │  ├─ filters.pyi
│     │     │  ├─ py.typed
│     │     │  ├─ setters.py
│     │     │  ├─ setters.pyi
│     │     │  ├─ validators.py
│     │     │  ├─ validators.pyi
│     │     │  ├─ _cmp.py
│     │     │  ├─ _cmp.pyi
│     │     │  ├─ _compat.py
│     │     │  ├─ _config.py
│     │     │  ├─ _funcs.py
│     │     │  ├─ _make.py
│     │     │  ├─ _next_gen.py
│     │     │  ├─ _typing_compat.pyi
│     │     │  ├─ _version_info.py
│     │     │  ├─ _version_info.pyi
│     │     │  ├─ __init__.py
│     │     │  ├─ __init__.pyi
│     │     │  └─ __pycache__
│     │     │     ├─ converters.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ filters.cpython-312.pyc
│     │     │     ├─ setters.cpython-312.pyc
│     │     │     ├─ validators.cpython-312.pyc
│     │     │     ├─ _cmp.cpython-312.pyc
│     │     │     ├─ _compat.cpython-312.pyc
│     │     │     ├─ _config.cpython-312.pyc
│     │     │     ├─ _funcs.cpython-312.pyc
│     │     │     ├─ _make.cpython-312.pyc
│     │     │     ├─ _next_gen.cpython-312.pyc
│     │     │     ├─ _version_info.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ attrs
│     │     │  ├─ converters.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ filters.py
│     │     │  ├─ py.typed
│     │     │  ├─ setters.py
│     │     │  ├─ validators.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __init__.pyi
│     │     │  └─ __pycache__
│     │     │     ├─ converters.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ filters.cpython-312.pyc
│     │     │     ├─ setters.cpython-312.pyc
│     │     │     ├─ validators.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ attrs-25.3.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ bcrypt
│     │     │  ├─ py.typed
│     │     │  ├─ _bcrypt.pyd
│     │     │  ├─ __init__.py
│     │     │  ├─ __init__.pyi
│     │     │  └─ __pycache__
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ bcrypt-4.3.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ certifi
│     │     │  ├─ cacert.pem
│     │     │  ├─ core.py
│     │     │  ├─ py.typed
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pycache__
│     │     │     ├─ core.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     └─ __main__.cpython-312.pyc
│     │     ├─ certifi-2025.4.26.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ charset_normalizer
│     │     │  ├─ api.py
│     │     │  ├─ cd.py
│     │     │  ├─ cli
│     │     │  │  ├─ __init__.py
│     │     │  │  ├─ __main__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ __init__.cpython-312.pyc
│     │     │  │     └─ __main__.cpython-312.pyc
│     │     │  ├─ constant.py
│     │     │  ├─ legacy.py
│     │     │  ├─ md.cp312-win_amd64.pyd
│     │     │  ├─ md.py
│     │     │  ├─ md__mypyc.cp312-win_amd64.pyd
│     │     │  ├─ models.py
│     │     │  ├─ py.typed
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pycache__
│     │     │     ├─ api.cpython-312.pyc
│     │     │     ├─ cd.cpython-312.pyc
│     │     │     ├─ constant.cpython-312.pyc
│     │     │     ├─ legacy.cpython-312.pyc
│     │     │     ├─ md.cpython-312.pyc
│     │     │     ├─ models.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     └─ __main__.cpython-312.pyc
│     │     ├─ charset_normalizer-3.4.2.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ click
│     │     │  ├─ core.py
│     │     │  ├─ decorators.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ formatting.py
│     │     │  ├─ globals.py
│     │     │  ├─ parser.py
│     │     │  ├─ py.typed
│     │     │  ├─ shell_completion.py
│     │     │  ├─ termui.py
│     │     │  ├─ testing.py
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ _compat.py
│     │     │  ├─ _termui_impl.py
│     │     │  ├─ _textwrap.py
│     │     │  ├─ _winconsole.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ core.cpython-312.pyc
│     │     │     ├─ decorators.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ formatting.cpython-312.pyc
│     │     │     ├─ globals.cpython-312.pyc
│     │     │     ├─ parser.cpython-312.pyc
│     │     │     ├─ shell_completion.cpython-312.pyc
│     │     │     ├─ termui.cpython-312.pyc
│     │     │     ├─ testing.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ _compat.cpython-312.pyc
│     │     │     ├─ _termui_impl.cpython-312.pyc
│     │     │     ├─ _textwrap.cpython-312.pyc
│     │     │     ├─ _winconsole.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ click-8.2.1.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.txt
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ colorama
│     │     │  ├─ ansi.py
│     │     │  ├─ ansitowin32.py
│     │     │  ├─ initialise.py
│     │     │  ├─ tests
│     │     │  │  ├─ ansitowin32_test.py
│     │     │  │  ├─ ansi_test.py
│     │     │  │  ├─ initialise_test.py
│     │     │  │  ├─ isatty_test.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ winterm_test.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ ansitowin32_test.cpython-312.pyc
│     │     │  │     ├─ ansi_test.cpython-312.pyc
│     │     │  │     ├─ initialise_test.cpython-312.pyc
│     │     │  │     ├─ isatty_test.cpython-312.pyc
│     │     │  │     ├─ utils.cpython-312.pyc
│     │     │  │     ├─ winterm_test.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ win32.py
│     │     │  ├─ winterm.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ ansi.cpython-312.pyc
│     │     │     ├─ ansitowin32.cpython-312.pyc
│     │     │     ├─ initialise.cpython-312.pyc
│     │     │     ├─ win32.cpython-312.pyc
│     │     │     ├─ winterm.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ colorama-0.4.6.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.txt
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ dateutil
│     │     │  ├─ easter.py
│     │     │  ├─ parser
│     │     │  │  ├─ isoparser.py
│     │     │  │  ├─ _parser.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ isoparser.cpython-312.pyc
│     │     │  │     ├─ _parser.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ relativedelta.py
│     │     │  ├─ rrule.py
│     │     │  ├─ tz
│     │     │  │  ├─ tz.py
│     │     │  │  ├─ win.py
│     │     │  │  ├─ _common.py
│     │     │  │  ├─ _factories.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ tz.cpython-312.pyc
│     │     │  │     ├─ win.cpython-312.pyc
│     │     │  │     ├─ _common.cpython-312.pyc
│     │     │  │     ├─ _factories.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ tzwin.py
│     │     │  ├─ utils.py
│     │     │  ├─ zoneinfo
│     │     │  │  ├─ dateutil-zoneinfo.tar.gz
│     │     │  │  ├─ rebuild.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ rebuild.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _common.py
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ easter.cpython-312.pyc
│     │     │     ├─ relativedelta.cpython-312.pyc
│     │     │     ├─ rrule.cpython-312.pyc
│     │     │     ├─ tzwin.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ _common.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ decouple.py
│     │     ├─ deprecation-2.1.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ deprecation.py
│     │     ├─ distutils-precedence.pth
│     │     ├─ dotenv
│     │     │  ├─ cli.py
│     │     │  ├─ ipython.py
│     │     │  ├─ main.py
│     │     │  ├─ parser.py
│     │     │  ├─ py.typed
│     │     │  ├─ variables.py
│     │     │  ├─ version.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pycache__
│     │     │     ├─ cli.cpython-312.pyc
│     │     │     ├─ ipython.cpython-312.pyc
│     │     │     ├─ main.cpython-312.pyc
│     │     │     ├─ parser.cpython-312.pyc
│     │     │     ├─ variables.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     └─ __main__.cpython-312.pyc
│     │     ├─ fastapi
│     │     │  ├─ applications.py
│     │     │  ├─ background.py
│     │     │  ├─ cli.py
│     │     │  ├─ concurrency.py
│     │     │  ├─ datastructures.py
│     │     │  ├─ dependencies
│     │     │  │  ├─ models.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ models.cpython-312.pyc
│     │     │  │     ├─ utils.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ encoders.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ exception_handlers.py
│     │     │  ├─ logger.py
│     │     │  ├─ middleware
│     │     │  │  ├─ cors.py
│     │     │  │  ├─ gzip.py
│     │     │  │  ├─ httpsredirect.py
│     │     │  │  ├─ trustedhost.py
│     │     │  │  ├─ wsgi.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ cors.cpython-312.pyc
│     │     │  │     ├─ gzip.cpython-312.pyc
│     │     │  │     ├─ httpsredirect.cpython-312.pyc
│     │     │  │     ├─ trustedhost.cpython-312.pyc
│     │     │  │     ├─ wsgi.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ openapi
│     │     │  │  ├─ constants.py
│     │     │  │  ├─ docs.py
│     │     │  │  ├─ models.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ constants.cpython-312.pyc
│     │     │  │     ├─ docs.cpython-312.pyc
│     │     │  │     ├─ models.cpython-312.pyc
│     │     │  │     ├─ utils.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ params.py
│     │     │  ├─ param_functions.py
│     │     │  ├─ py.typed
│     │     │  ├─ requests.py
│     │     │  ├─ responses.py
│     │     │  ├─ routing.py
│     │     │  ├─ security
│     │     │  │  ├─ api_key.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ http.py
│     │     │  │  ├─ oauth2.py
│     │     │  │  ├─ open_id_connect_url.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ api_key.cpython-312.pyc
│     │     │  │     ├─ base.cpython-312.pyc
│     │     │  │     ├─ http.cpython-312.pyc
│     │     │  │     ├─ oauth2.cpython-312.pyc
│     │     │  │     ├─ open_id_connect_url.cpython-312.pyc
│     │     │  │     ├─ utils.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ staticfiles.py
│     │     │  ├─ templating.py
│     │     │  ├─ testclient.py
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ websockets.py
│     │     │  ├─ _compat.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pycache__
│     │     │     ├─ applications.cpython-312.pyc
│     │     │     ├─ background.cpython-312.pyc
│     │     │     ├─ cli.cpython-312.pyc
│     │     │     ├─ concurrency.cpython-312.pyc
│     │     │     ├─ datastructures.cpython-312.pyc
│     │     │     ├─ encoders.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ exception_handlers.cpython-312.pyc
│     │     │     ├─ logger.cpython-312.pyc
│     │     │     ├─ params.cpython-312.pyc
│     │     │     ├─ param_functions.cpython-312.pyc
│     │     │     ├─ requests.cpython-312.pyc
│     │     │     ├─ responses.cpython-312.pyc
│     │     │     ├─ routing.cpython-312.pyc
│     │     │     ├─ staticfiles.cpython-312.pyc
│     │     │     ├─ templating.cpython-312.pyc
│     │     │     ├─ testclient.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ websockets.cpython-312.pyc
│     │     │     ├─ _compat.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     └─ __main__.cpython-312.pyc
│     │     ├─ fastapi-0.115.12.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  └─ WHEEL
│     │     ├─ frozenlist
│     │     │  ├─ py.typed
│     │     │  ├─ _frozenlist.cp312-win_amd64.pyd
│     │     │  ├─ _frozenlist.cpp
│     │     │  ├─ _frozenlist.pyx
│     │     │  ├─ __init__.py
│     │     │  ├─ __init__.pyi
│     │     │  └─ __pycache__
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ frozenlist-1.6.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ gotrue
│     │     │  ├─ constants.py
│     │     │  ├─ errors.py
│     │     │  ├─ helpers.py
│     │     │  ├─ http_clients.py
│     │     │  ├─ timer.py
│     │     │  ├─ types.py
│     │     │  ├─ version.py
│     │     │  ├─ _async
│     │     │  │  ├─ gotrue_admin_api.py
│     │     │  │  ├─ gotrue_admin_mfa_api.py
│     │     │  │  ├─ gotrue_base_api.py
│     │     │  │  ├─ gotrue_client.py
│     │     │  │  ├─ gotrue_mfa_api.py
│     │     │  │  ├─ storage.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ gotrue_admin_api.cpython-312.pyc
│     │     │  │     ├─ gotrue_admin_mfa_api.cpython-312.pyc
│     │     │  │     ├─ gotrue_base_api.cpython-312.pyc
│     │     │  │     ├─ gotrue_client.cpython-312.pyc
│     │     │  │     ├─ gotrue_mfa_api.cpython-312.pyc
│     │     │  │     ├─ storage.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _sync
│     │     │  │  ├─ gotrue_admin_api.py
│     │     │  │  ├─ gotrue_admin_mfa_api.py
│     │     │  │  ├─ gotrue_base_api.py
│     │     │  │  ├─ gotrue_client.py
│     │     │  │  ├─ gotrue_mfa_api.py
│     │     │  │  ├─ storage.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ gotrue_admin_api.cpython-312.pyc
│     │     │  │     ├─ gotrue_admin_mfa_api.cpython-312.pyc
│     │     │  │     ├─ gotrue_base_api.cpython-312.pyc
│     │     │  │     ├─ gotrue_client.cpython-312.pyc
│     │     │  │     ├─ gotrue_mfa_api.cpython-312.pyc
│     │     │  │     ├─ storage.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ constants.cpython-312.pyc
│     │     │     ├─ errors.cpython-312.pyc
│     │     │     ├─ helpers.cpython-312.pyc
│     │     │     ├─ http_clients.cpython-312.pyc
│     │     │     ├─ timer.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ gotrue-2.12.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ h11
│     │     │  ├─ py.typed
│     │     │  ├─ _abnf.py
│     │     │  ├─ _connection.py
│     │     │  ├─ _events.py
│     │     │  ├─ _headers.py
│     │     │  ├─ _readers.py
│     │     │  ├─ _receivebuffer.py
│     │     │  ├─ _state.py
│     │     │  ├─ _util.py
│     │     │  ├─ _version.py
│     │     │  ├─ _writers.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ _abnf.cpython-312.pyc
│     │     │     ├─ _connection.cpython-312.pyc
│     │     │     ├─ _events.cpython-312.pyc
│     │     │     ├─ _headers.cpython-312.pyc
│     │     │     ├─ _readers.cpython-312.pyc
│     │     │     ├─ _receivebuffer.cpython-312.pyc
│     │     │     ├─ _state.cpython-312.pyc
│     │     │     ├─ _util.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     ├─ _writers.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ h11-0.16.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.txt
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ h2
│     │     │  ├─ config.py
│     │     │  ├─ connection.py
│     │     │  ├─ errors.py
│     │     │  ├─ events.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ frame_buffer.py
│     │     │  ├─ py.typed
│     │     │  ├─ settings.py
│     │     │  ├─ stream.py
│     │     │  ├─ utilities.py
│     │     │  ├─ windows.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ config.cpython-312.pyc
│     │     │     ├─ connection.cpython-312.pyc
│     │     │     ├─ errors.cpython-312.pyc
│     │     │     ├─ events.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ frame_buffer.cpython-312.pyc
│     │     │     ├─ settings.cpython-312.pyc
│     │     │     ├─ stream.cpython-312.pyc
│     │     │     ├─ utilities.cpython-312.pyc
│     │     │     ├─ windows.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ h2-4.2.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ hpack
│     │     │  ├─ exceptions.py
│     │     │  ├─ hpack.py
│     │     │  ├─ huffman.py
│     │     │  ├─ huffman_constants.py
│     │     │  ├─ huffman_table.py
│     │     │  ├─ py.typed
│     │     │  ├─ struct.py
│     │     │  ├─ table.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ hpack.cpython-312.pyc
│     │     │     ├─ huffman.cpython-312.pyc
│     │     │     ├─ huffman_constants.cpython-312.pyc
│     │     │     ├─ huffman_table.cpython-312.pyc
│     │     │     ├─ struct.cpython-312.pyc
│     │     │     ├─ table.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ hpack-4.1.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ httpcore
│     │     │  ├─ py.typed
│     │     │  ├─ _api.py
│     │     │  ├─ _async
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ connection_pool.py
│     │     │  │  ├─ http11.py
│     │     │  │  ├─ http2.py
│     │     │  │  ├─ http_proxy.py
│     │     │  │  ├─ interfaces.py
│     │     │  │  ├─ socks_proxy.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ connection.cpython-312.pyc
│     │     │  │     ├─ connection_pool.cpython-312.pyc
│     │     │  │     ├─ http11.cpython-312.pyc
│     │     │  │     ├─ http2.cpython-312.pyc
│     │     │  │     ├─ http_proxy.cpython-312.pyc
│     │     │  │     ├─ interfaces.cpython-312.pyc
│     │     │  │     ├─ socks_proxy.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _backends
│     │     │  │  ├─ anyio.py
│     │     │  │  ├─ auto.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ mock.py
│     │     │  │  ├─ sync.py
│     │     │  │  ├─ trio.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ anyio.cpython-312.pyc
│     │     │  │     ├─ auto.cpython-312.pyc
│     │     │  │     ├─ base.cpython-312.pyc
│     │     │  │     ├─ mock.cpython-312.pyc
│     │     │  │     ├─ sync.cpython-312.pyc
│     │     │  │     ├─ trio.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _exceptions.py
│     │     │  ├─ _models.py
│     │     │  ├─ _ssl.py
│     │     │  ├─ _sync
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ connection_pool.py
│     │     │  │  ├─ http11.py
│     │     │  │  ├─ http2.py
│     │     │  │  ├─ http_proxy.py
│     │     │  │  ├─ interfaces.py
│     │     │  │  ├─ socks_proxy.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ connection.cpython-312.pyc
│     │     │  │     ├─ connection_pool.cpython-312.pyc
│     │     │  │     ├─ http11.cpython-312.pyc
│     │     │  │     ├─ http2.cpython-312.pyc
│     │     │  │     ├─ http_proxy.cpython-312.pyc
│     │     │  │     ├─ interfaces.cpython-312.pyc
│     │     │  │     ├─ socks_proxy.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _synchronization.py
│     │     │  ├─ _trace.py
│     │     │  ├─ _utils.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ _api.cpython-312.pyc
│     │     │     ├─ _exceptions.cpython-312.pyc
│     │     │     ├─ _models.cpython-312.pyc
│     │     │     ├─ _ssl.cpython-312.pyc
│     │     │     ├─ _synchronization.cpython-312.pyc
│     │     │     ├─ _trace.cpython-312.pyc
│     │     │     ├─ _utils.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ httpcore-1.0.9.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.md
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ httptools
│     │     │  ├─ parser
│     │     │  │  ├─ cparser.pxd
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ parser.cp312-win_amd64.pyd
│     │     │  │  ├─ parser.pyx
│     │     │  │  ├─ python.pxd
│     │     │  │  ├─ url_cparser.pxd
│     │     │  │  ├─ url_parser.cp312-win_amd64.pyd
│     │     │  │  ├─ url_parser.pyx
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ errors.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ httptools-0.6.4.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ httpx
│     │     │  ├─ py.typed
│     │     │  ├─ _api.py
│     │     │  ├─ _auth.py
│     │     │  ├─ _client.py
│     │     │  ├─ _config.py
│     │     │  ├─ _content.py
│     │     │  ├─ _decoders.py
│     │     │  ├─ _exceptions.py
│     │     │  ├─ _main.py
│     │     │  ├─ _models.py
│     │     │  ├─ _multipart.py
│     │     │  ├─ _status_codes.py
│     │     │  ├─ _transports
│     │     │  │  ├─ asgi.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ default.py
│     │     │  │  ├─ mock.py
│     │     │  │  ├─ wsgi.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ asgi.cpython-312.pyc
│     │     │  │     ├─ base.cpython-312.pyc
│     │     │  │     ├─ default.cpython-312.pyc
│     │     │  │     ├─ mock.cpython-312.pyc
│     │     │  │     ├─ wsgi.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _types.py
│     │     │  ├─ _urlparse.py
│     │     │  ├─ _urls.py
│     │     │  ├─ _utils.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __pycache__
│     │     │  │  ├─ _api.cpython-312.pyc
│     │     │  │  ├─ _auth.cpython-312.pyc
│     │     │  │  ├─ _client.cpython-312.pyc
│     │     │  │  ├─ _config.cpython-312.pyc
│     │     │  │  ├─ _content.cpython-312.pyc
│     │     │  │  ├─ _decoders.cpython-312.pyc
│     │     │  │  ├─ _exceptions.cpython-312.pyc
│     │     │  │  ├─ _main.cpython-312.pyc
│     │     │  │  ├─ _models.cpython-312.pyc
│     │     │  │  ├─ _multipart.cpython-312.pyc
│     │     │  │  ├─ _status_codes.cpython-312.pyc
│     │     │  │  ├─ _types.cpython-312.pyc
│     │     │  │  ├─ _urlparse.cpython-312.pyc
│     │     │  │  ├─ _urls.cpython-312.pyc
│     │     │  │  ├─ _utils.cpython-312.pyc
│     │     │  │  ├─ __init__.cpython-312.pyc
│     │     │  │  └─ __version__.cpython-312.pyc
│     │     │  └─ __version__.py
│     │     ├─ httpx-0.28.1.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.md
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ hyperframe
│     │     │  ├─ exceptions.py
│     │     │  ├─ flags.py
│     │     │  ├─ frame.py
│     │     │  ├─ py.typed
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ flags.cpython-312.pyc
│     │     │     ├─ frame.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ hyperframe-6.1.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ idna
│     │     │  ├─ codec.py
│     │     │  ├─ compat.py
│     │     │  ├─ core.py
│     │     │  ├─ idnadata.py
│     │     │  ├─ intranges.py
│     │     │  ├─ package_data.py
│     │     │  ├─ py.typed
│     │     │  ├─ uts46data.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ codec.cpython-312.pyc
│     │     │     ├─ compat.cpython-312.pyc
│     │     │     ├─ core.cpython-312.pyc
│     │     │     ├─ idnadata.cpython-312.pyc
│     │     │     ├─ intranges.cpython-312.pyc
│     │     │     ├─ package_data.cpython-312.pyc
│     │     │     ├─ uts46data.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ idna-3.10.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE.md
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ iniconfig
│     │     │  ├─ exceptions.py
│     │     │  ├─ py.typed
│     │     │  ├─ _parse.py
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ _parse.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ iniconfig-2.1.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ jwt
│     │     │  ├─ algorithms.py
│     │     │  ├─ api_jwk.py
│     │     │  ├─ api_jws.py
│     │     │  ├─ api_jwt.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ help.py
│     │     │  ├─ jwks_client.py
│     │     │  ├─ jwk_set_cache.py
│     │     │  ├─ py.typed
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ warnings.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ algorithms.cpython-312.pyc
│     │     │     ├─ api_jwk.cpython-312.pyc
│     │     │     ├─ api_jws.cpython-312.pyc
│     │     │     ├─ api_jwt.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ help.cpython-312.pyc
│     │     │     ├─ jwks_client.cpython-312.pyc
│     │     │     ├─ jwk_set_cache.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ warnings.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ multidict
│     │     │  ├─ py.typed
│     │     │  ├─ _abc.py
│     │     │  ├─ _compat.py
│     │     │  ├─ _multidict.cp312-win_amd64.pyd
│     │     │  ├─ _multidict_py.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ _abc.cpython-312.pyc
│     │     │     ├─ _compat.cpython-312.pyc
│     │     │     ├─ _multidict_py.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ multidict-6.4.4.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ packaging
│     │     │  ├─ licenses
│     │     │  │  ├─ _spdx.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ _spdx.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ markers.py
│     │     │  ├─ metadata.py
│     │     │  ├─ py.typed
│     │     │  ├─ requirements.py
│     │     │  ├─ specifiers.py
│     │     │  ├─ tags.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ _elffile.py
│     │     │  ├─ _manylinux.py
│     │     │  ├─ _musllinux.py
│     │     │  ├─ _parser.py
│     │     │  ├─ _structures.py
│     │     │  ├─ _tokenizer.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ markers.cpython-312.pyc
│     │     │     ├─ metadata.cpython-312.pyc
│     │     │     ├─ requirements.cpython-312.pyc
│     │     │     ├─ specifiers.cpython-312.pyc
│     │     │     ├─ tags.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     ├─ _elffile.cpython-312.pyc
│     │     │     ├─ _manylinux.cpython-312.pyc
│     │     │     ├─ _musllinux.cpython-312.pyc
│     │     │     ├─ _parser.cpython-312.pyc
│     │     │     ├─ _structures.cpython-312.pyc
│     │     │     ├─ _tokenizer.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ packaging-25.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  ├─ LICENSE
│     │     │  │  ├─ LICENSE.APACHE
│     │     │  │  └─ LICENSE.BSD
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ pip
│     │     │  ├─ py.typed
│     │     │  ├─ _internal
│     │     │  │  ├─ build_env.py
│     │     │  │  ├─ cache.py
│     │     │  │  ├─ cli
│     │     │  │  │  ├─ autocompletion.py
│     │     │  │  │  ├─ base_command.py
│     │     │  │  │  ├─ cmdoptions.py
│     │     │  │  │  ├─ command_context.py
│     │     │  │  │  ├─ index_command.py
│     │     │  │  │  ├─ main.py
│     │     │  │  │  ├─ main_parser.py
│     │     │  │  │  ├─ parser.py
│     │     │  │  │  ├─ progress_bars.py
│     │     │  │  │  ├─ req_command.py
│     │     │  │  │  ├─ spinners.py
│     │     │  │  │  ├─ status_codes.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ autocompletion.cpython-312.pyc
│     │     │  │  │     ├─ base_command.cpython-312.pyc
│     │     │  │  │     ├─ cmdoptions.cpython-312.pyc
│     │     │  │  │     ├─ command_context.cpython-312.pyc
│     │     │  │  │     ├─ index_command.cpython-312.pyc
│     │     │  │  │     ├─ main.cpython-312.pyc
│     │     │  │  │     ├─ main_parser.cpython-312.pyc
│     │     │  │  │     ├─ parser.cpython-312.pyc
│     │     │  │  │     ├─ progress_bars.cpython-312.pyc
│     │     │  │  │     ├─ req_command.cpython-312.pyc
│     │     │  │  │     ├─ spinners.cpython-312.pyc
│     │     │  │  │     ├─ status_codes.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ commands
│     │     │  │  │  ├─ cache.py
│     │     │  │  │  ├─ check.py
│     │     │  │  │  ├─ completion.py
│     │     │  │  │  ├─ configuration.py
│     │     │  │  │  ├─ debug.py
│     │     │  │  │  ├─ download.py
│     │     │  │  │  ├─ freeze.py
│     │     │  │  │  ├─ hash.py
│     │     │  │  │  ├─ help.py
│     │     │  │  │  ├─ index.py
│     │     │  │  │  ├─ inspect.py
│     │     │  │  │  ├─ install.py
│     │     │  │  │  ├─ list.py
│     │     │  │  │  ├─ lock.py
│     │     │  │  │  ├─ search.py
│     │     │  │  │  ├─ show.py
│     │     │  │  │  ├─ uninstall.py
│     │     │  │  │  ├─ wheel.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ cache.cpython-312.pyc
│     │     │  │  │     ├─ check.cpython-312.pyc
│     │     │  │  │     ├─ completion.cpython-312.pyc
│     │     │  │  │     ├─ configuration.cpython-312.pyc
│     │     │  │  │     ├─ debug.cpython-312.pyc
│     │     │  │  │     ├─ download.cpython-312.pyc
│     │     │  │  │     ├─ freeze.cpython-312.pyc
│     │     │  │  │     ├─ hash.cpython-312.pyc
│     │     │  │  │     ├─ help.cpython-312.pyc
│     │     │  │  │     ├─ index.cpython-312.pyc
│     │     │  │  │     ├─ inspect.cpython-312.pyc
│     │     │  │  │     ├─ install.cpython-312.pyc
│     │     │  │  │     ├─ list.cpython-312.pyc
│     │     │  │  │     ├─ lock.cpython-312.pyc
│     │     │  │  │     ├─ search.cpython-312.pyc
│     │     │  │  │     ├─ show.cpython-312.pyc
│     │     │  │  │     ├─ uninstall.cpython-312.pyc
│     │     │  │  │     ├─ wheel.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ configuration.py
│     │     │  │  ├─ distributions
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ installed.py
│     │     │  │  │  ├─ sdist.py
│     │     │  │  │  ├─ wheel.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ base.cpython-312.pyc
│     │     │  │  │     ├─ installed.cpython-312.pyc
│     │     │  │  │     ├─ sdist.cpython-312.pyc
│     │     │  │  │     ├─ wheel.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ index
│     │     │  │  │  ├─ collector.py
│     │     │  │  │  ├─ package_finder.py
│     │     │  │  │  ├─ sources.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ collector.cpython-312.pyc
│     │     │  │  │     ├─ package_finder.cpython-312.pyc
│     │     │  │  │     ├─ sources.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ locations
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ _distutils.py
│     │     │  │  │  ├─ _sysconfig.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ base.cpython-312.pyc
│     │     │  │  │     ├─ _distutils.cpython-312.pyc
│     │     │  │  │     ├─ _sysconfig.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ main.py
│     │     │  │  ├─ metadata
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ importlib
│     │     │  │  │  │  ├─ _compat.py
│     │     │  │  │  │  ├─ _dists.py
│     │     │  │  │  │  ├─ _envs.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ _compat.cpython-312.pyc
│     │     │  │  │  │     ├─ _dists.cpython-312.pyc
│     │     │  │  │  │     ├─ _envs.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ pkg_resources.py
│     │     │  │  │  ├─ _json.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ base.cpython-312.pyc
│     │     │  │  │     ├─ pkg_resources.cpython-312.pyc
│     │     │  │  │     ├─ _json.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ models
│     │     │  │  │  ├─ candidate.py
│     │     │  │  │  ├─ direct_url.py
│     │     │  │  │  ├─ format_control.py
│     │     │  │  │  ├─ index.py
│     │     │  │  │  ├─ installation_report.py
│     │     │  │  │  ├─ link.py
│     │     │  │  │  ├─ pylock.py
│     │     │  │  │  ├─ scheme.py
│     │     │  │  │  ├─ search_scope.py
│     │     │  │  │  ├─ selection_prefs.py
│     │     │  │  │  ├─ target_python.py
│     │     │  │  │  ├─ wheel.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ candidate.cpython-312.pyc
│     │     │  │  │     ├─ direct_url.cpython-312.pyc
│     │     │  │  │     ├─ format_control.cpython-312.pyc
│     │     │  │  │     ├─ index.cpython-312.pyc
│     │     │  │  │     ├─ installation_report.cpython-312.pyc
│     │     │  │  │     ├─ link.cpython-312.pyc
│     │     │  │  │     ├─ pylock.cpython-312.pyc
│     │     │  │  │     ├─ scheme.cpython-312.pyc
│     │     │  │  │     ├─ search_scope.cpython-312.pyc
│     │     │  │  │     ├─ selection_prefs.cpython-312.pyc
│     │     │  │  │     ├─ target_python.cpython-312.pyc
│     │     │  │  │     ├─ wheel.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ network
│     │     │  │  │  ├─ auth.py
│     │     │  │  │  ├─ cache.py
│     │     │  │  │  ├─ download.py
│     │     │  │  │  ├─ lazy_wheel.py
│     │     │  │  │  ├─ session.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ xmlrpc.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ auth.cpython-312.pyc
│     │     │  │  │     ├─ cache.cpython-312.pyc
│     │     │  │  │     ├─ download.cpython-312.pyc
│     │     │  │  │     ├─ lazy_wheel.cpython-312.pyc
│     │     │  │  │     ├─ session.cpython-312.pyc
│     │     │  │  │     ├─ utils.cpython-312.pyc
│     │     │  │  │     ├─ xmlrpc.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ operations
│     │     │  │  │  ├─ build
│     │     │  │  │  │  ├─ build_tracker.py
│     │     │  │  │  │  ├─ metadata.py
│     │     │  │  │  │  ├─ metadata_editable.py
│     │     │  │  │  │  ├─ metadata_legacy.py
│     │     │  │  │  │  ├─ wheel.py
│     │     │  │  │  │  ├─ wheel_editable.py
│     │     │  │  │  │  ├─ wheel_legacy.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ build_tracker.cpython-312.pyc
│     │     │  │  │  │     ├─ metadata.cpython-312.pyc
│     │     │  │  │  │     ├─ metadata_editable.cpython-312.pyc
│     │     │  │  │  │     ├─ metadata_legacy.cpython-312.pyc
│     │     │  │  │  │     ├─ wheel.cpython-312.pyc
│     │     │  │  │  │     ├─ wheel_editable.cpython-312.pyc
│     │     │  │  │  │     ├─ wheel_legacy.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ check.py
│     │     │  │  │  ├─ freeze.py
│     │     │  │  │  ├─ install
│     │     │  │  │  │  ├─ editable_legacy.py
│     │     │  │  │  │  ├─ wheel.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ editable_legacy.cpython-312.pyc
│     │     │  │  │  │     ├─ wheel.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ prepare.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ check.cpython-312.pyc
│     │     │  │  │     ├─ freeze.cpython-312.pyc
│     │     │  │  │     ├─ prepare.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ pyproject.py
│     │     │  │  ├─ req
│     │     │  │  │  ├─ constructors.py
│     │     │  │  │  ├─ req_dependency_group.py
│     │     │  │  │  ├─ req_file.py
│     │     │  │  │  ├─ req_install.py
│     │     │  │  │  ├─ req_set.py
│     │     │  │  │  ├─ req_uninstall.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ constructors.cpython-312.pyc
│     │     │  │  │     ├─ req_dependency_group.cpython-312.pyc
│     │     │  │  │     ├─ req_file.cpython-312.pyc
│     │     │  │  │     ├─ req_install.cpython-312.pyc
│     │     │  │  │     ├─ req_set.cpython-312.pyc
│     │     │  │  │     ├─ req_uninstall.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ resolution
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ legacy
│     │     │  │  │  │  ├─ resolver.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ resolver.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ resolvelib
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ candidates.py
│     │     │  │  │  │  ├─ factory.py
│     │     │  │  │  │  ├─ found_candidates.py
│     │     │  │  │  │  ├─ provider.py
│     │     │  │  │  │  ├─ reporter.py
│     │     │  │  │  │  ├─ requirements.py
│     │     │  │  │  │  ├─ resolver.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ base.cpython-312.pyc
│     │     │  │  │  │     ├─ candidates.cpython-312.pyc
│     │     │  │  │  │     ├─ factory.cpython-312.pyc
│     │     │  │  │  │     ├─ found_candidates.cpython-312.pyc
│     │     │  │  │  │     ├─ provider.cpython-312.pyc
│     │     │  │  │  │     ├─ reporter.cpython-312.pyc
│     │     │  │  │  │     ├─ requirements.cpython-312.pyc
│     │     │  │  │  │     ├─ resolver.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ base.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ self_outdated_check.py
│     │     │  │  ├─ utils
│     │     │  │  │  ├─ appdirs.py
│     │     │  │  │  ├─ compat.py
│     │     │  │  │  ├─ compatibility_tags.py
│     │     │  │  │  ├─ datetime.py
│     │     │  │  │  ├─ deprecation.py
│     │     │  │  │  ├─ direct_url_helpers.py
│     │     │  │  │  ├─ egg_link.py
│     │     │  │  │  ├─ entrypoints.py
│     │     │  │  │  ├─ filesystem.py
│     │     │  │  │  ├─ filetypes.py
│     │     │  │  │  ├─ glibc.py
│     │     │  │  │  ├─ hashes.py
│     │     │  │  │  ├─ logging.py
│     │     │  │  │  ├─ misc.py
│     │     │  │  │  ├─ packaging.py
│     │     │  │  │  ├─ retry.py
│     │     │  │  │  ├─ setuptools_build.py
│     │     │  │  │  ├─ subprocess.py
│     │     │  │  │  ├─ temp_dir.py
│     │     │  │  │  ├─ unpacking.py
│     │     │  │  │  ├─ urls.py
│     │     │  │  │  ├─ virtualenv.py
│     │     │  │  │  ├─ wheel.py
│     │     │  │  │  ├─ _jaraco_text.py
│     │     │  │  │  ├─ _log.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ appdirs.cpython-312.pyc
│     │     │  │  │     ├─ compat.cpython-312.pyc
│     │     │  │  │     ├─ compatibility_tags.cpython-312.pyc
│     │     │  │  │     ├─ datetime.cpython-312.pyc
│     │     │  │  │     ├─ deprecation.cpython-312.pyc
│     │     │  │  │     ├─ direct_url_helpers.cpython-312.pyc
│     │     │  │  │     ├─ egg_link.cpython-312.pyc
│     │     │  │  │     ├─ entrypoints.cpython-312.pyc
│     │     │  │  │     ├─ filesystem.cpython-312.pyc
│     │     │  │  │     ├─ filetypes.cpython-312.pyc
│     │     │  │  │     ├─ glibc.cpython-312.pyc
│     │     │  │  │     ├─ hashes.cpython-312.pyc
│     │     │  │  │     ├─ logging.cpython-312.pyc
│     │     │  │  │     ├─ misc.cpython-312.pyc
│     │     │  │  │     ├─ packaging.cpython-312.pyc
│     │     │  │  │     ├─ retry.cpython-312.pyc
│     │     │  │  │     ├─ setuptools_build.cpython-312.pyc
│     │     │  │  │     ├─ subprocess.cpython-312.pyc
│     │     │  │  │     ├─ temp_dir.cpython-312.pyc
│     │     │  │  │     ├─ unpacking.cpython-312.pyc
│     │     │  │  │     ├─ urls.cpython-312.pyc
│     │     │  │  │     ├─ virtualenv.cpython-312.pyc
│     │     │  │  │     ├─ wheel.cpython-312.pyc
│     │     │  │  │     ├─ _jaraco_text.cpython-312.pyc
│     │     │  │  │     ├─ _log.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ vcs
│     │     │  │  │  ├─ bazaar.py
│     │     │  │  │  ├─ git.py
│     │     │  │  │  ├─ mercurial.py
│     │     │  │  │  ├─ subversion.py
│     │     │  │  │  ├─ versioncontrol.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ bazaar.cpython-312.pyc
│     │     │  │  │     ├─ git.cpython-312.pyc
│     │     │  │  │     ├─ mercurial.cpython-312.pyc
│     │     │  │  │     ├─ subversion.cpython-312.pyc
│     │     │  │  │     ├─ versioncontrol.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ wheel_builder.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ build_env.cpython-312.pyc
│     │     │  │     ├─ cache.cpython-312.pyc
│     │     │  │     ├─ configuration.cpython-312.pyc
│     │     │  │     ├─ exceptions.cpython-312.pyc
│     │     │  │     ├─ main.cpython-312.pyc
│     │     │  │     ├─ pyproject.cpython-312.pyc
│     │     │  │     ├─ self_outdated_check.cpython-312.pyc
│     │     │  │     ├─ wheel_builder.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _vendor
│     │     │  │  ├─ cachecontrol
│     │     │  │  │  ├─ adapter.py
│     │     │  │  │  ├─ cache.py
│     │     │  │  │  ├─ caches
│     │     │  │  │  │  ├─ file_cache.py
│     │     │  │  │  │  ├─ redis_cache.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ file_cache.cpython-312.pyc
│     │     │  │  │  │     ├─ redis_cache.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ controller.py
│     │     │  │  │  ├─ filewrapper.py
│     │     │  │  │  ├─ heuristics.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ serialize.py
│     │     │  │  │  ├─ wrapper.py
│     │     │  │  │  ├─ _cmd.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ adapter.cpython-312.pyc
│     │     │  │  │     ├─ cache.cpython-312.pyc
│     │     │  │  │     ├─ controller.cpython-312.pyc
│     │     │  │  │     ├─ filewrapper.cpython-312.pyc
│     │     │  │  │     ├─ heuristics.cpython-312.pyc
│     │     │  │  │     ├─ serialize.cpython-312.pyc
│     │     │  │  │     ├─ wrapper.cpython-312.pyc
│     │     │  │  │     ├─ _cmd.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ certifi
│     │     │  │  │  ├─ cacert.pem
│     │     │  │  │  ├─ core.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __main__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ core.cpython-312.pyc
│     │     │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  ├─ dependency_groups
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _implementation.py
│     │     │  │  │  ├─ _lint_dependency_groups.py
│     │     │  │  │  ├─ _pip_wrapper.py
│     │     │  │  │  ├─ _toml_compat.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __main__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ _implementation.cpython-312.pyc
│     │     │  │  │     ├─ _lint_dependency_groups.cpython-312.pyc
│     │     │  │  │     ├─ _pip_wrapper.cpython-312.pyc
│     │     │  │  │     ├─ _toml_compat.cpython-312.pyc
│     │     │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  ├─ distlib
│     │     │  │  │  ├─ compat.py
│     │     │  │  │  ├─ database.py
│     │     │  │  │  ├─ index.py
│     │     │  │  │  ├─ locators.py
│     │     │  │  │  ├─ manifest.py
│     │     │  │  │  ├─ markers.py
│     │     │  │  │  ├─ metadata.py
│     │     │  │  │  ├─ resources.py
│     │     │  │  │  ├─ scripts.py
│     │     │  │  │  ├─ t32.exe
│     │     │  │  │  ├─ t64-arm.exe
│     │     │  │  │  ├─ t64.exe
│     │     │  │  │  ├─ util.py
│     │     │  │  │  ├─ version.py
│     │     │  │  │  ├─ w32.exe
│     │     │  │  │  ├─ w64-arm.exe
│     │     │  │  │  ├─ w64.exe
│     │     │  │  │  ├─ wheel.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ compat.cpython-312.pyc
│     │     │  │  │     ├─ database.cpython-312.pyc
│     │     │  │  │     ├─ index.cpython-312.pyc
│     │     │  │  │     ├─ locators.cpython-312.pyc
│     │     │  │  │     ├─ manifest.cpython-312.pyc
│     │     │  │  │     ├─ markers.cpython-312.pyc
│     │     │  │  │     ├─ metadata.cpython-312.pyc
│     │     │  │  │     ├─ resources.cpython-312.pyc
│     │     │  │  │     ├─ scripts.cpython-312.pyc
│     │     │  │  │     ├─ util.cpython-312.pyc
│     │     │  │  │     ├─ version.cpython-312.pyc
│     │     │  │  │     ├─ wheel.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ distro
│     │     │  │  │  ├─ distro.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __main__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ distro.cpython-312.pyc
│     │     │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  ├─ idna
│     │     │  │  │  ├─ codec.py
│     │     │  │  │  ├─ compat.py
│     │     │  │  │  ├─ core.py
│     │     │  │  │  ├─ idnadata.py
│     │     │  │  │  ├─ intranges.py
│     │     │  │  │  ├─ package_data.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ uts46data.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ codec.cpython-312.pyc
│     │     │  │  │     ├─ compat.cpython-312.pyc
│     │     │  │  │     ├─ core.cpython-312.pyc
│     │     │  │  │     ├─ idnadata.cpython-312.pyc
│     │     │  │  │     ├─ intranges.cpython-312.pyc
│     │     │  │  │     ├─ package_data.cpython-312.pyc
│     │     │  │  │     ├─ uts46data.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ msgpack
│     │     │  │  │  ├─ exceptions.py
│     │     │  │  │  ├─ ext.py
│     │     │  │  │  ├─ fallback.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ exceptions.cpython-312.pyc
│     │     │  │  │     ├─ ext.cpython-312.pyc
│     │     │  │  │     ├─ fallback.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ packaging
│     │     │  │  │  ├─ licenses
│     │     │  │  │  │  ├─ _spdx.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ _spdx.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ markers.py
│     │     │  │  │  ├─ metadata.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ requirements.py
│     │     │  │  │  ├─ specifiers.py
│     │     │  │  │  ├─ tags.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ version.py
│     │     │  │  │  ├─ _elffile.py
│     │     │  │  │  ├─ _manylinux.py
│     │     │  │  │  ├─ _musllinux.py
│     │     │  │  │  ├─ _parser.py
│     │     │  │  │  ├─ _structures.py
│     │     │  │  │  ├─ _tokenizer.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ markers.cpython-312.pyc
│     │     │  │  │     ├─ metadata.cpython-312.pyc
│     │     │  │  │     ├─ requirements.cpython-312.pyc
│     │     │  │  │     ├─ specifiers.cpython-312.pyc
│     │     │  │  │     ├─ tags.cpython-312.pyc
│     │     │  │  │     ├─ utils.cpython-312.pyc
│     │     │  │  │     ├─ version.cpython-312.pyc
│     │     │  │  │     ├─ _elffile.cpython-312.pyc
│     │     │  │  │     ├─ _manylinux.cpython-312.pyc
│     │     │  │  │     ├─ _musllinux.cpython-312.pyc
│     │     │  │  │     ├─ _parser.cpython-312.pyc
│     │     │  │  │     ├─ _structures.cpython-312.pyc
│     │     │  │  │     ├─ _tokenizer.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ pkg_resources
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ platformdirs
│     │     │  │  │  ├─ android.py
│     │     │  │  │  ├─ api.py
│     │     │  │  │  ├─ macos.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ unix.py
│     │     │  │  │  ├─ version.py
│     │     │  │  │  ├─ windows.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __main__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ android.cpython-312.pyc
│     │     │  │  │     ├─ api.cpython-312.pyc
│     │     │  │  │     ├─ macos.cpython-312.pyc
│     │     │  │  │     ├─ unix.cpython-312.pyc
│     │     │  │  │     ├─ version.cpython-312.pyc
│     │     │  │  │     ├─ windows.cpython-312.pyc
│     │     │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  ├─ pygments
│     │     │  │  │  ├─ console.py
│     │     │  │  │  ├─ filter.py
│     │     │  │  │  ├─ filters
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ formatter.py
│     │     │  │  │  ├─ formatters
│     │     │  │  │  │  ├─ _mapping.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ _mapping.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ lexer.py
│     │     │  │  │  ├─ lexers
│     │     │  │  │  │  ├─ python.py
│     │     │  │  │  │  ├─ _mapping.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ python.cpython-312.pyc
│     │     │  │  │  │     ├─ _mapping.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ modeline.py
│     │     │  │  │  ├─ plugin.py
│     │     │  │  │  ├─ regexopt.py
│     │     │  │  │  ├─ scanner.py
│     │     │  │  │  ├─ sphinxext.py
│     │     │  │  │  ├─ style.py
│     │     │  │  │  ├─ styles
│     │     │  │  │  │  ├─ _mapping.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ _mapping.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ token.py
│     │     │  │  │  ├─ unistring.py
│     │     │  │  │  ├─ util.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __main__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ console.cpython-312.pyc
│     │     │  │  │     ├─ filter.cpython-312.pyc
│     │     │  │  │     ├─ formatter.cpython-312.pyc
│     │     │  │  │     ├─ lexer.cpython-312.pyc
│     │     │  │  │     ├─ modeline.cpython-312.pyc
│     │     │  │  │     ├─ plugin.cpython-312.pyc
│     │     │  │  │     ├─ regexopt.cpython-312.pyc
│     │     │  │  │     ├─ scanner.cpython-312.pyc
│     │     │  │  │     ├─ sphinxext.cpython-312.pyc
│     │     │  │  │     ├─ style.cpython-312.pyc
│     │     │  │  │     ├─ token.cpython-312.pyc
│     │     │  │  │     ├─ unistring.cpython-312.pyc
│     │     │  │  │     ├─ util.cpython-312.pyc
│     │     │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  ├─ pyproject_hooks
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _impl.py
│     │     │  │  │  ├─ _in_process
│     │     │  │  │  │  ├─ _in_process.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ _in_process.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ _impl.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ requests
│     │     │  │  │  ├─ adapters.py
│     │     │  │  │  ├─ api.py
│     │     │  │  │  ├─ auth.py
│     │     │  │  │  ├─ certs.py
│     │     │  │  │  ├─ compat.py
│     │     │  │  │  ├─ cookies.py
│     │     │  │  │  ├─ exceptions.py
│     │     │  │  │  ├─ help.py
│     │     │  │  │  ├─ hooks.py
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ packages.py
│     │     │  │  │  ├─ sessions.py
│     │     │  │  │  ├─ status_codes.py
│     │     │  │  │  ├─ structures.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ _internal_utils.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __pycache__
│     │     │  │  │  │  ├─ adapters.cpython-312.pyc
│     │     │  │  │  │  ├─ api.cpython-312.pyc
│     │     │  │  │  │  ├─ auth.cpython-312.pyc
│     │     │  │  │  │  ├─ certs.cpython-312.pyc
│     │     │  │  │  │  ├─ compat.cpython-312.pyc
│     │     │  │  │  │  ├─ cookies.cpython-312.pyc
│     │     │  │  │  │  ├─ exceptions.cpython-312.pyc
│     │     │  │  │  │  ├─ help.cpython-312.pyc
│     │     │  │  │  │  ├─ hooks.cpython-312.pyc
│     │     │  │  │  │  ├─ models.cpython-312.pyc
│     │     │  │  │  │  ├─ packages.cpython-312.pyc
│     │     │  │  │  │  ├─ sessions.cpython-312.pyc
│     │     │  │  │  │  ├─ status_codes.cpython-312.pyc
│     │     │  │  │  │  ├─ structures.cpython-312.pyc
│     │     │  │  │  │  ├─ utils.cpython-312.pyc
│     │     │  │  │  │  ├─ _internal_utils.cpython-312.pyc
│     │     │  │  │  │  ├─ __init__.cpython-312.pyc
│     │     │  │  │  │  └─ __version__.cpython-312.pyc
│     │     │  │  │  └─ __version__.py
│     │     │  │  ├─ resolvelib
│     │     │  │  │  ├─ providers.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ reporters.py
│     │     │  │  │  ├─ resolvers
│     │     │  │  │  │  ├─ abstract.py
│     │     │  │  │  │  ├─ criterion.py
│     │     │  │  │  │  ├─ exceptions.py
│     │     │  │  │  │  ├─ resolution.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ abstract.cpython-312.pyc
│     │     │  │  │  │     ├─ criterion.cpython-312.pyc
│     │     │  │  │  │     ├─ exceptions.cpython-312.pyc
│     │     │  │  │  │     ├─ resolution.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ structs.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ providers.cpython-312.pyc
│     │     │  │  │     ├─ reporters.cpython-312.pyc
│     │     │  │  │     ├─ structs.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ rich
│     │     │  │  │  ├─ abc.py
│     │     │  │  │  ├─ align.py
│     │     │  │  │  ├─ ansi.py
│     │     │  │  │  ├─ bar.py
│     │     │  │  │  ├─ box.py
│     │     │  │  │  ├─ cells.py
│     │     │  │  │  ├─ color.py
│     │     │  │  │  ├─ color_triplet.py
│     │     │  │  │  ├─ columns.py
│     │     │  │  │  ├─ console.py
│     │     │  │  │  ├─ constrain.py
│     │     │  │  │  ├─ containers.py
│     │     │  │  │  ├─ control.py
│     │     │  │  │  ├─ default_styles.py
│     │     │  │  │  ├─ diagnose.py
│     │     │  │  │  ├─ emoji.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ filesize.py
│     │     │  │  │  ├─ file_proxy.py
│     │     │  │  │  ├─ highlighter.py
│     │     │  │  │  ├─ json.py
│     │     │  │  │  ├─ jupyter.py
│     │     │  │  │  ├─ layout.py
│     │     │  │  │  ├─ live.py
│     │     │  │  │  ├─ live_render.py
│     │     │  │  │  ├─ logging.py
│     │     │  │  │  ├─ markup.py
│     │     │  │  │  ├─ measure.py
│     │     │  │  │  ├─ padding.py
│     │     │  │  │  ├─ pager.py
│     │     │  │  │  ├─ palette.py
│     │     │  │  │  ├─ panel.py
│     │     │  │  │  ├─ pretty.py
│     │     │  │  │  ├─ progress.py
│     │     │  │  │  ├─ progress_bar.py
│     │     │  │  │  ├─ prompt.py
│     │     │  │  │  ├─ protocol.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ region.py
│     │     │  │  │  ├─ repr.py
│     │     │  │  │  ├─ rule.py
│     │     │  │  │  ├─ scope.py
│     │     │  │  │  ├─ screen.py
│     │     │  │  │  ├─ segment.py
│     │     │  │  │  ├─ spinner.py
│     │     │  │  │  ├─ status.py
│     │     │  │  │  ├─ style.py
│     │     │  │  │  ├─ styled.py
│     │     │  │  │  ├─ syntax.py
│     │     │  │  │  ├─ table.py
│     │     │  │  │  ├─ terminal_theme.py
│     │     │  │  │  ├─ text.py
│     │     │  │  │  ├─ theme.py
│     │     │  │  │  ├─ themes.py
│     │     │  │  │  ├─ traceback.py
│     │     │  │  │  ├─ tree.py
│     │     │  │  │  ├─ _cell_widths.py
│     │     │  │  │  ├─ _emoji_codes.py
│     │     │  │  │  ├─ _emoji_replace.py
│     │     │  │  │  ├─ _export_format.py
│     │     │  │  │  ├─ _extension.py
│     │     │  │  │  ├─ _fileno.py
│     │     │  │  │  ├─ _inspect.py
│     │     │  │  │  ├─ _log_render.py
│     │     │  │  │  ├─ _loop.py
│     │     │  │  │  ├─ _null_file.py
│     │     │  │  │  ├─ _palettes.py
│     │     │  │  │  ├─ _pick.py
│     │     │  │  │  ├─ _ratio.py
│     │     │  │  │  ├─ _spinners.py
│     │     │  │  │  ├─ _stack.py
│     │     │  │  │  ├─ _timer.py
│     │     │  │  │  ├─ _win32_console.py
│     │     │  │  │  ├─ _windows.py
│     │     │  │  │  ├─ _windows_renderer.py
│     │     │  │  │  ├─ _wrap.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __main__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ abc.cpython-312.pyc
│     │     │  │  │     ├─ align.cpython-312.pyc
│     │     │  │  │     ├─ ansi.cpython-312.pyc
│     │     │  │  │     ├─ bar.cpython-312.pyc
│     │     │  │  │     ├─ box.cpython-312.pyc
│     │     │  │  │     ├─ cells.cpython-312.pyc
│     │     │  │  │     ├─ color.cpython-312.pyc
│     │     │  │  │     ├─ color_triplet.cpython-312.pyc
│     │     │  │  │     ├─ columns.cpython-312.pyc
│     │     │  │  │     ├─ console.cpython-312.pyc
│     │     │  │  │     ├─ constrain.cpython-312.pyc
│     │     │  │  │     ├─ containers.cpython-312.pyc
│     │     │  │  │     ├─ control.cpython-312.pyc
│     │     │  │  │     ├─ default_styles.cpython-312.pyc
│     │     │  │  │     ├─ diagnose.cpython-312.pyc
│     │     │  │  │     ├─ emoji.cpython-312.pyc
│     │     │  │  │     ├─ errors.cpython-312.pyc
│     │     │  │  │     ├─ filesize.cpython-312.pyc
│     │     │  │  │     ├─ file_proxy.cpython-312.pyc
│     │     │  │  │     ├─ highlighter.cpython-312.pyc
│     │     │  │  │     ├─ json.cpython-312.pyc
│     │     │  │  │     ├─ jupyter.cpython-312.pyc
│     │     │  │  │     ├─ layout.cpython-312.pyc
│     │     │  │  │     ├─ live.cpython-312.pyc
│     │     │  │  │     ├─ live_render.cpython-312.pyc
│     │     │  │  │     ├─ logging.cpython-312.pyc
│     │     │  │  │     ├─ markup.cpython-312.pyc
│     │     │  │  │     ├─ measure.cpython-312.pyc
│     │     │  │  │     ├─ padding.cpython-312.pyc
│     │     │  │  │     ├─ pager.cpython-312.pyc
│     │     │  │  │     ├─ palette.cpython-312.pyc
│     │     │  │  │     ├─ panel.cpython-312.pyc
│     │     │  │  │     ├─ pretty.cpython-312.pyc
│     │     │  │  │     ├─ progress.cpython-312.pyc
│     │     │  │  │     ├─ progress_bar.cpython-312.pyc
│     │     │  │  │     ├─ prompt.cpython-312.pyc
│     │     │  │  │     ├─ protocol.cpython-312.pyc
│     │     │  │  │     ├─ region.cpython-312.pyc
│     │     │  │  │     ├─ repr.cpython-312.pyc
│     │     │  │  │     ├─ rule.cpython-312.pyc
│     │     │  │  │     ├─ scope.cpython-312.pyc
│     │     │  │  │     ├─ screen.cpython-312.pyc
│     │     │  │  │     ├─ segment.cpython-312.pyc
│     │     │  │  │     ├─ spinner.cpython-312.pyc
│     │     │  │  │     ├─ status.cpython-312.pyc
│     │     │  │  │     ├─ style.cpython-312.pyc
│     │     │  │  │     ├─ styled.cpython-312.pyc
│     │     │  │  │     ├─ syntax.cpython-312.pyc
│     │     │  │  │     ├─ table.cpython-312.pyc
│     │     │  │  │     ├─ terminal_theme.cpython-312.pyc
│     │     │  │  │     ├─ text.cpython-312.pyc
│     │     │  │  │     ├─ theme.cpython-312.pyc
│     │     │  │  │     ├─ themes.cpython-312.pyc
│     │     │  │  │     ├─ traceback.cpython-312.pyc
│     │     │  │  │     ├─ tree.cpython-312.pyc
│     │     │  │  │     ├─ _cell_widths.cpython-312.pyc
│     │     │  │  │     ├─ _emoji_codes.cpython-312.pyc
│     │     │  │  │     ├─ _emoji_replace.cpython-312.pyc
│     │     │  │  │     ├─ _export_format.cpython-312.pyc
│     │     │  │  │     ├─ _extension.cpython-312.pyc
│     │     │  │  │     ├─ _fileno.cpython-312.pyc
│     │     │  │  │     ├─ _inspect.cpython-312.pyc
│     │     │  │  │     ├─ _log_render.cpython-312.pyc
│     │     │  │  │     ├─ _loop.cpython-312.pyc
│     │     │  │  │     ├─ _null_file.cpython-312.pyc
│     │     │  │  │     ├─ _palettes.cpython-312.pyc
│     │     │  │  │     ├─ _pick.cpython-312.pyc
│     │     │  │  │     ├─ _ratio.cpython-312.pyc
│     │     │  │  │     ├─ _spinners.cpython-312.pyc
│     │     │  │  │     ├─ _stack.cpython-312.pyc
│     │     │  │  │     ├─ _timer.cpython-312.pyc
│     │     │  │  │     ├─ _win32_console.cpython-312.pyc
│     │     │  │  │     ├─ _windows.cpython-312.pyc
│     │     │  │  │     ├─ _windows_renderer.cpython-312.pyc
│     │     │  │  │     ├─ _wrap.cpython-312.pyc
│     │     │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  ├─ tomli
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _parser.py
│     │     │  │  │  ├─ _re.py
│     │     │  │  │  ├─ _types.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ _parser.cpython-312.pyc
│     │     │  │  │     ├─ _re.cpython-312.pyc
│     │     │  │  │     ├─ _types.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ tomli_w
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _writer.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ _writer.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ truststore
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _api.py
│     │     │  │  │  ├─ _macos.py
│     │     │  │  │  ├─ _openssl.py
│     │     │  │  │  ├─ _ssl_constants.py
│     │     │  │  │  ├─ _windows.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ _api.cpython-312.pyc
│     │     │  │  │     ├─ _macos.cpython-312.pyc
│     │     │  │  │     ├─ _openssl.cpython-312.pyc
│     │     │  │  │     ├─ _ssl_constants.cpython-312.pyc
│     │     │  │  │     ├─ _windows.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ typing_extensions.py
│     │     │  │  ├─ urllib3
│     │     │  │  │  ├─ connection.py
│     │     │  │  │  ├─ connectionpool.py
│     │     │  │  │  ├─ contrib
│     │     │  │  │  │  ├─ appengine.py
│     │     │  │  │  │  ├─ ntlmpool.py
│     │     │  │  │  │  ├─ pyopenssl.py
│     │     │  │  │  │  ├─ securetransport.py
│     │     │  │  │  │  ├─ socks.py
│     │     │  │  │  │  ├─ _appengine_environ.py
│     │     │  │  │  │  ├─ _securetransport
│     │     │  │  │  │  │  ├─ bindings.py
│     │     │  │  │  │  │  ├─ low_level.py
│     │     │  │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  │  └─ __pycache__
│     │     │  │  │  │  │     ├─ bindings.cpython-312.pyc
│     │     │  │  │  │  │     ├─ low_level.cpython-312.pyc
│     │     │  │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ appengine.cpython-312.pyc
│     │     │  │  │  │     ├─ ntlmpool.cpython-312.pyc
│     │     │  │  │  │     ├─ pyopenssl.cpython-312.pyc
│     │     │  │  │  │     ├─ securetransport.cpython-312.pyc
│     │     │  │  │  │     ├─ socks.cpython-312.pyc
│     │     │  │  │  │     ├─ _appengine_environ.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ exceptions.py
│     │     │  │  │  ├─ fields.py
│     │     │  │  │  ├─ filepost.py
│     │     │  │  │  ├─ packages
│     │     │  │  │  │  ├─ backports
│     │     │  │  │  │  │  ├─ makefile.py
│     │     │  │  │  │  │  ├─ weakref_finalize.py
│     │     │  │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  │  └─ __pycache__
│     │     │  │  │  │  │     ├─ makefile.cpython-312.pyc
│     │     │  │  │  │  │     ├─ weakref_finalize.cpython-312.pyc
│     │     │  │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  │  ├─ six.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ six.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ poolmanager.py
│     │     │  │  │  ├─ request.py
│     │     │  │  │  ├─ response.py
│     │     │  │  │  ├─ util
│     │     │  │  │  │  ├─ connection.py
│     │     │  │  │  │  ├─ proxy.py
│     │     │  │  │  │  ├─ queue.py
│     │     │  │  │  │  ├─ request.py
│     │     │  │  │  │  ├─ response.py
│     │     │  │  │  │  ├─ retry.py
│     │     │  │  │  │  ├─ ssltransport.py
│     │     │  │  │  │  ├─ ssl_.py
│     │     │  │  │  │  ├─ ssl_match_hostname.py
│     │     │  │  │  │  ├─ timeout.py
│     │     │  │  │  │  ├─ url.py
│     │     │  │  │  │  ├─ wait.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ connection.cpython-312.pyc
│     │     │  │  │  │     ├─ proxy.cpython-312.pyc
│     │     │  │  │  │     ├─ queue.cpython-312.pyc
│     │     │  │  │  │     ├─ request.cpython-312.pyc
│     │     │  │  │  │     ├─ response.cpython-312.pyc
│     │     │  │  │  │     ├─ retry.cpython-312.pyc
│     │     │  │  │  │     ├─ ssltransport.cpython-312.pyc
│     │     │  │  │  │     ├─ ssl_.cpython-312.pyc
│     │     │  │  │  │     ├─ ssl_match_hostname.cpython-312.pyc
│     │     │  │  │  │     ├─ timeout.cpython-312.pyc
│     │     │  │  │  │     ├─ url.cpython-312.pyc
│     │     │  │  │  │     ├─ wait.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ _collections.py
│     │     │  │  │  ├─ _version.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ connection.cpython-312.pyc
│     │     │  │  │     ├─ connectionpool.cpython-312.pyc
│     │     │  │  │     ├─ exceptions.cpython-312.pyc
│     │     │  │  │     ├─ fields.cpython-312.pyc
│     │     │  │  │     ├─ filepost.cpython-312.pyc
│     │     │  │  │     ├─ poolmanager.cpython-312.pyc
│     │     │  │  │     ├─ request.cpython-312.pyc
│     │     │  │  │     ├─ response.cpython-312.pyc
│     │     │  │  │     ├─ _collections.cpython-312.pyc
│     │     │  │  │     ├─ _version.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ vendor.txt
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ typing_extensions.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  ├─ __pip-runner__.py
│     │     │  └─ __pycache__
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     ├─ __main__.cpython-312.pyc
│     │     │     └─ __pip-runner__.cpython-312.pyc
│     │     ├─ pip-25.1.1.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  ├─ AUTHORS.txt
│     │     │  │  └─ LICENSE.txt
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ pkg_resources
│     │     │  ├─ api_tests.txt
│     │     │  ├─ py.typed
│     │     │  ├─ tests
│     │     │  │  ├─ data
│     │     │  │  │  ├─ my-test-package-source
│     │     │  │  │  │  ├─ setup.cfg
│     │     │  │  │  │  ├─ setup.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     └─ setup.cpython-312.pyc
│     │     │  │  │  ├─ my-test-package-zip
│     │     │  │  │  │  └─ my-test-package.zip
│     │     │  │  │  ├─ my-test-package_unpacked-egg
│     │     │  │  │  │  └─ my_test_package-1.0-py3.7.egg
│     │     │  │  │  │     └─ EGG-INFO
│     │     │  │  │  │        ├─ dependency_links.txt
│     │     │  │  │  │        ├─ PKG-INFO
│     │     │  │  │  │        ├─ SOURCES.txt
│     │     │  │  │  │        ├─ top_level.txt
│     │     │  │  │  │        └─ zip-safe
│     │     │  │  │  └─ my-test-package_zipped-egg
│     │     │  │  │     └─ my_test_package-1.0-py3.7.egg
│     │     │  │  ├─ test_find_distributions.py
│     │     │  │  ├─ test_integration_zope_interface.py
│     │     │  │  ├─ test_markers.py
│     │     │  │  ├─ test_pkg_resources.py
│     │     │  │  ├─ test_resources.py
│     │     │  │  ├─ test_working_set.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ test_find_distributions.cpython-312.pyc
│     │     │  │     ├─ test_integration_zope_interface.cpython-312.pyc
│     │     │  │     ├─ test_markers.cpython-312.pyc
│     │     │  │     ├─ test_pkg_resources.cpython-312.pyc
│     │     │  │     ├─ test_resources.cpython-312.pyc
│     │     │  │     ├─ test_working_set.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ pluggy
│     │     │  ├─ py.typed
│     │     │  ├─ _callers.py
│     │     │  ├─ _hooks.py
│     │     │  ├─ _manager.py
│     │     │  ├─ _result.py
│     │     │  ├─ _tracing.py
│     │     │  ├─ _version.py
│     │     │  ├─ _warnings.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ _callers.cpython-312.pyc
│     │     │     ├─ _hooks.cpython-312.pyc
│     │     │     ├─ _manager.cpython-312.pyc
│     │     │     ├─ _result.cpython-312.pyc
│     │     │     ├─ _tracing.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     ├─ _warnings.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ pluggy-1.6.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ postgrest
│     │     │  ├─ base_client.py
│     │     │  ├─ base_request_builder.py
│     │     │  ├─ constants.py
│     │     │  ├─ deprecated_client.py
│     │     │  ├─ deprecated_get_request_builder.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ py.typed
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ _async
│     │     │  │  ├─ client.py
│     │     │  │  ├─ request_builder.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ request_builder.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _sync
│     │     │  │  ├─ client.py
│     │     │  │  ├─ request_builder.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ request_builder.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ base_client.cpython-312.pyc
│     │     │     ├─ base_request_builder.cpython-312.pyc
│     │     │     ├─ constants.cpython-312.pyc
│     │     │     ├─ deprecated_client.cpython-312.pyc
│     │     │     ├─ deprecated_get_request_builder.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ postgrest-1.0.2.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ propcache
│     │     │  ├─ api.py
│     │     │  ├─ py.typed
│     │     │  ├─ _helpers.py
│     │     │  ├─ _helpers_c.cp312-win_amd64.pyd
│     │     │  ├─ _helpers_c.pyx
│     │     │  ├─ _helpers_py.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ api.cpython-312.pyc
│     │     │     ├─ _helpers.cpython-312.pyc
│     │     │     ├─ _helpers_py.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ propcache-0.3.1.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  ├─ LICENSE
│     │     │  │  └─ NOTICE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ py.py
│     │     ├─ pydantic
│     │     │  ├─ aliases.py
│     │     │  ├─ alias_generators.py
│     │     │  ├─ annotated_handlers.py
│     │     │  ├─ class_validators.py
│     │     │  ├─ color.py
│     │     │  ├─ config.py
│     │     │  ├─ dataclasses.py
│     │     │  ├─ datetime_parse.py
│     │     │  ├─ decorator.py
│     │     │  ├─ deprecated
│     │     │  │  ├─ class_validators.py
│     │     │  │  ├─ config.py
│     │     │  │  ├─ copy_internals.py
│     │     │  │  ├─ decorator.py
│     │     │  │  ├─ json.py
│     │     │  │  ├─ parse.py
│     │     │  │  ├─ tools.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ class_validators.cpython-312.pyc
│     │     │  │     ├─ config.cpython-312.pyc
│     │     │  │     ├─ copy_internals.cpython-312.pyc
│     │     │  │     ├─ decorator.cpython-312.pyc
│     │     │  │     ├─ json.cpython-312.pyc
│     │     │  │     ├─ parse.cpython-312.pyc
│     │     │  │     ├─ tools.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ env_settings.py
│     │     │  ├─ errors.py
│     │     │  ├─ error_wrappers.py
│     │     │  ├─ experimental
│     │     │  │  ├─ arguments_schema.py
│     │     │  │  ├─ pipeline.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ arguments_schema.cpython-312.pyc
│     │     │  │     ├─ pipeline.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ fields.py
│     │     │  ├─ functional_serializers.py
│     │     │  ├─ functional_validators.py
│     │     │  ├─ generics.py
│     │     │  ├─ json.py
│     │     │  ├─ json_schema.py
│     │     │  ├─ main.py
│     │     │  ├─ mypy.py
│     │     │  ├─ networks.py
│     │     │  ├─ parse.py
│     │     │  ├─ plugin
│     │     │  │  ├─ _loader.py
│     │     │  │  ├─ _schema_validator.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ _loader.cpython-312.pyc
│     │     │  │     ├─ _schema_validator.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ py.typed
│     │     │  ├─ root_model.py
│     │     │  ├─ schema.py
│     │     │  ├─ tools.py
│     │     │  ├─ types.py
│     │     │  ├─ type_adapter.py
│     │     │  ├─ typing.py
│     │     │  ├─ utils.py
│     │     │  ├─ v1
│     │     │  │  ├─ annotated_types.py
│     │     │  │  ├─ class_validators.py
│     │     │  │  ├─ color.py
│     │     │  │  ├─ config.py
│     │     │  │  ├─ dataclasses.py
│     │     │  │  ├─ datetime_parse.py
│     │     │  │  ├─ decorator.py
│     │     │  │  ├─ env_settings.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ error_wrappers.py
│     │     │  │  ├─ fields.py
│     │     │  │  ├─ generics.py
│     │     │  │  ├─ json.py
│     │     │  │  ├─ main.py
│     │     │  │  ├─ mypy.py
│     │     │  │  ├─ networks.py
│     │     │  │  ├─ parse.py
│     │     │  │  ├─ py.typed
│     │     │  │  ├─ schema.py
│     │     │  │  ├─ tools.py
│     │     │  │  ├─ types.py
│     │     │  │  ├─ typing.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ validators.py
│     │     │  │  ├─ version.py
│     │     │  │  ├─ _hypothesis_plugin.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ annotated_types.cpython-312.pyc
│     │     │  │     ├─ class_validators.cpython-312.pyc
│     │     │  │     ├─ color.cpython-312.pyc
│     │     │  │     ├─ config.cpython-312.pyc
│     │     │  │     ├─ dataclasses.cpython-312.pyc
│     │     │  │     ├─ datetime_parse.cpython-312.pyc
│     │     │  │     ├─ decorator.cpython-312.pyc
│     │     │  │     ├─ env_settings.cpython-312.pyc
│     │     │  │     ├─ errors.cpython-312.pyc
│     │     │  │     ├─ error_wrappers.cpython-312.pyc
│     │     │  │     ├─ fields.cpython-312.pyc
│     │     │  │     ├─ generics.cpython-312.pyc
│     │     │  │     ├─ json.cpython-312.pyc
│     │     │  │     ├─ main.cpython-312.pyc
│     │     │  │     ├─ mypy.cpython-312.pyc
│     │     │  │     ├─ networks.cpython-312.pyc
│     │     │  │     ├─ parse.cpython-312.pyc
│     │     │  │     ├─ schema.cpython-312.pyc
│     │     │  │     ├─ tools.cpython-312.pyc
│     │     │  │     ├─ types.cpython-312.pyc
│     │     │  │     ├─ typing.cpython-312.pyc
│     │     │  │     ├─ utils.cpython-312.pyc
│     │     │  │     ├─ validators.cpython-312.pyc
│     │     │  │     ├─ version.cpython-312.pyc
│     │     │  │     ├─ _hypothesis_plugin.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ validate_call_decorator.py
│     │     │  ├─ validators.py
│     │     │  ├─ version.py
│     │     │  ├─ warnings.py
│     │     │  ├─ _internal
│     │     │  │  ├─ _config.py
│     │     │  │  ├─ _core_metadata.py
│     │     │  │  ├─ _core_utils.py
│     │     │  │  ├─ _dataclasses.py
│     │     │  │  ├─ _decorators.py
│     │     │  │  ├─ _decorators_v1.py
│     │     │  │  ├─ _discriminated_union.py
│     │     │  │  ├─ _docs_extraction.py
│     │     │  │  ├─ _fields.py
│     │     │  │  ├─ _forward_ref.py
│     │     │  │  ├─ _generate_schema.py
│     │     │  │  ├─ _generics.py
│     │     │  │  ├─ _git.py
│     │     │  │  ├─ _import_utils.py
│     │     │  │  ├─ _internal_dataclass.py
│     │     │  │  ├─ _known_annotated_metadata.py
│     │     │  │  ├─ _mock_val_ser.py
│     │     │  │  ├─ _model_construction.py
│     │     │  │  ├─ _namespace_utils.py
│     │     │  │  ├─ _repr.py
│     │     │  │  ├─ _schema_gather.py
│     │     │  │  ├─ _schema_generation_shared.py
│     │     │  │  ├─ _serializers.py
│     │     │  │  ├─ _signature.py
│     │     │  │  ├─ _typing_extra.py
│     │     │  │  ├─ _utils.py
│     │     │  │  ├─ _validate_call.py
│     │     │  │  ├─ _validators.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ _config.cpython-312.pyc
│     │     │  │     ├─ _core_metadata.cpython-312.pyc
│     │     │  │     ├─ _core_utils.cpython-312.pyc
│     │     │  │     ├─ _dataclasses.cpython-312.pyc
│     │     │  │     ├─ _decorators.cpython-312.pyc
│     │     │  │     ├─ _decorators_v1.cpython-312.pyc
│     │     │  │     ├─ _discriminated_union.cpython-312.pyc
│     │     │  │     ├─ _docs_extraction.cpython-312.pyc
│     │     │  │     ├─ _fields.cpython-312.pyc
│     │     │  │     ├─ _forward_ref.cpython-312.pyc
│     │     │  │     ├─ _generate_schema.cpython-312.pyc
│     │     │  │     ├─ _generics.cpython-312.pyc
│     │     │  │     ├─ _git.cpython-312.pyc
│     │     │  │     ├─ _import_utils.cpython-312.pyc
│     │     │  │     ├─ _internal_dataclass.cpython-312.pyc
│     │     │  │     ├─ _known_annotated_metadata.cpython-312.pyc
│     │     │  │     ├─ _mock_val_ser.cpython-312.pyc
│     │     │  │     ├─ _model_construction.cpython-312.pyc
│     │     │  │     ├─ _namespace_utils.cpython-312.pyc
│     │     │  │     ├─ _repr.cpython-312.pyc
│     │     │  │     ├─ _schema_gather.cpython-312.pyc
│     │     │  │     ├─ _schema_generation_shared.cpython-312.pyc
│     │     │  │     ├─ _serializers.cpython-312.pyc
│     │     │  │     ├─ _signature.cpython-312.pyc
│     │     │  │     ├─ _typing_extra.cpython-312.pyc
│     │     │  │     ├─ _utils.cpython-312.pyc
│     │     │  │     ├─ _validate_call.cpython-312.pyc
│     │     │  │     ├─ _validators.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _migration.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ aliases.cpython-312.pyc
│     │     │     ├─ alias_generators.cpython-312.pyc
│     │     │     ├─ annotated_handlers.cpython-312.pyc
│     │     │     ├─ class_validators.cpython-312.pyc
│     │     │     ├─ color.cpython-312.pyc
│     │     │     ├─ config.cpython-312.pyc
│     │     │     ├─ dataclasses.cpython-312.pyc
│     │     │     ├─ datetime_parse.cpython-312.pyc
│     │     │     ├─ decorator.cpython-312.pyc
│     │     │     ├─ env_settings.cpython-312.pyc
│     │     │     ├─ errors.cpython-312.pyc
│     │     │     ├─ error_wrappers.cpython-312.pyc
│     │     │     ├─ fields.cpython-312.pyc
│     │     │     ├─ functional_serializers.cpython-312.pyc
│     │     │     ├─ functional_validators.cpython-312.pyc
│     │     │     ├─ generics.cpython-312.pyc
│     │     │     ├─ json.cpython-312.pyc
│     │     │     ├─ json_schema.cpython-312.pyc
│     │     │     ├─ main.cpython-312.pyc
│     │     │     ├─ mypy.cpython-312.pyc
│     │     │     ├─ networks.cpython-312.pyc
│     │     │     ├─ parse.cpython-312.pyc
│     │     │     ├─ root_model.cpython-312.pyc
│     │     │     ├─ schema.cpython-312.pyc
│     │     │     ├─ tools.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ type_adapter.cpython-312.pyc
│     │     │     ├─ typing.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ validate_call_decorator.cpython-312.pyc
│     │     │     ├─ validators.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     ├─ warnings.cpython-312.pyc
│     │     │     ├─ _migration.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ pydantic-2.11.5.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ pydantic_core
│     │     │  ├─ core_schema.py
│     │     │  ├─ py.typed
│     │     │  ├─ _pydantic_core.cp312-win_amd64.pyd
│     │     │  ├─ _pydantic_core.pyi
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ core_schema.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ pydantic_core-2.33.2.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ PyJWT-2.10.1.dist-info
│     │     │  ├─ AUTHORS.rst
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ pytest
│     │     │  ├─ py.typed
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pycache__
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     └─ __main__.cpython-312.pyc
│     │     ├─ pytest-8.3.5.dist-info
│     │     │  ├─ AUTHORS
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ pytest_mock
│     │     │  ├─ plugin.py
│     │     │  ├─ py.typed
│     │     │  ├─ _util.py
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ plugin.cpython-312-pytest-8.3.5.pyc
│     │     │     ├─ plugin.cpython-312.pyc
│     │     │     ├─ _util.cpython-312-pytest-8.3.5.pyc
│     │     │     ├─ _util.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312-pytest-8.3.5.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ pytest_mock-3.14.0.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ python_dateutil-2.9.0.post0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  ├─ WHEEL
│     │     │  └─ zip-safe
│     │     ├─ python_decouple-3.8.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ python_dotenv-1.1.0.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ PyYAML-6.0.2.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ realtime
│     │     │  ├─ exceptions.py
│     │     │  ├─ message.py
│     │     │  ├─ transformers.py
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ _async
│     │     │  │  ├─ channel.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ presence.py
│     │     │  │  ├─ push.py
│     │     │  │  ├─ timer.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ channel.cpython-312.pyc
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ presence.cpython-312.pyc
│     │     │  │     ├─ push.cpython-312.pyc
│     │     │  │     ├─ timer.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _sync
│     │     │  │  ├─ channel.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ presence.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ channel.cpython-312.pyc
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ presence.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ message.cpython-312.pyc
│     │     │     ├─ transformers.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ realtime-2.4.3.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ redis
│     │     │  ├─ asyncio
│     │     │  │  ├─ client.py
│     │     │  │  ├─ cluster.py
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ lock.py
│     │     │  │  ├─ retry.py
│     │     │  │  ├─ sentinel.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ cluster.cpython-312.pyc
│     │     │  │     ├─ connection.cpython-312.pyc
│     │     │  │     ├─ lock.cpython-312.pyc
│     │     │  │     ├─ retry.cpython-312.pyc
│     │     │  │     ├─ sentinel.cpython-312.pyc
│     │     │  │     ├─ utils.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ auth
│     │     │  │  ├─ err.py
│     │     │  │  ├─ idp.py
│     │     │  │  ├─ token.py
│     │     │  │  ├─ token_manager.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ err.cpython-312.pyc
│     │     │  │     ├─ idp.cpython-312.pyc
│     │     │  │     ├─ token.cpython-312.pyc
│     │     │  │     ├─ token_manager.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ backoff.py
│     │     │  ├─ cache.py
│     │     │  ├─ client.py
│     │     │  ├─ cluster.py
│     │     │  ├─ commands
│     │     │  │  ├─ bf
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ info.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ commands.cpython-312.pyc
│     │     │  │  │     ├─ info.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ cluster.py
│     │     │  │  ├─ core.py
│     │     │  │  ├─ helpers.py
│     │     │  │  ├─ json
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ decoders.py
│     │     │  │  │  ├─ path.py
│     │     │  │  │  ├─ _util.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ commands.cpython-312.pyc
│     │     │  │  │     ├─ decoders.cpython-312.pyc
│     │     │  │  │     ├─ path.cpython-312.pyc
│     │     │  │  │     ├─ _util.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ redismodules.py
│     │     │  │  ├─ search
│     │     │  │  │  ├─ aggregation.py
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ dialect.py
│     │     │  │  │  ├─ document.py
│     │     │  │  │  ├─ field.py
│     │     │  │  │  ├─ index_definition.py
│     │     │  │  │  ├─ profile_information.py
│     │     │  │  │  ├─ query.py
│     │     │  │  │  ├─ querystring.py
│     │     │  │  │  ├─ reducers.py
│     │     │  │  │  ├─ result.py
│     │     │  │  │  ├─ suggestion.py
│     │     │  │  │  ├─ _util.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ aggregation.cpython-312.pyc
│     │     │  │  │     ├─ commands.cpython-312.pyc
│     │     │  │  │     ├─ dialect.cpython-312.pyc
│     │     │  │  │     ├─ document.cpython-312.pyc
│     │     │  │  │     ├─ field.cpython-312.pyc
│     │     │  │  │     ├─ index_definition.cpython-312.pyc
│     │     │  │  │     ├─ profile_information.cpython-312.pyc
│     │     │  │  │     ├─ query.cpython-312.pyc
│     │     │  │  │     ├─ querystring.cpython-312.pyc
│     │     │  │  │     ├─ reducers.cpython-312.pyc
│     │     │  │  │     ├─ result.cpython-312.pyc
│     │     │  │  │     ├─ suggestion.cpython-312.pyc
│     │     │  │  │     ├─ _util.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ sentinel.py
│     │     │  │  ├─ timeseries
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ info.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ commands.cpython-312.pyc
│     │     │  │  │     ├─ info.cpython-312.pyc
│     │     │  │  │     ├─ utils.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ vectorset
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ commands.cpython-312.pyc
│     │     │  │  │     ├─ utils.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ cluster.cpython-312.pyc
│     │     │  │     ├─ core.cpython-312.pyc
│     │     │  │     ├─ helpers.cpython-312.pyc
│     │     │  │     ├─ redismodules.cpython-312.pyc
│     │     │  │     ├─ sentinel.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ connection.py
│     │     │  ├─ crc.py
│     │     │  ├─ credentials.py
│     │     │  ├─ event.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ lock.py
│     │     │  ├─ ocsp.py
│     │     │  ├─ py.typed
│     │     │  ├─ retry.py
│     │     │  ├─ sentinel.py
│     │     │  ├─ typing.py
│     │     │  ├─ utils.py
│     │     │  ├─ _parsers
│     │     │  │  ├─ base.py
│     │     │  │  ├─ commands.py
│     │     │  │  ├─ encoders.py
│     │     │  │  ├─ helpers.py
│     │     │  │  ├─ hiredis.py
│     │     │  │  ├─ resp2.py
│     │     │  │  ├─ resp3.py
│     │     │  │  ├─ socket.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ base.cpython-312.pyc
│     │     │  │     ├─ commands.cpython-312.pyc
│     │     │  │     ├─ encoders.cpython-312.pyc
│     │     │  │     ├─ helpers.cpython-312.pyc
│     │     │  │     ├─ hiredis.cpython-312.pyc
│     │     │  │     ├─ resp2.cpython-312.pyc
│     │     │  │     ├─ resp3.cpython-312.pyc
│     │     │  │     ├─ socket.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ backoff.cpython-312.pyc
│     │     │     ├─ cache.cpython-312.pyc
│     │     │     ├─ client.cpython-312.pyc
│     │     │     ├─ cluster.cpython-312.pyc
│     │     │     ├─ connection.cpython-312.pyc
│     │     │     ├─ crc.cpython-312.pyc
│     │     │     ├─ credentials.cpython-312.pyc
│     │     │     ├─ event.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ lock.cpython-312.pyc
│     │     │     ├─ ocsp.cpython-312.pyc
│     │     │     ├─ retry.cpython-312.pyc
│     │     │     ├─ sentinel.cpython-312.pyc
│     │     │     ├─ typing.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ redis-6.1.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  └─ WHEEL
│     │     ├─ requests
│     │     │  ├─ adapters.py
│     │     │  ├─ api.py
│     │     │  ├─ auth.py
│     │     │  ├─ certs.py
│     │     │  ├─ compat.py
│     │     │  ├─ cookies.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ help.py
│     │     │  ├─ hooks.py
│     │     │  ├─ models.py
│     │     │  ├─ packages.py
│     │     │  ├─ sessions.py
│     │     │  ├─ status_codes.py
│     │     │  ├─ structures.py
│     │     │  ├─ utils.py
│     │     │  ├─ _internal_utils.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __pycache__
│     │     │  │  ├─ adapters.cpython-312.pyc
│     │     │  │  ├─ api.cpython-312.pyc
│     │     │  │  ├─ auth.cpython-312.pyc
│     │     │  │  ├─ certs.cpython-312.pyc
│     │     │  │  ├─ compat.cpython-312.pyc
│     │     │  │  ├─ cookies.cpython-312.pyc
│     │     │  │  ├─ exceptions.cpython-312.pyc
│     │     │  │  ├─ help.cpython-312.pyc
│     │     │  │  ├─ hooks.cpython-312.pyc
│     │     │  │  ├─ models.cpython-312.pyc
│     │     │  │  ├─ packages.cpython-312.pyc
│     │     │  │  ├─ sessions.cpython-312.pyc
│     │     │  │  ├─ status_codes.cpython-312.pyc
│     │     │  │  ├─ structures.cpython-312.pyc
│     │     │  │  ├─ utils.cpython-312.pyc
│     │     │  │  ├─ _internal_utils.cpython-312.pyc
│     │     │  │  ├─ __init__.cpython-312.pyc
│     │     │  │  └─ __version__.cpython-312.pyc
│     │     │  └─ __version__.py
│     │     ├─ requests-2.32.3.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ setuptools
│     │     │  ├─ archive_util.py
│     │     │  ├─ build_meta.py
│     │     │  ├─ cli-32.exe
│     │     │  ├─ cli-64.exe
│     │     │  ├─ cli-arm64.exe
│     │     │  ├─ cli.exe
│     │     │  ├─ command
│     │     │  │  ├─ alias.py
│     │     │  │  ├─ bdist_egg.py
│     │     │  │  ├─ bdist_rpm.py
│     │     │  │  ├─ bdist_wheel.py
│     │     │  │  ├─ build.py
│     │     │  │  ├─ build_clib.py
│     │     │  │  ├─ build_ext.py
│     │     │  │  ├─ build_py.py
│     │     │  │  ├─ develop.py
│     │     │  │  ├─ dist_info.py
│     │     │  │  ├─ easy_install.py
│     │     │  │  ├─ editable_wheel.py
│     │     │  │  ├─ egg_info.py
│     │     │  │  ├─ install.py
│     │     │  │  ├─ install_egg_info.py
│     │     │  │  ├─ install_lib.py
│     │     │  │  ├─ install_scripts.py
│     │     │  │  ├─ launcher manifest.xml
│     │     │  │  ├─ rotate.py
│     │     │  │  ├─ saveopts.py
│     │     │  │  ├─ sdist.py
│     │     │  │  ├─ setopt.py
│     │     │  │  ├─ test.py
│     │     │  │  ├─ _requirestxt.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ alias.cpython-312.pyc
│     │     │  │     ├─ bdist_egg.cpython-312.pyc
│     │     │  │     ├─ bdist_rpm.cpython-312.pyc
│     │     │  │     ├─ bdist_wheel.cpython-312.pyc
│     │     │  │     ├─ build.cpython-312.pyc
│     │     │  │     ├─ build_clib.cpython-312.pyc
│     │     │  │     ├─ build_ext.cpython-312.pyc
│     │     │  │     ├─ build_py.cpython-312.pyc
│     │     │  │     ├─ develop.cpython-312.pyc
│     │     │  │     ├─ dist_info.cpython-312.pyc
│     │     │  │     ├─ easy_install.cpython-312.pyc
│     │     │  │     ├─ editable_wheel.cpython-312.pyc
│     │     │  │     ├─ egg_info.cpython-312.pyc
│     │     │  │     ├─ install.cpython-312.pyc
│     │     │  │     ├─ install_egg_info.cpython-312.pyc
│     │     │  │     ├─ install_lib.cpython-312.pyc
│     │     │  │     ├─ install_scripts.cpython-312.pyc
│     │     │  │     ├─ rotate.cpython-312.pyc
│     │     │  │     ├─ saveopts.cpython-312.pyc
│     │     │  │     ├─ sdist.cpython-312.pyc
│     │     │  │     ├─ setopt.cpython-312.pyc
│     │     │  │     ├─ test.cpython-312.pyc
│     │     │  │     ├─ _requirestxt.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ compat
│     │     │  │  ├─ py310.py
│     │     │  │  ├─ py311.py
│     │     │  │  ├─ py312.py
│     │     │  │  ├─ py39.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ py310.cpython-312.pyc
│     │     │  │     ├─ py311.cpython-312.pyc
│     │     │  │     ├─ py312.cpython-312.pyc
│     │     │  │     ├─ py39.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ config
│     │     │  │  ├─ distutils.schema.json
│     │     │  │  ├─ expand.py
│     │     │  │  ├─ NOTICE
│     │     │  │  ├─ pyprojecttoml.py
│     │     │  │  ├─ setupcfg.py
│     │     │  │  ├─ setuptools.schema.json
│     │     │  │  ├─ _apply_pyprojecttoml.py
│     │     │  │  ├─ _validate_pyproject
│     │     │  │  │  ├─ error_reporting.py
│     │     │  │  │  ├─ extra_validations.py
│     │     │  │  │  ├─ fastjsonschema_exceptions.py
│     │     │  │  │  ├─ fastjsonschema_validations.py
│     │     │  │  │  ├─ formats.py
│     │     │  │  │  ├─ NOTICE
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ error_reporting.cpython-312.pyc
│     │     │  │  │     ├─ extra_validations.cpython-312.pyc
│     │     │  │  │     ├─ fastjsonschema_exceptions.cpython-312.pyc
│     │     │  │  │     ├─ fastjsonschema_validations.cpython-312.pyc
│     │     │  │  │     ├─ formats.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ expand.cpython-312.pyc
│     │     │  │     ├─ pyprojecttoml.cpython-312.pyc
│     │     │  │     ├─ setupcfg.cpython-312.pyc
│     │     │  │     ├─ _apply_pyprojecttoml.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ depends.py
│     │     │  ├─ discovery.py
│     │     │  ├─ dist.py
│     │     │  ├─ errors.py
│     │     │  ├─ extension.py
│     │     │  ├─ glob.py
│     │     │  ├─ gui-32.exe
│     │     │  ├─ gui-64.exe
│     │     │  ├─ gui-arm64.exe
│     │     │  ├─ gui.exe
│     │     │  ├─ installer.py
│     │     │  ├─ launch.py
│     │     │  ├─ logging.py
│     │     │  ├─ modified.py
│     │     │  ├─ monkey.py
│     │     │  ├─ msvc.py
│     │     │  ├─ namespaces.py
│     │     │  ├─ script (dev).tmpl
│     │     │  ├─ script.tmpl
│     │     │  ├─ tests
│     │     │  │  ├─ compat
│     │     │  │  │  ├─ py39.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ py39.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ config
│     │     │  │  │  ├─ downloads
│     │     │  │  │  │  ├─ preload.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ preload.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ setupcfg_examples.txt
│     │     │  │  │  ├─ test_apply_pyprojecttoml.py
│     │     │  │  │  ├─ test_expand.py
│     │     │  │  │  ├─ test_pyprojecttoml.py
│     │     │  │  │  ├─ test_pyprojecttoml_dynamic_deps.py
│     │     │  │  │  ├─ test_setupcfg.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ test_apply_pyprojecttoml.cpython-312.pyc
│     │     │  │  │     ├─ test_expand.cpython-312.pyc
│     │     │  │  │     ├─ test_pyprojecttoml.cpython-312.pyc
│     │     │  │  │     ├─ test_pyprojecttoml_dynamic_deps.cpython-312.pyc
│     │     │  │  │     ├─ test_setupcfg.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ contexts.py
│     │     │  │  ├─ environment.py
│     │     │  │  ├─ fixtures.py
│     │     │  │  ├─ indexes
│     │     │  │  │  └─ test_links_priority
│     │     │  │  │     ├─ external.html
│     │     │  │  │     └─ simple
│     │     │  │  │        └─ foobar
│     │     │  │  │           └─ index.html
│     │     │  │  ├─ integration
│     │     │  │  │  ├─ helpers.py
│     │     │  │  │  ├─ test_pbr.py
│     │     │  │  │  ├─ test_pip_install_sdist.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ helpers.cpython-312.pyc
│     │     │  │  │     ├─ test_pbr.cpython-312.pyc
│     │     │  │  │     ├─ test_pip_install_sdist.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ mod_with_constant.py
│     │     │  │  ├─ namespaces.py
│     │     │  │  ├─ script-with-bom.py
│     │     │  │  ├─ test_archive_util.py
│     │     │  │  ├─ test_bdist_deprecations.py
│     │     │  │  ├─ test_bdist_egg.py
│     │     │  │  ├─ test_bdist_wheel.py
│     │     │  │  ├─ test_build.py
│     │     │  │  ├─ test_build_clib.py
│     │     │  │  ├─ test_build_ext.py
│     │     │  │  ├─ test_build_meta.py
│     │     │  │  ├─ test_build_py.py
│     │     │  │  ├─ test_config_discovery.py
│     │     │  │  ├─ test_core_metadata.py
│     │     │  │  ├─ test_depends.py
│     │     │  │  ├─ test_develop.py
│     │     │  │  ├─ test_dist.py
│     │     │  │  ├─ test_distutils_adoption.py
│     │     │  │  ├─ test_dist_info.py
│     │     │  │  ├─ test_editable_install.py
│     │     │  │  ├─ test_egg_info.py
│     │     │  │  ├─ test_extern.py
│     │     │  │  ├─ test_find_packages.py
│     │     │  │  ├─ test_find_py_modules.py
│     │     │  │  ├─ test_glob.py
│     │     │  │  ├─ test_install_scripts.py
│     │     │  │  ├─ test_logging.py
│     │     │  │  ├─ test_manifest.py
│     │     │  │  ├─ test_namespaces.py
│     │     │  │  ├─ test_scripts.py
│     │     │  │  ├─ test_sdist.py
│     │     │  │  ├─ test_setopt.py
│     │     │  │  ├─ test_setuptools.py
│     │     │  │  ├─ test_shutil_wrapper.py
│     │     │  │  ├─ test_unicode_utils.py
│     │     │  │  ├─ test_virtualenv.py
│     │     │  │  ├─ test_warnings.py
│     │     │  │  ├─ test_wheel.py
│     │     │  │  ├─ test_windows_wrappers.py
│     │     │  │  ├─ text.py
│     │     │  │  ├─ textwrap.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ contexts.cpython-312.pyc
│     │     │  │     ├─ environment.cpython-312.pyc
│     │     │  │     ├─ fixtures.cpython-312.pyc
│     │     │  │     ├─ mod_with_constant.cpython-312.pyc
│     │     │  │     ├─ namespaces.cpython-312.pyc
│     │     │  │     ├─ script-with-bom.cpython-312.pyc
│     │     │  │     ├─ test_archive_util.cpython-312.pyc
│     │     │  │     ├─ test_bdist_deprecations.cpython-312.pyc
│     │     │  │     ├─ test_bdist_egg.cpython-312.pyc
│     │     │  │     ├─ test_bdist_wheel.cpython-312.pyc
│     │     │  │     ├─ test_build.cpython-312.pyc
│     │     │  │     ├─ test_build_clib.cpython-312.pyc
│     │     │  │     ├─ test_build_ext.cpython-312.pyc
│     │     │  │     ├─ test_build_meta.cpython-312.pyc
│     │     │  │     ├─ test_build_py.cpython-312.pyc
│     │     │  │     ├─ test_config_discovery.cpython-312.pyc
│     │     │  │     ├─ test_core_metadata.cpython-312.pyc
│     │     │  │     ├─ test_depends.cpython-312.pyc
│     │     │  │     ├─ test_develop.cpython-312.pyc
│     │     │  │     ├─ test_dist.cpython-312.pyc
│     │     │  │     ├─ test_distutils_adoption.cpython-312.pyc
│     │     │  │     ├─ test_dist_info.cpython-312.pyc
│     │     │  │     ├─ test_editable_install.cpython-312.pyc
│     │     │  │     ├─ test_egg_info.cpython-312.pyc
│     │     │  │     ├─ test_extern.cpython-312.pyc
│     │     │  │     ├─ test_find_packages.cpython-312.pyc
│     │     │  │     ├─ test_find_py_modules.cpython-312.pyc
│     │     │  │     ├─ test_glob.cpython-312.pyc
│     │     │  │     ├─ test_install_scripts.cpython-312.pyc
│     │     │  │     ├─ test_logging.cpython-312.pyc
│     │     │  │     ├─ test_manifest.cpython-312.pyc
│     │     │  │     ├─ test_namespaces.cpython-312.pyc
│     │     │  │     ├─ test_scripts.cpython-312.pyc
│     │     │  │     ├─ test_sdist.cpython-312.pyc
│     │     │  │     ├─ test_setopt.cpython-312.pyc
│     │     │  │     ├─ test_setuptools.cpython-312.pyc
│     │     │  │     ├─ test_shutil_wrapper.cpython-312.pyc
│     │     │  │     ├─ test_unicode_utils.cpython-312.pyc
│     │     │  │     ├─ test_virtualenv.cpython-312.pyc
│     │     │  │     ├─ test_warnings.cpython-312.pyc
│     │     │  │     ├─ test_wheel.cpython-312.pyc
│     │     │  │     ├─ test_windows_wrappers.cpython-312.pyc
│     │     │  │     ├─ text.cpython-312.pyc
│     │     │  │     ├─ textwrap.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ unicode_utils.py
│     │     │  ├─ version.py
│     │     │  ├─ warnings.py
│     │     │  ├─ wheel.py
│     │     │  ├─ windows_support.py
│     │     │  ├─ _core_metadata.py
│     │     │  ├─ _discovery.py
│     │     │  ├─ _distutils
│     │     │  │  ├─ archive_util.py
│     │     │  │  ├─ ccompiler.py
│     │     │  │  ├─ cmd.py
│     │     │  │  ├─ command
│     │     │  │  │  ├─ bdist.py
│     │     │  │  │  ├─ bdist_dumb.py
│     │     │  │  │  ├─ bdist_rpm.py
│     │     │  │  │  ├─ build.py
│     │     │  │  │  ├─ build_clib.py
│     │     │  │  │  ├─ build_ext.py
│     │     │  │  │  ├─ build_py.py
│     │     │  │  │  ├─ build_scripts.py
│     │     │  │  │  ├─ check.py
│     │     │  │  │  ├─ clean.py
│     │     │  │  │  ├─ config.py
│     │     │  │  │  ├─ install.py
│     │     │  │  │  ├─ install_data.py
│     │     │  │  │  ├─ install_egg_info.py
│     │     │  │  │  ├─ install_headers.py
│     │     │  │  │  ├─ install_lib.py
│     │     │  │  │  ├─ install_scripts.py
│     │     │  │  │  ├─ sdist.py
│     │     │  │  │  ├─ _framework_compat.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ bdist.cpython-312.pyc
│     │     │  │  │     ├─ bdist_dumb.cpython-312.pyc
│     │     │  │  │     ├─ bdist_rpm.cpython-312.pyc
│     │     │  │  │     ├─ build.cpython-312.pyc
│     │     │  │  │     ├─ build_clib.cpython-312.pyc
│     │     │  │  │     ├─ build_ext.cpython-312.pyc
│     │     │  │  │     ├─ build_py.cpython-312.pyc
│     │     │  │  │     ├─ build_scripts.cpython-312.pyc
│     │     │  │  │     ├─ check.cpython-312.pyc
│     │     │  │  │     ├─ clean.cpython-312.pyc
│     │     │  │  │     ├─ config.cpython-312.pyc
│     │     │  │  │     ├─ install.cpython-312.pyc
│     │     │  │  │     ├─ install_data.cpython-312.pyc
│     │     │  │  │     ├─ install_egg_info.cpython-312.pyc
│     │     │  │  │     ├─ install_headers.cpython-312.pyc
│     │     │  │  │     ├─ install_lib.cpython-312.pyc
│     │     │  │  │     ├─ install_scripts.cpython-312.pyc
│     │     │  │  │     ├─ sdist.cpython-312.pyc
│     │     │  │  │     ├─ _framework_compat.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ compat
│     │     │  │  │  ├─ numpy.py
│     │     │  │  │  ├─ py39.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ numpy.cpython-312.pyc
│     │     │  │  │     ├─ py39.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ compilers
│     │     │  │  │  └─ C
│     │     │  │  │     ├─ base.py
│     │     │  │  │     ├─ cygwin.py
│     │     │  │  │     ├─ errors.py
│     │     │  │  │     ├─ msvc.py
│     │     │  │  │     ├─ tests
│     │     │  │  │     │  ├─ test_base.py
│     │     │  │  │     │  ├─ test_cygwin.py
│     │     │  │  │     │  ├─ test_mingw.py
│     │     │  │  │     │  ├─ test_msvc.py
│     │     │  │  │     │  ├─ test_unix.py
│     │     │  │  │     │  └─ __pycache__
│     │     │  │  │     │     ├─ test_base.cpython-312.pyc
│     │     │  │  │     │     ├─ test_cygwin.cpython-312.pyc
│     │     │  │  │     │     ├─ test_mingw.cpython-312.pyc
│     │     │  │  │     │     ├─ test_msvc.cpython-312.pyc
│     │     │  │  │     │     └─ test_unix.cpython-312.pyc
│     │     │  │  │     ├─ unix.py
│     │     │  │  │     ├─ zos.py
│     │     │  │  │     └─ __pycache__
│     │     │  │  │        ├─ base.cpython-312.pyc
│     │     │  │  │        ├─ cygwin.cpython-312.pyc
│     │     │  │  │        ├─ errors.cpython-312.pyc
│     │     │  │  │        ├─ msvc.cpython-312.pyc
│     │     │  │  │        ├─ unix.cpython-312.pyc
│     │     │  │  │        └─ zos.cpython-312.pyc
│     │     │  │  ├─ core.py
│     │     │  │  ├─ cygwinccompiler.py
│     │     │  │  ├─ debug.py
│     │     │  │  ├─ dep_util.py
│     │     │  │  ├─ dir_util.py
│     │     │  │  ├─ dist.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ extension.py
│     │     │  │  ├─ fancy_getopt.py
│     │     │  │  ├─ filelist.py
│     │     │  │  ├─ file_util.py
│     │     │  │  ├─ log.py
│     │     │  │  ├─ spawn.py
│     │     │  │  ├─ sysconfig.py
│     │     │  │  ├─ tests
│     │     │  │  │  ├─ compat
│     │     │  │  │  │  ├─ py39.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ py39.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ support.py
│     │     │  │  │  ├─ test_archive_util.py
│     │     │  │  │  ├─ test_bdist.py
│     │     │  │  │  ├─ test_bdist_dumb.py
│     │     │  │  │  ├─ test_bdist_rpm.py
│     │     │  │  │  ├─ test_build.py
│     │     │  │  │  ├─ test_build_clib.py
│     │     │  │  │  ├─ test_build_ext.py
│     │     │  │  │  ├─ test_build_py.py
│     │     │  │  │  ├─ test_build_scripts.py
│     │     │  │  │  ├─ test_check.py
│     │     │  │  │  ├─ test_clean.py
│     │     │  │  │  ├─ test_cmd.py
│     │     │  │  │  ├─ test_config_cmd.py
│     │     │  │  │  ├─ test_core.py
│     │     │  │  │  ├─ test_dir_util.py
│     │     │  │  │  ├─ test_dist.py
│     │     │  │  │  ├─ test_extension.py
│     │     │  │  │  ├─ test_filelist.py
│     │     │  │  │  ├─ test_file_util.py
│     │     │  │  │  ├─ test_install.py
│     │     │  │  │  ├─ test_install_data.py
│     │     │  │  │  ├─ test_install_headers.py
│     │     │  │  │  ├─ test_install_lib.py
│     │     │  │  │  ├─ test_install_scripts.py
│     │     │  │  │  ├─ test_log.py
│     │     │  │  │  ├─ test_modified.py
│     │     │  │  │  ├─ test_sdist.py
│     │     │  │  │  ├─ test_spawn.py
│     │     │  │  │  ├─ test_sysconfig.py
│     │     │  │  │  ├─ test_text_file.py
│     │     │  │  │  ├─ test_util.py
│     │     │  │  │  ├─ test_version.py
│     │     │  │  │  ├─ test_versionpredicate.py
│     │     │  │  │  ├─ unix_compat.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ support.cpython-312.pyc
│     │     │  │  │     ├─ test_archive_util.cpython-312.pyc
│     │     │  │  │     ├─ test_bdist.cpython-312.pyc
│     │     │  │  │     ├─ test_bdist_dumb.cpython-312.pyc
│     │     │  │  │     ├─ test_bdist_rpm.cpython-312.pyc
│     │     │  │  │     ├─ test_build.cpython-312.pyc
│     │     │  │  │     ├─ test_build_clib.cpython-312.pyc
│     │     │  │  │     ├─ test_build_ext.cpython-312.pyc
│     │     │  │  │     ├─ test_build_py.cpython-312.pyc
│     │     │  │  │     ├─ test_build_scripts.cpython-312.pyc
│     │     │  │  │     ├─ test_check.cpython-312.pyc
│     │     │  │  │     ├─ test_clean.cpython-312.pyc
│     │     │  │  │     ├─ test_cmd.cpython-312.pyc
│     │     │  │  │     ├─ test_config_cmd.cpython-312.pyc
│     │     │  │  │     ├─ test_core.cpython-312.pyc
│     │     │  │  │     ├─ test_dir_util.cpython-312.pyc
│     │     │  │  │     ├─ test_dist.cpython-312.pyc
│     │     │  │  │     ├─ test_extension.cpython-312.pyc
│     │     │  │  │     ├─ test_filelist.cpython-312.pyc
│     │     │  │  │     ├─ test_file_util.cpython-312.pyc
│     │     │  │  │     ├─ test_install.cpython-312.pyc
│     │     │  │  │     ├─ test_install_data.cpython-312.pyc
│     │     │  │  │     ├─ test_install_headers.cpython-312.pyc
│     │     │  │  │     ├─ test_install_lib.cpython-312.pyc
│     │     │  │  │     ├─ test_install_scripts.cpython-312.pyc
│     │     │  │  │     ├─ test_log.cpython-312.pyc
│     │     │  │  │     ├─ test_modified.cpython-312.pyc
│     │     │  │  │     ├─ test_sdist.cpython-312.pyc
│     │     │  │  │     ├─ test_spawn.cpython-312.pyc
│     │     │  │  │     ├─ test_sysconfig.cpython-312.pyc
│     │     │  │  │     ├─ test_text_file.cpython-312.pyc
│     │     │  │  │     ├─ test_util.cpython-312.pyc
│     │     │  │  │     ├─ test_version.cpython-312.pyc
│     │     │  │  │     ├─ test_versionpredicate.cpython-312.pyc
│     │     │  │  │     ├─ unix_compat.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ text_file.py
│     │     │  │  ├─ unixccompiler.py
│     │     │  │  ├─ util.py
│     │     │  │  ├─ version.py
│     │     │  │  ├─ versionpredicate.py
│     │     │  │  ├─ zosccompiler.py
│     │     │  │  ├─ _log.py
│     │     │  │  ├─ _macos_compat.py
│     │     │  │  ├─ _modified.py
│     │     │  │  ├─ _msvccompiler.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ archive_util.cpython-312.pyc
│     │     │  │     ├─ ccompiler.cpython-312.pyc
│     │     │  │     ├─ cmd.cpython-312.pyc
│     │     │  │     ├─ core.cpython-312.pyc
│     │     │  │     ├─ cygwinccompiler.cpython-312.pyc
│     │     │  │     ├─ debug.cpython-312.pyc
│     │     │  │     ├─ dep_util.cpython-312.pyc
│     │     │  │     ├─ dir_util.cpython-312.pyc
│     │     │  │     ├─ dist.cpython-312.pyc
│     │     │  │     ├─ errors.cpython-312.pyc
│     │     │  │     ├─ extension.cpython-312.pyc
│     │     │  │     ├─ fancy_getopt.cpython-312.pyc
│     │     │  │     ├─ filelist.cpython-312.pyc
│     │     │  │     ├─ file_util.cpython-312.pyc
│     │     │  │     ├─ log.cpython-312.pyc
│     │     │  │     ├─ spawn.cpython-312.pyc
│     │     │  │     ├─ sysconfig.cpython-312.pyc
│     │     │  │     ├─ text_file.cpython-312.pyc
│     │     │  │     ├─ unixccompiler.cpython-312.pyc
│     │     │  │     ├─ util.cpython-312.pyc
│     │     │  │     ├─ version.cpython-312.pyc
│     │     │  │     ├─ versionpredicate.cpython-312.pyc
│     │     │  │     ├─ zosccompiler.cpython-312.pyc
│     │     │  │     ├─ _log.cpython-312.pyc
│     │     │  │     ├─ _macos_compat.cpython-312.pyc
│     │     │  │     ├─ _modified.cpython-312.pyc
│     │     │  │     ├─ _msvccompiler.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _entry_points.py
│     │     │  ├─ _imp.py
│     │     │  ├─ _importlib.py
│     │     │  ├─ _itertools.py
│     │     │  ├─ _normalization.py
│     │     │  ├─ _path.py
│     │     │  ├─ _reqs.py
│     │     │  ├─ _scripts.py
│     │     │  ├─ _shutil.py
│     │     │  ├─ _static.py
│     │     │  ├─ _vendor
│     │     │  │  ├─ autocommand
│     │     │  │  │  ├─ autoasync.py
│     │     │  │  │  ├─ autocommand.py
│     │     │  │  │  ├─ automain.py
│     │     │  │  │  ├─ autoparse.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ autoasync.cpython-312.pyc
│     │     │  │  │     ├─ autocommand.cpython-312.pyc
│     │     │  │  │     ├─ automain.cpython-312.pyc
│     │     │  │  │     ├─ autoparse.cpython-312.pyc
│     │     │  │  │     ├─ errors.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ autocommand-2.2.2.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ backports
│     │     │  │  │  ├─ tarfile
│     │     │  │  │  │  ├─ compat
│     │     │  │  │  │  │  ├─ py38.py
│     │     │  │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  │  └─ __pycache__
│     │     │  │  │  │  │     ├─ py38.cpython-312.pyc
│     │     │  │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  ├─ __main__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ backports.tarfile-1.2.0.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ importlib_metadata
│     │     │  │  │  ├─ compat
│     │     │  │  │  │  ├─ py311.py
│     │     │  │  │  │  ├─ py39.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ py311.cpython-312.pyc
│     │     │  │  │  │     ├─ py39.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ diagnose.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _adapters.py
│     │     │  │  │  ├─ _collections.py
│     │     │  │  │  ├─ _compat.py
│     │     │  │  │  ├─ _functools.py
│     │     │  │  │  ├─ _itertools.py
│     │     │  │  │  ├─ _meta.py
│     │     │  │  │  ├─ _text.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ diagnose.cpython-312.pyc
│     │     │  │  │     ├─ _adapters.cpython-312.pyc
│     │     │  │  │     ├─ _collections.cpython-312.pyc
│     │     │  │  │     ├─ _compat.cpython-312.pyc
│     │     │  │  │     ├─ _functools.cpython-312.pyc
│     │     │  │  │     ├─ _itertools.cpython-312.pyc
│     │     │  │  │     ├─ _meta.cpython-312.pyc
│     │     │  │  │     ├─ _text.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ importlib_metadata-8.0.0.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ inflect
│     │     │  │  │  ├─ compat
│     │     │  │  │  │  ├─ py38.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ py38.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ inflect-7.3.1.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ jaraco
│     │     │  │  │  ├─ collections
│     │     │  │  │  │  ├─ py.typed
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ context.py
│     │     │  │  │  ├─ functools
│     │     │  │  │  │  ├─ py.typed
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  ├─ __init__.pyi
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ text
│     │     │  │  │  │  ├─ layouts.py
│     │     │  │  │  │  ├─ Lorem ipsum.txt
│     │     │  │  │  │  ├─ show-newlines.py
│     │     │  │  │  │  ├─ strip-prefix.py
│     │     │  │  │  │  ├─ to-dvorak.py
│     │     │  │  │  │  ├─ to-qwerty.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ layouts.cpython-312.pyc
│     │     │  │  │  │     ├─ show-newlines.cpython-312.pyc
│     │     │  │  │  │     ├─ strip-prefix.cpython-312.pyc
│     │     │  │  │  │     ├─ to-dvorak.cpython-312.pyc
│     │     │  │  │  │     ├─ to-qwerty.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     └─ context.cpython-312.pyc
│     │     │  │  ├─ jaraco.collections-5.1.0.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ jaraco.context-5.3.0.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ jaraco.functools-4.0.1.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ jaraco.text-3.12.1.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ more_itertools
│     │     │  │  │  ├─ more.py
│     │     │  │  │  ├─ more.pyi
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ recipes.py
│     │     │  │  │  ├─ recipes.pyi
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __init__.pyi
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ more.cpython-312.pyc
│     │     │  │  │     ├─ recipes.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ more_itertools-10.3.0.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ packaging
│     │     │  │  │  ├─ licenses
│     │     │  │  │  │  ├─ _spdx.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ _spdx.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ markers.py
│     │     │  │  │  ├─ metadata.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ requirements.py
│     │     │  │  │  ├─ specifiers.py
│     │     │  │  │  ├─ tags.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ version.py
│     │     │  │  │  ├─ _elffile.py
│     │     │  │  │  ├─ _manylinux.py
│     │     │  │  │  ├─ _musllinux.py
│     │     │  │  │  ├─ _parser.py
│     │     │  │  │  ├─ _structures.py
│     │     │  │  │  ├─ _tokenizer.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ markers.cpython-312.pyc
│     │     │  │  │     ├─ metadata.cpython-312.pyc
│     │     │  │  │     ├─ requirements.cpython-312.pyc
│     │     │  │  │     ├─ specifiers.cpython-312.pyc
│     │     │  │  │     ├─ tags.cpython-312.pyc
│     │     │  │  │     ├─ utils.cpython-312.pyc
│     │     │  │  │     ├─ version.cpython-312.pyc
│     │     │  │  │     ├─ _elffile.cpython-312.pyc
│     │     │  │  │     ├─ _manylinux.cpython-312.pyc
│     │     │  │  │     ├─ _musllinux.cpython-312.pyc
│     │     │  │  │     ├─ _parser.cpython-312.pyc
│     │     │  │  │     ├─ _structures.cpython-312.pyc
│     │     │  │  │     ├─ _tokenizer.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ packaging-24.2.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ LICENSE.APACHE
│     │     │  │  │  ├─ LICENSE.BSD
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ platformdirs
│     │     │  │  │  ├─ android.py
│     │     │  │  │  ├─ api.py
│     │     │  │  │  ├─ macos.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ unix.py
│     │     │  │  │  ├─ version.py
│     │     │  │  │  ├─ windows.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __main__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ android.cpython-312.pyc
│     │     │  │  │     ├─ api.cpython-312.pyc
│     │     │  │  │     ├─ macos.cpython-312.pyc
│     │     │  │  │     ├─ unix.cpython-312.pyc
│     │     │  │  │     ├─ version.cpython-312.pyc
│     │     │  │  │     ├─ windows.cpython-312.pyc
│     │     │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  ├─ platformdirs-4.2.2.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ licenses
│     │     │  │  │  │  └─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ tomli
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _parser.py
│     │     │  │  │  ├─ _re.py
│     │     │  │  │  ├─ _types.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ _parser.cpython-312.pyc
│     │     │  │  │     ├─ _re.cpython-312.pyc
│     │     │  │  │     ├─ _types.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ tomli-2.0.1.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ typeguard
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _checkers.py
│     │     │  │  │  ├─ _config.py
│     │     │  │  │  ├─ _decorators.py
│     │     │  │  │  ├─ _exceptions.py
│     │     │  │  │  ├─ _functions.py
│     │     │  │  │  ├─ _importhook.py
│     │     │  │  │  ├─ _memo.py
│     │     │  │  │  ├─ _pytest_plugin.py
│     │     │  │  │  ├─ _suppression.py
│     │     │  │  │  ├─ _transformer.py
│     │     │  │  │  ├─ _union_transformer.py
│     │     │  │  │  ├─ _utils.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ _checkers.cpython-312.pyc
│     │     │  │  │     ├─ _config.cpython-312.pyc
│     │     │  │  │     ├─ _decorators.cpython-312.pyc
│     │     │  │  │     ├─ _exceptions.cpython-312.pyc
│     │     │  │  │     ├─ _functions.cpython-312.pyc
│     │     │  │  │     ├─ _importhook.cpython-312.pyc
│     │     │  │  │     ├─ _memo.cpython-312.pyc
│     │     │  │  │     ├─ _pytest_plugin.cpython-312.pyc
│     │     │  │  │     ├─ _suppression.cpython-312.pyc
│     │     │  │  │     ├─ _transformer.cpython-312.pyc
│     │     │  │  │     ├─ _union_transformer.cpython-312.pyc
│     │     │  │  │     ├─ _utils.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ typeguard-4.3.0.dist-info
│     │     │  │  │  ├─ entry_points.txt
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ typing_extensions-4.12.2.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ typing_extensions.py
│     │     │  │  ├─ wheel
│     │     │  │  │  ├─ bdist_wheel.py
│     │     │  │  │  ├─ cli
│     │     │  │  │  │  ├─ convert.py
│     │     │  │  │  │  ├─ pack.py
│     │     │  │  │  │  ├─ tags.py
│     │     │  │  │  │  ├─ unpack.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ convert.cpython-312.pyc
│     │     │  │  │  │     ├─ pack.cpython-312.pyc
│     │     │  │  │  │     ├─ tags.cpython-312.pyc
│     │     │  │  │  │     ├─ unpack.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ macosx_libfile.py
│     │     │  │  │  ├─ metadata.py
│     │     │  │  │  ├─ util.py
│     │     │  │  │  ├─ vendored
│     │     │  │  │  │  ├─ packaging
│     │     │  │  │  │  │  ├─ LICENSE
│     │     │  │  │  │  │  ├─ LICENSE.APACHE
│     │     │  │  │  │  │  ├─ LICENSE.BSD
│     │     │  │  │  │  │  ├─ markers.py
│     │     │  │  │  │  │  ├─ requirements.py
│     │     │  │  │  │  │  ├─ specifiers.py
│     │     │  │  │  │  │  ├─ tags.py
│     │     │  │  │  │  │  ├─ utils.py
│     │     │  │  │  │  │  ├─ version.py
│     │     │  │  │  │  │  ├─ _elffile.py
│     │     │  │  │  │  │  ├─ _manylinux.py
│     │     │  │  │  │  │  ├─ _musllinux.py
│     │     │  │  │  │  │  ├─ _parser.py
│     │     │  │  │  │  │  ├─ _structures.py
│     │     │  │  │  │  │  ├─ _tokenizer.py
│     │     │  │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  │  └─ __pycache__
│     │     │  │  │  │  │     ├─ markers.cpython-312.pyc
│     │     │  │  │  │  │     ├─ requirements.cpython-312.pyc
│     │     │  │  │  │  │     ├─ specifiers.cpython-312.pyc
│     │     │  │  │  │  │     ├─ tags.cpython-312.pyc
│     │     │  │  │  │  │     ├─ utils.cpython-312.pyc
│     │     │  │  │  │  │     ├─ version.cpython-312.pyc
│     │     │  │  │  │  │     ├─ _elffile.cpython-312.pyc
│     │     │  │  │  │  │     ├─ _manylinux.cpython-312.pyc
│     │     │  │  │  │  │     ├─ _musllinux.cpython-312.pyc
│     │     │  │  │  │  │     ├─ _parser.cpython-312.pyc
│     │     │  │  │  │  │     ├─ _structures.cpython-312.pyc
│     │     │  │  │  │  │     ├─ _tokenizer.cpython-312.pyc
│     │     │  │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  │  ├─ vendor.txt
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ wheelfile.py
│     │     │  │  │  ├─ _bdist_wheel.py
│     │     │  │  │  ├─ _setuptools_logging.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  ├─ __main__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ bdist_wheel.cpython-312.pyc
│     │     │  │  │     ├─ macosx_libfile.cpython-312.pyc
│     │     │  │  │     ├─ metadata.cpython-312.pyc
│     │     │  │  │     ├─ util.cpython-312.pyc
│     │     │  │  │     ├─ wheelfile.cpython-312.pyc
│     │     │  │  │     ├─ _bdist_wheel.cpython-312.pyc
│     │     │  │  │     ├─ _setuptools_logging.cpython-312.pyc
│     │     │  │  │     ├─ __init__.cpython-312.pyc
│     │     │  │  │     └─ __main__.cpython-312.pyc
│     │     │  │  ├─ wheel-0.45.1.dist-info
│     │     │  │  │  ├─ entry_points.txt
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE.txt
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  └─ WHEEL
│     │     │  │  ├─ zipp
│     │     │  │  │  ├─ compat
│     │     │  │  │  │  ├─ py310.py
│     │     │  │  │  │  ├─ __init__.py
│     │     │  │  │  │  └─ __pycache__
│     │     │  │  │  │     ├─ py310.cpython-312.pyc
│     │     │  │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  │  ├─ glob.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ glob.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ zipp-3.19.2.dist-info
│     │     │  │  │  ├─ INSTALLER
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ METADATA
│     │     │  │  │  ├─ RECORD
│     │     │  │  │  ├─ REQUESTED
│     │     │  │  │  ├─ top_level.txt
│     │     │  │  │  └─ WHEEL
│     │     │  │  └─ __pycache__
│     │     │  │     └─ typing_extensions.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ archive_util.cpython-312.pyc
│     │     │     ├─ build_meta.cpython-312.pyc
│     │     │     ├─ depends.cpython-312.pyc
│     │     │     ├─ discovery.cpython-312.pyc
│     │     │     ├─ dist.cpython-312.pyc
│     │     │     ├─ errors.cpython-312.pyc
│     │     │     ├─ extension.cpython-312.pyc
│     │     │     ├─ glob.cpython-312.pyc
│     │     │     ├─ installer.cpython-312.pyc
│     │     │     ├─ launch.cpython-312.pyc
│     │     │     ├─ logging.cpython-312.pyc
│     │     │     ├─ modified.cpython-312.pyc
│     │     │     ├─ monkey.cpython-312.pyc
│     │     │     ├─ msvc.cpython-312.pyc
│     │     │     ├─ namespaces.cpython-312.pyc
│     │     │     ├─ unicode_utils.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     ├─ warnings.cpython-312.pyc
│     │     │     ├─ wheel.cpython-312.pyc
│     │     │     ├─ windows_support.cpython-312.pyc
│     │     │     ├─ _core_metadata.cpython-312.pyc
│     │     │     ├─ _discovery.cpython-312.pyc
│     │     │     ├─ _entry_points.cpython-312.pyc
│     │     │     ├─ _imp.cpython-312.pyc
│     │     │     ├─ _importlib.cpython-312.pyc
│     │     │     ├─ _itertools.cpython-312.pyc
│     │     │     ├─ _normalization.cpython-312.pyc
│     │     │     ├─ _path.cpython-312.pyc
│     │     │     ├─ _reqs.cpython-312.pyc
│     │     │     ├─ _scripts.cpython-312.pyc
│     │     │     ├─ _shutil.cpython-312.pyc
│     │     │     ├─ _static.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ setuptools-80.8.0.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ six-1.17.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ six.py
│     │     ├─ sniffio
│     │     │  ├─ py.typed
│     │     │  ├─ _impl.py
│     │     │  ├─ _tests
│     │     │  │  ├─ test_sniffio.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ test_sniffio.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ _impl.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ sniffio-1.3.1.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ LICENSE.APACHE2
│     │     │  ├─ LICENSE.MIT
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ starlette
│     │     │  ├─ applications.py
│     │     │  ├─ authentication.py
│     │     │  ├─ background.py
│     │     │  ├─ concurrency.py
│     │     │  ├─ config.py
│     │     │  ├─ convertors.py
│     │     │  ├─ datastructures.py
│     │     │  ├─ endpoints.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ formparsers.py
│     │     │  ├─ middleware
│     │     │  │  ├─ authentication.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ cors.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ gzip.py
│     │     │  │  ├─ httpsredirect.py
│     │     │  │  ├─ sessions.py
│     │     │  │  ├─ trustedhost.py
│     │     │  │  ├─ wsgi.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ authentication.cpython-312.pyc
│     │     │  │     ├─ base.cpython-312.pyc
│     │     │  │     ├─ cors.cpython-312.pyc
│     │     │  │     ├─ errors.cpython-312.pyc
│     │     │  │     ├─ exceptions.cpython-312.pyc
│     │     │  │     ├─ gzip.cpython-312.pyc
│     │     │  │     ├─ httpsredirect.cpython-312.pyc
│     │     │  │     ├─ sessions.cpython-312.pyc
│     │     │  │     ├─ trustedhost.cpython-312.pyc
│     │     │  │     ├─ wsgi.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ py.typed
│     │     │  ├─ requests.py
│     │     │  ├─ responses.py
│     │     │  ├─ routing.py
│     │     │  ├─ schemas.py
│     │     │  ├─ staticfiles.py
│     │     │  ├─ status.py
│     │     │  ├─ templating.py
│     │     │  ├─ testclient.py
│     │     │  ├─ types.py
│     │     │  ├─ websockets.py
│     │     │  ├─ _exception_handler.py
│     │     │  ├─ _utils.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ applications.cpython-312.pyc
│     │     │     ├─ authentication.cpython-312.pyc
│     │     │     ├─ background.cpython-312.pyc
│     │     │     ├─ concurrency.cpython-312.pyc
│     │     │     ├─ config.cpython-312.pyc
│     │     │     ├─ convertors.cpython-312.pyc
│     │     │     ├─ datastructures.cpython-312.pyc
│     │     │     ├─ endpoints.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ formparsers.cpython-312.pyc
│     │     │     ├─ requests.cpython-312.pyc
│     │     │     ├─ responses.cpython-312.pyc
│     │     │     ├─ routing.cpython-312.pyc
│     │     │     ├─ schemas.cpython-312.pyc
│     │     │     ├─ staticfiles.cpython-312.pyc
│     │     │     ├─ status.cpython-312.pyc
│     │     │     ├─ templating.cpython-312.pyc
│     │     │     ├─ testclient.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ websockets.cpython-312.pyc
│     │     │     ├─ _exception_handler.cpython-312.pyc
│     │     │     ├─ _utils.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ starlette-0.46.2.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.md
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ storage3
│     │     │  ├─ constants.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ _async
│     │     │  │  ├─ bucket.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ file_api.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ bucket.cpython-312.pyc
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ file_api.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _sync
│     │     │  │  ├─ bucket.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ file_api.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ bucket.cpython-312.pyc
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ file_api.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ constants.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ storage3-0.11.3.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ strenum
│     │     │  ├─ mixins.py
│     │     │  ├─ mixins.pyi
│     │     │  ├─ py.typed
│     │     │  ├─ _name_mangler.py
│     │     │  ├─ _name_mangler.pyi
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __init__.pyi
│     │     │  └─ __pycache__
│     │     │     ├─ mixins.cpython-312.pyc
│     │     │     ├─ _name_mangler.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ StrEnum-0.4.15.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ supabase
│     │     │  ├─ client.py
│     │     │  ├─ lib
│     │     │  │  ├─ client_options.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ client_options.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ py.typed
│     │     │  ├─ types.py
│     │     │  ├─ version.py
│     │     │  ├─ _async
│     │     │  │  ├─ auth_client.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ auth_client.cpython-312.pyc
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _sync
│     │     │  │  ├─ auth_client.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ auth_client.cpython-312.pyc
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ client.cpython-312.pyc
│     │     │     ├─ types.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ supabase-2.15.1.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  └─ WHEEL
│     │     ├─ supafunc
│     │     │  ├─ errors.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ _async
│     │     │  │  ├─ functions_client.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ functions_client.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _sync
│     │     │  │  ├─ functions_client.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ functions_client.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ errors.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ supafunc-0.9.4.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ typing_extensions-4.13.2.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ typing_extensions.py
│     │     ├─ typing_inspection
│     │     │  ├─ introspection.py
│     │     │  ├─ py.typed
│     │     │  ├─ typing_objects.py
│     │     │  ├─ typing_objects.pyi
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ introspection.cpython-312.pyc
│     │     │     ├─ typing_objects.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ typing_inspection-0.4.1.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ urllib3
│     │     │  ├─ connection.py
│     │     │  ├─ connectionpool.py
│     │     │  ├─ contrib
│     │     │  │  ├─ emscripten
│     │     │  │  │  ├─ connection.py
│     │     │  │  │  ├─ emscripten_fetch_worker.js
│     │     │  │  │  ├─ fetch.py
│     │     │  │  │  ├─ request.py
│     │     │  │  │  ├─ response.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ connection.cpython-312.pyc
│     │     │  │  │     ├─ fetch.cpython-312.pyc
│     │     │  │  │     ├─ request.cpython-312.pyc
│     │     │  │  │     ├─ response.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ pyopenssl.py
│     │     │  │  ├─ socks.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ pyopenssl.cpython-312.pyc
│     │     │  │     ├─ socks.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ exceptions.py
│     │     │  ├─ fields.py
│     │     │  ├─ filepost.py
│     │     │  ├─ http2
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ probe.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ connection.cpython-312.pyc
│     │     │  │     ├─ probe.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ poolmanager.py
│     │     │  ├─ py.typed
│     │     │  ├─ response.py
│     │     │  ├─ util
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ proxy.py
│     │     │  │  ├─ request.py
│     │     │  │  ├─ response.py
│     │     │  │  ├─ retry.py
│     │     │  │  ├─ ssltransport.py
│     │     │  │  ├─ ssl_.py
│     │     │  │  ├─ ssl_match_hostname.py
│     │     │  │  ├─ timeout.py
│     │     │  │  ├─ url.py
│     │     │  │  ├─ util.py
│     │     │  │  ├─ wait.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ connection.cpython-312.pyc
│     │     │  │     ├─ proxy.cpython-312.pyc
│     │     │  │     ├─ request.cpython-312.pyc
│     │     │  │     ├─ response.cpython-312.pyc
│     │     │  │     ├─ retry.cpython-312.pyc
│     │     │  │     ├─ ssltransport.cpython-312.pyc
│     │     │  │     ├─ ssl_.cpython-312.pyc
│     │     │  │     ├─ ssl_match_hostname.cpython-312.pyc
│     │     │  │     ├─ timeout.cpython-312.pyc
│     │     │  │     ├─ url.cpython-312.pyc
│     │     │  │     ├─ util.cpython-312.pyc
│     │     │  │     ├─ wait.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _base_connection.py
│     │     │  ├─ _collections.py
│     │     │  ├─ _request_methods.py
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ connection.cpython-312.pyc
│     │     │     ├─ connectionpool.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ fields.cpython-312.pyc
│     │     │     ├─ filepost.cpython-312.pyc
│     │     │     ├─ poolmanager.cpython-312.pyc
│     │     │     ├─ response.cpython-312.pyc
│     │     │     ├─ _base_connection.cpython-312.pyc
│     │     │     ├─ _collections.cpython-312.pyc
│     │     │     ├─ _request_methods.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ urllib3-2.4.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.txt
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ uvicorn
│     │     │  ├─ config.py
│     │     │  ├─ importer.py
│     │     │  ├─ lifespan
│     │     │  │  ├─ off.py
│     │     │  │  ├─ on.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ off.cpython-312.pyc
│     │     │  │     ├─ on.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ logging.py
│     │     │  ├─ loops
│     │     │  │  ├─ asyncio.py
│     │     │  │  ├─ auto.py
│     │     │  │  ├─ uvloop.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ asyncio.cpython-312.pyc
│     │     │  │     ├─ auto.cpython-312.pyc
│     │     │  │     ├─ uvloop.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ main.py
│     │     │  ├─ middleware
│     │     │  │  ├─ asgi2.py
│     │     │  │  ├─ message_logger.py
│     │     │  │  ├─ proxy_headers.py
│     │     │  │  ├─ wsgi.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ asgi2.cpython-312.pyc
│     │     │  │     ├─ message_logger.cpython-312.pyc
│     │     │  │     ├─ proxy_headers.cpython-312.pyc
│     │     │  │     ├─ wsgi.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ protocols
│     │     │  │  ├─ http
│     │     │  │  │  ├─ auto.py
│     │     │  │  │  ├─ flow_control.py
│     │     │  │  │  ├─ h11_impl.py
│     │     │  │  │  ├─ httptools_impl.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ auto.cpython-312.pyc
│     │     │  │  │     ├─ flow_control.cpython-312.pyc
│     │     │  │  │     ├─ h11_impl.cpython-312.pyc
│     │     │  │  │     ├─ httptools_impl.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ websockets
│     │     │  │  │  ├─ auto.py
│     │     │  │  │  ├─ websockets_impl.py
│     │     │  │  │  ├─ wsproto_impl.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __pycache__
│     │     │  │  │     ├─ auto.cpython-312.pyc
│     │     │  │  │     ├─ websockets_impl.cpython-312.pyc
│     │     │  │  │     ├─ wsproto_impl.cpython-312.pyc
│     │     │  │  │     └─ __init__.cpython-312.pyc
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ utils.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ py.typed
│     │     │  ├─ server.py
│     │     │  ├─ supervisors
│     │     │  │  ├─ basereload.py
│     │     │  │  ├─ multiprocess.py
│     │     │  │  ├─ statreload.py
│     │     │  │  ├─ watchfilesreload.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ basereload.cpython-312.pyc
│     │     │  │     ├─ multiprocess.cpython-312.pyc
│     │     │  │     ├─ statreload.cpython-312.pyc
│     │     │  │     ├─ watchfilesreload.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ workers.py
│     │     │  ├─ _subprocess.py
│     │     │  ├─ _types.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pycache__
│     │     │     ├─ config.cpython-312.pyc
│     │     │     ├─ importer.cpython-312.pyc
│     │     │     ├─ logging.cpython-312.pyc
│     │     │     ├─ main.cpython-312.pyc
│     │     │     ├─ server.cpython-312.pyc
│     │     │     ├─ workers.cpython-312.pyc
│     │     │     ├─ _subprocess.cpython-312.pyc
│     │     │     ├─ _types.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     └─ __main__.cpython-312.pyc
│     │     ├─ uvicorn-0.34.2.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE.md
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ REQUESTED
│     │     │  └─ WHEEL
│     │     ├─ watchfiles
│     │     │  ├─ cli.py
│     │     │  ├─ filters.py
│     │     │  ├─ main.py
│     │     │  ├─ py.typed
│     │     │  ├─ run.py
│     │     │  ├─ version.py
│     │     │  ├─ _rust_notify.cp312-win_amd64.pyd
│     │     │  ├─ _rust_notify.pyi
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pycache__
│     │     │     ├─ cli.cpython-312.pyc
│     │     │     ├─ filters.cpython-312.pyc
│     │     │     ├─ main.cpython-312.pyc
│     │     │     ├─ run.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     └─ __main__.cpython-312.pyc
│     │     ├─ watchfiles-1.0.5.dist-info
│     │     │  ├─ entry_points.txt
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  └─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  └─ WHEEL
│     │     ├─ websockets
│     │     │  ├─ asyncio
│     │     │  │  ├─ async_timeout.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ compatibility.py
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ messages.py
│     │     │  │  ├─ server.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ async_timeout.cpython-312.pyc
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ compatibility.cpython-312.pyc
│     │     │  │     ├─ connection.cpython-312.pyc
│     │     │  │     ├─ messages.cpython-312.pyc
│     │     │  │     ├─ server.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ auth.py
│     │     │  ├─ client.py
│     │     │  ├─ connection.py
│     │     │  ├─ datastructures.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ extensions
│     │     │  │  ├─ base.py
│     │     │  │  ├─ permessage_deflate.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ base.cpython-312.pyc
│     │     │  │     ├─ permessage_deflate.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ frames.py
│     │     │  ├─ headers.py
│     │     │  ├─ http.py
│     │     │  ├─ http11.py
│     │     │  ├─ imports.py
│     │     │  ├─ legacy
│     │     │  │  ├─ auth.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ framing.py
│     │     │  │  ├─ handshake.py
│     │     │  │  ├─ http.py
│     │     │  │  ├─ protocol.py
│     │     │  │  ├─ server.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ auth.cpython-312.pyc
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ exceptions.cpython-312.pyc
│     │     │  │     ├─ framing.cpython-312.pyc
│     │     │  │     ├─ handshake.cpython-312.pyc
│     │     │  │     ├─ http.cpython-312.pyc
│     │     │  │     ├─ protocol.cpython-312.pyc
│     │     │  │     ├─ server.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ protocol.py
│     │     │  ├─ py.typed
│     │     │  ├─ server.py
│     │     │  ├─ speedups.c
│     │     │  ├─ speedups.cp312-win_amd64.pyd
│     │     │  ├─ speedups.pyi
│     │     │  ├─ streams.py
│     │     │  ├─ sync
│     │     │  │  ├─ client.py
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ messages.py
│     │     │  │  ├─ server.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ client.cpython-312.pyc
│     │     │  │     ├─ connection.cpython-312.pyc
│     │     │  │     ├─ messages.cpython-312.pyc
│     │     │  │     ├─ server.cpython-312.pyc
│     │     │  │     ├─ utils.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ typing.py
│     │     │  ├─ uri.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pycache__
│     │     │     ├─ auth.cpython-312.pyc
│     │     │     ├─ client.cpython-312.pyc
│     │     │     ├─ connection.cpython-312.pyc
│     │     │     ├─ datastructures.cpython-312.pyc
│     │     │     ├─ exceptions.cpython-312.pyc
│     │     │     ├─ frames.cpython-312.pyc
│     │     │     ├─ headers.cpython-312.pyc
│     │     │     ├─ http.cpython-312.pyc
│     │     │     ├─ http11.cpython-312.pyc
│     │     │     ├─ imports.cpython-312.pyc
│     │     │     ├─ protocol.cpython-312.pyc
│     │     │     ├─ server.cpython-312.pyc
│     │     │     ├─ streams.cpython-312.pyc
│     │     │     ├─ typing.cpython-312.pyc
│     │     │     ├─ uri.cpython-312.pyc
│     │     │     ├─ utils.cpython-312.pyc
│     │     │     ├─ version.cpython-312.pyc
│     │     │     ├─ __init__.cpython-312.pyc
│     │     │     └─ __main__.cpython-312.pyc
│     │     ├─ websockets-14.2.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ LICENSE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ yaml
│     │     │  ├─ composer.py
│     │     │  ├─ constructor.py
│     │     │  ├─ cyaml.py
│     │     │  ├─ dumper.py
│     │     │  ├─ emitter.py
│     │     │  ├─ error.py
│     │     │  ├─ events.py
│     │     │  ├─ loader.py
│     │     │  ├─ nodes.py
│     │     │  ├─ parser.py
│     │     │  ├─ reader.py
│     │     │  ├─ representer.py
│     │     │  ├─ resolver.py
│     │     │  ├─ scanner.py
│     │     │  ├─ serializer.py
│     │     │  ├─ tokens.py
│     │     │  ├─ _yaml.cp312-win_amd64.pyd
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ composer.cpython-312.pyc
│     │     │     ├─ constructor.cpython-312.pyc
│     │     │     ├─ cyaml.cpython-312.pyc
│     │     │     ├─ dumper.cpython-312.pyc
│     │     │     ├─ emitter.cpython-312.pyc
│     │     │     ├─ error.cpython-312.pyc
│     │     │     ├─ events.cpython-312.pyc
│     │     │     ├─ loader.cpython-312.pyc
│     │     │     ├─ nodes.cpython-312.pyc
│     │     │     ├─ parser.cpython-312.pyc
│     │     │     ├─ reader.cpython-312.pyc
│     │     │     ├─ representer.cpython-312.pyc
│     │     │     ├─ resolver.cpython-312.pyc
│     │     │     ├─ scanner.cpython-312.pyc
│     │     │     ├─ serializer.cpython-312.pyc
│     │     │     ├─ tokens.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ yarl
│     │     │  ├─ py.typed
│     │     │  ├─ _parse.py
│     │     │  ├─ _path.py
│     │     │  ├─ _query.py
│     │     │  ├─ _quoters.py
│     │     │  ├─ _quoting.py
│     │     │  ├─ _quoting_c.cp312-win_amd64.pyd
│     │     │  ├─ _quoting_c.pyx
│     │     │  ├─ _quoting_py.py
│     │     │  ├─ _url.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ _parse.cpython-312.pyc
│     │     │     ├─ _path.cpython-312.pyc
│     │     │     ├─ _query.cpython-312.pyc
│     │     │     ├─ _quoters.cpython-312.pyc
│     │     │     ├─ _quoting.cpython-312.pyc
│     │     │     ├─ _quoting_py.cpython-312.pyc
│     │     │     ├─ _url.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ yarl-1.20.0.dist-info
│     │     │  ├─ INSTALLER
│     │     │  ├─ licenses
│     │     │  │  ├─ LICENSE
│     │     │  │  └─ NOTICE
│     │     │  ├─ METADATA
│     │     │  ├─ RECORD
│     │     │  ├─ top_level.txt
│     │     │  └─ WHEEL
│     │     ├─ _distutils_hack
│     │     │  ├─ override.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ override.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ _pytest
│     │     │  ├─ assertion
│     │     │  │  ├─ rewrite.py
│     │     │  │  ├─ truncate.py
│     │     │  │  ├─ util.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ rewrite.cpython-312.pyc
│     │     │  │     ├─ truncate.cpython-312.pyc
│     │     │  │     ├─ util.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ cacheprovider.py
│     │     │  ├─ capture.py
│     │     │  ├─ compat.py
│     │     │  ├─ config
│     │     │  │  ├─ argparsing.py
│     │     │  │  ├─ compat.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ findpaths.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ argparsing.cpython-312.pyc
│     │     │  │     ├─ compat.cpython-312.pyc
│     │     │  │     ├─ exceptions.cpython-312.pyc
│     │     │  │     ├─ findpaths.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ debugging.py
│     │     │  ├─ deprecated.py
│     │     │  ├─ doctest.py
│     │     │  ├─ faulthandler.py
│     │     │  ├─ fixtures.py
│     │     │  ├─ freeze_support.py
│     │     │  ├─ helpconfig.py
│     │     │  ├─ hookspec.py
│     │     │  ├─ junitxml.py
│     │     │  ├─ legacypath.py
│     │     │  ├─ logging.py
│     │     │  ├─ main.py
│     │     │  ├─ mark
│     │     │  │  ├─ expression.py
│     │     │  │  ├─ structures.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ expression.cpython-312.pyc
│     │     │  │     ├─ structures.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ monkeypatch.py
│     │     │  ├─ nodes.py
│     │     │  ├─ outcomes.py
│     │     │  ├─ pastebin.py
│     │     │  ├─ pathlib.py
│     │     │  ├─ py.typed
│     │     │  ├─ pytester.py
│     │     │  ├─ pytester_assertions.py
│     │     │  ├─ python.py
│     │     │  ├─ python_api.py
│     │     │  ├─ python_path.py
│     │     │  ├─ recwarn.py
│     │     │  ├─ reports.py
│     │     │  ├─ runner.py
│     │     │  ├─ scope.py
│     │     │  ├─ setuponly.py
│     │     │  ├─ setupplan.py
│     │     │  ├─ skipping.py
│     │     │  ├─ stash.py
│     │     │  ├─ stepwise.py
│     │     │  ├─ terminal.py
│     │     │  ├─ threadexception.py
│     │     │  ├─ timing.py
│     │     │  ├─ tmpdir.py
│     │     │  ├─ unittest.py
│     │     │  ├─ unraisableexception.py
│     │     │  ├─ warnings.py
│     │     │  ├─ warning_types.py
│     │     │  ├─ _argcomplete.py
│     │     │  ├─ _code
│     │     │  │  ├─ code.py
│     │     │  │  ├─ source.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ code.cpython-312.pyc
│     │     │  │     ├─ source.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _io
│     │     │  │  ├─ pprint.py
│     │     │  │  ├─ saferepr.py
│     │     │  │  ├─ terminalwriter.py
│     │     │  │  ├─ wcwidth.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ pprint.cpython-312.pyc
│     │     │  │     ├─ saferepr.cpython-312.pyc
│     │     │  │     ├─ terminalwriter.cpython-312.pyc
│     │     │  │     ├─ wcwidth.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _py
│     │     │  │  ├─ error.py
│     │     │  │  ├─ path.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __pycache__
│     │     │  │     ├─ error.cpython-312.pyc
│     │     │  │     ├─ path.cpython-312.pyc
│     │     │  │     └─ __init__.cpython-312.pyc
│     │     │  ├─ _version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     ├─ cacheprovider.cpython-312.pyc
│     │     │     ├─ capture.cpython-312.pyc
│     │     │     ├─ compat.cpython-312.pyc
│     │     │     ├─ debugging.cpython-312.pyc
│     │     │     ├─ deprecated.cpython-312.pyc
│     │     │     ├─ doctest.cpython-312.pyc
│     │     │     ├─ faulthandler.cpython-312.pyc
│     │     │     ├─ fixtures.cpython-312.pyc
│     │     │     ├─ freeze_support.cpython-312.pyc
│     │     │     ├─ helpconfig.cpython-312.pyc
│     │     │     ├─ hookspec.cpython-312.pyc
│     │     │     ├─ junitxml.cpython-312.pyc
│     │     │     ├─ legacypath.cpython-312.pyc
│     │     │     ├─ logging.cpython-312.pyc
│     │     │     ├─ main.cpython-312.pyc
│     │     │     ├─ monkeypatch.cpython-312.pyc
│     │     │     ├─ nodes.cpython-312.pyc
│     │     │     ├─ outcomes.cpython-312.pyc
│     │     │     ├─ pastebin.cpython-312.pyc
│     │     │     ├─ pathlib.cpython-312.pyc
│     │     │     ├─ pytester.cpython-312.pyc
│     │     │     ├─ pytester_assertions.cpython-312.pyc
│     │     │     ├─ python.cpython-312.pyc
│     │     │     ├─ python_api.cpython-312.pyc
│     │     │     ├─ python_path.cpython-312.pyc
│     │     │     ├─ recwarn.cpython-312.pyc
│     │     │     ├─ reports.cpython-312.pyc
│     │     │     ├─ runner.cpython-312.pyc
│     │     │     ├─ scope.cpython-312.pyc
│     │     │     ├─ setuponly.cpython-312.pyc
│     │     │     ├─ setupplan.cpython-312.pyc
│     │     │     ├─ skipping.cpython-312.pyc
│     │     │     ├─ stash.cpython-312.pyc
│     │     │     ├─ stepwise.cpython-312.pyc
│     │     │     ├─ terminal.cpython-312.pyc
│     │     │     ├─ threadexception.cpython-312.pyc
│     │     │     ├─ timing.cpython-312.pyc
│     │     │     ├─ tmpdir.cpython-312.pyc
│     │     │     ├─ unittest.cpython-312.pyc
│     │     │     ├─ unraisableexception.cpython-312.pyc
│     │     │     ├─ warnings.cpython-312.pyc
│     │     │     ├─ warning_types.cpython-312.pyc
│     │     │     ├─ _argcomplete.cpython-312.pyc
│     │     │     ├─ _version.cpython-312.pyc
│     │     │     └─ __init__.cpython-312.pyc
│     │     ├─ _yaml
│     │     │  ├─ __init__.py
│     │     │  └─ __pycache__
│     │     │     └─ __init__.cpython-312.pyc
│     │     └─ __pycache__
│     │        ├─ decouple.cpython-312.pyc
│     │        ├─ deprecation.cpython-312.pyc
│     │        ├─ py.cpython-312.pyc
│     │        ├─ six.cpython-312.pyc
│     │        └─ typing_extensions.cpython-312.pyc
│     ├─ pyvenv.cfg
│     └─ Scripts
│        ├─ activate
│        ├─ activate.bat
│        ├─ Activate.ps1
│        ├─ deactivate.bat
│        ├─ dotenv.exe
│        ├─ fastapi.exe
│        ├─ httpx.exe
│        ├─ normalizer.exe
│        ├─ pip.exe
│        ├─ pip3.12.exe
│        ├─ pip3.exe
│        ├─ py.test.exe
│        ├─ pytest.exe
│        ├─ python.exe
│        ├─ pythonw.exe
│        ├─ tests.exe
│        ├─ uvicorn.exe
│        └─ watchfiles.exe
├─ frontend_test
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api.ts
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  └─ SensorChart.tsx
│  │  ├─ index.tsx
│  │  ├─ LoginForm.tsx
│  │  ├─ pages
│  │  │  └─ Dashboard.tsx
│  │  └─ utils
│  │     └─ socket.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
└─ README.md

```