/* eslint-disable indent */
/* eslint-disable linebreak-style */
// ./src/controllers/rootController.js

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get Thing Description root metadata
 *     description: |
 *       Returns metadata following W3C Web of Things Thing Description standard.
 *       Response is dynamic depending on login status (`req.user`).
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Thing Description metadata with available API links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 context:
 *                   type: string
 *                   example: "https://www.w3.org/2022/wot/td/v1.1"
 *                 id:
 *                   type: string
 *                   example: "http://localhost"
 *                 title:
 *                   type: string
 *                   example: "Sensor"
 *                 version:
 *                   type: object
 *                   properties:
 *                     instance:
 *                       type: string
 *                       example: "1.0.0"
 *                     model:
 *                       type: string
 *                       example: "58841"
 *                 created:
 *                   type: string
 *                   format: date-time
 *                 base:
 *                   type: string
 *                 security:
 *                   type: string
 *                   example: "basic_sc"
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       href:
 *                         type: string
 *                         example: "/information"
 *                       rel:
 *                         type: string
 *                         example: "information"
 *                       method:
 *                         type: string
 *                         example: "GET"
 */
const getRoot = async (req, res) => {
  // Example placeholders - replace with actual logic
  const protocol = req.protocol || 'http'
  const ip = req.hostname || 'localhost'
  const BUILD_DATE = new Date().toISOString()
  const isAuthenticated = !!req.user

  let data = {
    context: 'https://www.w3.org/2022/wot/td/v1.1',
    id: `${protocol}://${ip}`,
    title: 'Sensor',
    version: {
      instance: '1.0.0',
      model: '58841'
    },
    created: BUILD_DATE,
    base: `${protocol}://${ip}`,
    security: 'basic_sc',
    links: isAuthenticated
      ? [
        // Basic Information - Public & Protected
        { href: '/identification', rel: 'identification', method: 'GET' },
        { href: '/identification', rel: 'identification', method: 'PUT' },
        { href: '/picture', rel: 'picture', method: 'GET' },
        { href: '/picture', rel: 'picture', method: 'PUT' },
        { href: '/device/ports', rel: 'ports', method: 'GET' },
        // { href: '/device/port/{portId}', rel: 'port', method: 'GET' },
        // { href: '/device/port/{portId}', rel: 'port', method: 'PUT' },
        { href: '/diagnostics', rel: 'diagnostics', method: 'GET' },
        { href: '/diagnostics', rel: 'diagnostics', method: 'PUT' },
        { href: '/diagnostics', rel: 'diagnostics', method: 'DELETE' },
        { href: '/configuration', rel: 'configuration', method: 'GET' },
        { href: '/configuration', rel: 'configuration', method: 'PATCH' },
        { href: '/maintenance', rel: 'maintenance', method: 'GET' },
        { href: '/maintenance', rel: 'maintenance', method: 'PUT' },
        { href: '/maintenance/reboot', rel: 'reboot', method: 'POST' },
        { href: '/maintenance/factorysettings', rel: 'factorysettings', method: 'POST' },
        { href: '/maintenance/fwupdate', rel: 'fwupdate', method: 'POST' },
        // { href: '/data', rel: 'data', method: 'GET' },
        { href: '/logout', rel: 'logout', method: 'POST' }
      ]
      : [
        // Public endpoints (read-only) when not authenticated
        { href: '/identification', rel: 'identification', method: 'GET' },
        { href: '/picture', rel: 'picture', method: 'GET' },
        { href: '/login', rel: 'login', method: 'POST' }
      ]
  }

  res.json(data)
}

module.exports = {
  getRoot
}