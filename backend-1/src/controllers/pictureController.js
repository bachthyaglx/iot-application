/* eslint-disable linebreak-style */
// ./src/controllers/authController.js

/**
 * @swagger
 * tags:
 *   - name: Picture
 *     description: APIs for fetching and updating the device image
 *
 * /api/picture:
 *   get:
 *     summary: Get device image
 *     description: Returns the device image file. Metadata is cached using Redis.
 *     tags: [Picture]
 *     responses:
 *       200:
 *         description: JPEG image of the device
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Failed to retrieve image
 *     headers:
 *       X-Image-Content-Type:
 *         description: Content type of the image
 *         schema:
 *           type: string
 *           example: image/jpeg
 *
 *   put:
 *     summary: Clear image cache and return device image
 *     description: Clears cached metadata for the image in Redis and re-sends the file.
 *     tags: [Picture]
 *     responses:
 *       200:
 *         description: JPEG image re-sent after clearing cache
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Failed to update or re-send image
 */
const path = require('path')
const { client } = require('../utils/redisClient')

const imagePath = path.join(__dirname, '../../public/device-1.jpg')
const CACHE_KEY = 'pictureMeta'

const getPicture = async (req, res) => {
  const meta = await client.get(CACHE_KEY)

  if (meta) {
    const parsed = JSON.parse(meta)
    console.log('Using cached metadata:', parsed)
    res.set('X-Image-Content-Type', parsed.contentType)
  } else {
    const newMeta = { filename: 'device-1.jpg', contentType: 'image/jpeg' }
    await client.set(CACHE_KEY, JSON.stringify(newMeta), { EX: 86400 })
    res.set('X-Image-Content-Type', newMeta.contentType)
  }

  res.sendFile(imagePath)
}

const updatePicture = async (req, res) => {
  await client.del(CACHE_KEY)
  console.log('✅ Picture metadata cache cleared')
  res.sendFile(imagePath)
}

module.exports = {
  getPicture,
  updatePicture
}
