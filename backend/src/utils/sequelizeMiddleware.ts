import { DbConnection } from './DbConnection';
import userModel from "../models/users";
import middy from "@middy/core";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {MiddlewareFn, MiddlewareObj, MiddyRequest} from "../types/shared-types";




const closeConnection = async (handler: any) => {
    const db = handler?.context?.db;

    if (db && db.disconnect) {
        await db.disconnect();
    }
};

export const sequelizeMiddleware = (): any => {
    console.log("RAN SEQUELIZE MIDDLEWARE")
    const modelsFunction = (instance: any, Sequelize: any)  =>{
            return {
                Users: userModel(Sequelize),
            }
    };

    return {
        before: async (handler : MiddyRequest): Promise<void> => {
            handler.context.db = new DbConnection(modelsFunction);
        },
        after: closeConnection,
        onError: closeConnection
    };
};

