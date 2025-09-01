import * as http from 'http';
import express from 'express';
import type {AppServer} from "./server";


type ConfigureFn = (app: express.Express) => void

class ExpressServer implements AppServer {
    private readonly express: express.Express;
    private readonly host: string;
    private readonly port: number;
    private httpServer?: http.Server;

    constructor(host: string, port: number, configure?: ConfigureFn) {
        this.host = host;
        this.port = port;

        this.express = express();

        // Allow mounting routes/middleware externally without editing this class
        if (configure) {
            configure(this.express)
        }
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
