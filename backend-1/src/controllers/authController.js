/* eslint-disable linebreak-style */
// ./src/controllers/authController.js
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 username:
 *                   type: string
 *       401:
 *         description: Invalid username or password
 */

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user (client should discard the token manually).
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful logout message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out (client must discard token)
 */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const config = require('../utils/config')

const login = async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect = user && await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  console.log('Username:', username)
  console.log('User in DB:', user)
  console.log('Password match:', passwordCorrect)

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: '1h' })

  res.status(200).json({
    token,
    username: user.username
  })
}

const logout = async (req, res) => {
  // Optional enhancement: blacklist the token in Redis or DB (not covered here)
  res.status(200).json({ message: 'Logged out (client must discard token)' })
}

module.exports = { login, logout }
