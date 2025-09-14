import type express from 'express'

// Avoid starting multiple servers when tests import this module repeatedly
declare global {
  // eslint-disable-next-line no-var
  var __inventoryServer: import('http').Server | undefined
}

export function startServer(app: express.Express, PORT: string | number) {
  if (globalThis.__inventoryServer) return globalThis.__inventoryServer
  const server = app.listen(PORT, () => {
    console.log('[SERVER] Environment ............:', process.env.NODE_ENV)
    console.log('[SERVER] Server running at PORT .:', PORT)
    console.log('[SERVER] Storage engine .........:', process.env.STORAGE_ADAPTER)
  })
  server.on('error', (error: any) => {
    if ((error as any)?.code === 'EADDRINUSE') {
      console.warn(`[SERVER] Port ${PORT} in use, assuming server is already running.`)
      // do not throw here to avoid unhandled errors in tests
    } else {
      console.warn(`[SERVER] An error occurred while starting the server: ${error.message}`)
      throw error
    }
  })
  globalThis.__inventoryServer = server
  return server
}
