import * as http from 'http';
import express from 'express';
import type {AppServer} from "./server.js";


class ExpressServer implements AppServer {
    private express: express.Express;
    private httpServer?: http.Server;
    private host: string;
    private port: number;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;

        this.express = express();
    }

    public getExpress(): express.Express {
        return this.express
    }

    public async listen(): Promise<void> {
        return new Promise(resolve => {
            this.httpServer = this.express.listen(this.port, this.host, () => {
                console.log(
                    `Use express server: App listening on ${this.host}:${this.port}`
                );

                return resolve();
            });
        })
    }

    public async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close(error => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve();
                })
            }
        });
    }
}

export default ExpressServer;
