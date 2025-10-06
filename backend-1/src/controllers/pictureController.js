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
const multer = require('multer')
const { client } = require('../utils/redisClient')
const Picture = require('../models/picture')

const CACHE_KEY = 'pictureMeta'
const CACHE_KEY_DATA = 'pictureData'

// Multer config to upload image to memory
const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

const getPicture = async (req, res) => {
  try {
    let query = {}
    if (req.user && req.user._id) {
      query.user = req.user._id
    }
    const picture = await Picture.findOne(query)

    if (!picture) {
      return res.status(404).json({ error: 'No picture found' })
    }

    res.set('Content-Type', picture.contentType)
    res.send(picture.data)
  } catch (error) {
    console.error('Error getting picture:', error)
    res.status(500).json({ error: 'Failed to retrieve image' })
  }
}

const updatePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Save or update picture in MongoDB
    const picture = await Picture.findOneAndUpdate(
      { user: req.user._id },
      {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        user: req.user._id
      },
      { new: true, upsert: true }
    )

    // Clear cache
    await client.del(CACHE_KEY)
    await client.del(CACHE_KEY_DATA)

    console.log('✅ Picture cache cleared')
    console.log('✅ New picture uploaded:', req.file.originalname)

    res.json({
      message: 'Picture updated successfully',
      id: picture.id
    })
  } catch (error) {
    console.error('Error updating picture:', error)
    res.status(500).json({ error: 'Failed to update picture' })
  }
}

module.exports = {
  getPicture,
  updatePicture,
  uploadMiddleware: upload.single('picture')
}