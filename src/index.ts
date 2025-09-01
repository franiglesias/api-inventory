import ExpressServer from "./server/expressServer";
import appRouter from "./routes/router";
import { writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs'
import process from 'node:process'

const HOST: string = process.env.HOST || '0.0.0.0'
const PORT: number = Number(process.env.PORT) || 3000

const PID_FILE = '.server.pid'

// Compose routers/middleware outside the server implementation
const server = new ExpressServer(HOST, PORT, (app) => {
    // Explicitly mount at root
    app.use('/', appRouter)

    // 405 handler: if path matches an existing route but method doesn't, send 405
    app.use((req, res, next) => {
        // If Express internal router is not initialized, skip 405 helper gracefully
        // @ts-ignore - accessing Express internals for debug/middleware
        const router = (app as any)._router ?? (app as any).router ?? null
        if (!router) return next()

        const requestedPath = req.baseUrl + req.path
        if (router.stack) {
            const knownPaths = new Map<string, Set<string>>()
            for (const layer of router.stack) {
                // Nested router
                if (layer.name === 'router' && layer.handle && layer.handle.stack) {
                    for (const s of layer.handle.stack) {
                        if (s.route && s.route.path) {
                            const path: string = s.route.path
                            const methods = Object.keys(s.route.methods || {}).map(m => m.toUpperCase())
                            const set = knownPaths.get(path) ?? new Set<string>()
                            methods.forEach(m => set.add(m))
                            knownPaths.set(path, set)
                        }
                    }
                }
                // Direct route
                if (layer.route && layer.route.path) {
                    const path: string = layer.route.path
                    const methods = Object.keys(layer.route.methods || {}).map((m: string) => m.toUpperCase())
                    const set = knownPaths.get(path) ?? new Set<string>()
                    methods.forEach((m: string) => set.add(m))
                    knownPaths.set(path, set)
                }
            }

            // Try to find a path match ignoring method
            for (const [path, methods] of knownPaths.entries()) {
                // Express path matching is complex; for our simple paths, compare literally
                if (path === requestedPath) {
                    if (!methods.has(req.method.toUpperCase())) {
                        res.setHeader('Allow', Array.from(methods).sort().join(', '))
                        return res.status(405).json({ error: 'Method Not Allowed' })
                    }
                }
            }
        }
        return next()
    })

    // Debug: list registered routes (including nested Routers)
    const getRoutes = () => {
        const lines: string[] = []

        const toPaths = (p: any): string[] => {
            if (!p) return []
            if (Array.isArray(p)) return p.map(String)
            if (typeof p === 'string') return [p]
            return []
        }
        const getLayerMount = (layer: any): string => {
            // Express stores a RegExp for mounted routers; attempt to reconstruct a readable path
            if (layer.path) return String(layer.path)
            const reg = layer.regexp
            if (reg?.fast_slash) return '/'
            if (reg && reg.source) {
                // Convert simple path regex like ^\/?health\/?(?=\/|$) to /health
                try {
                    const m = reg.source
                        .replace(/^\^\\?\/?/, '/')
                        .replace(/\\\/?\(\?=\\\/.+$/, '')
                        .replace(/\\\//g, '/')
                        .replace(/\(\?:\^\)\?/, '')
                        .replace(/\$\/?$/, '')
                    // Keep only word, dash, slash, colon
                    const cleaned = m.replace(/[^/:\w-]/g, '')
                    return cleaned || ''
                } catch {}
            }
            return ''
        }
        const collect = (base: string, routerLike: any) => {
            const st = routerLike?.stack ?? []
            for (const layer of st) {
                if (layer.route) {
                    const paths = toPaths(layer.route.path)
                    const methods = Object.keys(layer.route.methods || {})
                        .map((m: string) => m.toUpperCase())
                        .sort()
                        .join(',')
                    if (paths.length === 0) {
                        const full = base || '/'
                        lines.push(`${methods} ${full}`)
                    } else {
                        for (const p of paths) {
                            const prefix = base === '/' ? '' : base
                            const fullPath = (prefix + (p.startsWith('/') ? p : '/' + p)) || '/'
                            lines.push(`${methods} ${fullPath}`)
                        }
                    }
                } else if (layer.name === 'router' && layer.handle) {
                    const mount = getLayerMount(layer)
                    const basePrefix = base === '/' ? '' : base
                    const nextBaseRaw = mount ? (basePrefix + (mount.startsWith('/') ? mount : '/' + mount)) : base
                    const nextBase = nextBaseRaw || '/'
                    collect(nextBase, layer.handle)
                }
            }
        }

        // Start from app router (avoid touching internals if undefined)
        // @ts-ignore - accessing Express internals for debug/route listing
        const rootRouter = (app as any)._router ?? (app as any).router ?? null
        if (rootRouter) {
            collect('', rootRouter)
        }
        return lines
    }

    // Expose debug endpoint
    app.get('/__routes', (_req, res) => {
        try {
            return res.json({ routes: getRoutes() })
        } catch (e) {
            return res.status(500).json({ error: 'Failed to enumerate routes' })
        }
    })

    try {
        const lines = getRoutes()
        const output = lines.join('\n')
        if (output) {
            console.log('[Routes]\n' + output)
        } else {
            console.log('[Routes] No routes registered')
        }
    } catch {}
})

function writePid() {
    try {
        writeFileSync(PID_FILE, String(process.pid), { encoding: 'utf8' })
        console.log(`PID ${process.pid} written to ${PID_FILE}`)
    } catch (err) {
        console.error('Failed to write a PID file:', err)
    }
}

async function gracefulShutdown(signal?: NodeJS.Signals) {
    console.log(`Shutting down${signal ? ' due to ' + signal : ''}...`)
    try {
        await server.stop()
    } catch (err) {
        console.error('Error while stopping server:', err)
    }

    try {
        if (existsSync(PID_FILE)) {
            const pidText = readFileSync(PID_FILE, 'utf8').trim()
            if (pidText === String(process.pid)) {
                rmSync(PID_FILE, { force: true })
            }
        }
    } catch (err) {
        // ignore cleanup errors
    }

    process.exit(0)
}

process.on('SIGINT', () => { void gracefulShutdown('SIGINT') })
process.on('SIGTERM', () => { void gracefulShutdown('SIGTERM') })
process.on('exit', () => {
    try {
        if (existsSync(PID_FILE)) {
            const pidText = readFileSync(PID_FILE, 'utf8').trim()
            if (pidText === String(process.pid)) {
                rmSync(PID_FILE, { force: true })
            }
        }
    } catch (err) {
        // ignore
    }
})

try {
    server.listen().then(() => {
        writePid()
    }).catch((e) => {
        console.error(e)
        process.exit(1)
    })
} catch (e) {
    console.log(e)
    process.exit(1)
}
