import express from 'express'

export interface AppServer {
    getExpress(): express.Express
    listen(): Promise<void>
    stop(): Promise<void>
}
