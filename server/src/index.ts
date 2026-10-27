import fs from 'fs'
import { app } from './app'
import { config } from './config'
import { pool } from './db'

fs.mkdirSync(config.uploadDir, { recursive: true })

const server = app.listen(config.port, () => {
  console.log(`Namma Kannada API listening on http://localhost:${config.port}  (${config.env})`)
})

const stop = () => { server.close(() => pool.end().then(() => process.exit(0))) }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
