import "reflect-metadata"; // super importante para o typeorm
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {Request, Response} from "express";
import {Routes} from "./routes";
const path = require('path');

// vocês podem fazer a chamada do createConnection de forma separada e usar o app.use() do express para fazer a conexão
createConnection().then(async connection => {

    const app = express();

    app.use(cors({allowedHeaders: 'Content-Type, Cache-Control'}));
    app.options('*', cors());  // enable pre-flight

    app.use(bodyParser.json());

    // esse é o modo de como estamos pegando as nossas rotas, mais vocês podem fazer do jeito tradicional do express, só terão que adicionar as informações de qual controller que usarão e qual action
    Routes.forEach(route => {
        
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            
            const result = (new (route.controller as any)())[route.action](req, res, next);
            
            if (result instanceof Promise) {
                
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                
                res.json(result);
            
            }
        
        });

    });

    // app.listen(3005);
    // app.listen(3000);
    app.listen(3333);

    console.log("Lets code");

}).catch(error => console.log(error));
