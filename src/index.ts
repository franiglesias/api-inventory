import ExpressServer from "./server/expressServer.ts";
import appRouter from "./routes/router.ts";

const HOST: string = process.env.HOST || 'localhost'
const PORT: number = Number(process.env.PORT) || 3000

// Compose routers/middleware outside the server implementation
const server = new ExpressServer(HOST, PORT, (app) => {
    app.use(appRouter)
})

try {
    server.listen()
} catch (e) {
    console.log(e)
    process.exit(1)
}
