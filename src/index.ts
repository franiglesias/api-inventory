import ExpressServer from "./server/expressServer.js";

const HOST: string = process.env.HOST || 'localhost'
const PORT: number = Number(process.env.PORT) || 3000

const server = new ExpressServer(HOST, PORT)

try {
    server.listen()
} catch (e) {
    console.log(e)
    process.exit(1)
}
