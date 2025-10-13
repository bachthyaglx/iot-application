const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

const PORTS = [3001, 4000] // API port and Real-time port

async function killPort(port) {
  try {
    const isWindows = process.platform === 'win32'

    if (isWindows) {
      // Windows: Find PID and kill it
      const { stdout } = await execPromise(`netstat -ano | findstr :${port}`)
      const lines = stdout.trim().split('\n')

      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        const pid = parts[parts.length - 1]

        if (pid && !isNaN(pid)) {
          try {
            await execPromise(`taskkill /PID ${pid} /F`)
            console.log(`✅ Killed process on port ${port} (PID: ${pid})`)
          } catch (err) {
            // Process might already be dead
          }
        }
      }
    } else {
      // Linux/Mac: Kill by lsof
      try {
        await execPromise(`lsof -ti:${port} | xargs kill -9`)
        console.log(`✅ Killed process on port ${port}`);
      } catch (err) {
        // Port might not be in use
      }
    }
  } catch (error) {
    // Port can be free, do nothing
  }
}

async function killAllPorts() {
  console.log('🔍 Checking for processes on ports:', PORTS.join(', '))

  for (const port of PORTS) {
    await killPort(port)
  }

  console.log('✨ All ports cleared!\n')
}

killAllPorts().catch(console.error)