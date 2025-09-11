import {Request, Response} from "express-serve-static-core";
import {ParsedQs} from "qs";
import {GetHealth} from "../../inventory/driving/forCheckingHealth/GetHealth";
import {GetHealthHandler} from "../../inventory/driving/forCheckingHealth/GetHealthHandler";

export class ForCheckingHealthApiAdapter {
    public getHealth(req: Request<{}, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>): void {
        const getHealth = new GetHealth()
        const getHealthHandler = new GetHealthHandler()
        if (getHealthHandler.handle(getHealth)) {
            response.status(200).json({
                status: 'ok'
            });
        }
        response.status(500).json({
            error: "Internal Server Error. App is not working.",
            code: "500"
        })
    }
}
