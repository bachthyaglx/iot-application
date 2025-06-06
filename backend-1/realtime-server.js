/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
// ./realtime-server.js
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { createClient } = require('redis')
const { createAdapter } = require('@socket.io/redis-adapter')
const config = require('./src/utils/config')
const sensorTypes = require('./src/data-simulator/types')
const { latestData } = require('./src/data-simulator/cache')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

const redisUrl = config.REDIS_URL || 'redis://redis:6379'

const pub = createClient({ url: redisUrl })
const sub = createClient({ url: redisUrl })
const redisCache = createClient({ url: redisUrl })

const subscriptions = {}

async function start() {
  await pub.connect()
  await sub.connect()
  await redisCache.connect()
  io.adapter(createAdapter(pub, sub))

  for (const type of sensorTypes) {
    await sub.subscribe(`sensor:${type}`, async msg => {
      const data = JSON.parse(msg)

      const enriched = {
        ...data,
        type,
        time: new Date().toISOString()
      }

      await redisCache.set(`latest:${type}`, JSON.stringify(enriched))
      latestData[type] = enriched

      for (const [socketId, types] of Object.entries(subscriptions)) {
        if (types.has(type)) {
          io.to(socketId).emit(`${type}:update`, enriched)
        }
      }
    })
  }

  io.on('connection', socket => {
    subscriptions[socket.id] = new Set()

    socket.on('subscribe', (data) => {
      const sensorType = typeof data === 'string' ? data : data?.type
      if (sensorTypes.includes(sensorType)) {
        subscriptions[socket.id].add(sensorType)
      }
    })

    socket.on('get-latest', async (data) => {
      const sensorType = typeof data === 'string' ? data : data?.type
      const raw = await redisCache.get(`latest:${sensorType}`)
      if (raw) {
        socket.emit(`latest-${sensorType}`, JSON.parse(raw))
      }
    })

    socket.on('disconnect', () => {
      delete subscriptions[socket.id]
    })
  })

  server.listen(4000, () => {
    console.log('🚀 Realtime server listening on port 4000')
  })
}

start().catch(console.error)
