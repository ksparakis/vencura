import { getDb } from "../utils/dbUtils";
import {CryptoTransactions} from "../models/cryptoTransactions";
import createHttpError from "http-errors";
import {CryptoTransactionStatus} from "../types/shared-types";
import {UpdateResult} from "typeorm";
import {v4} from "uuid"

async function newTransaction(
    sub: string,
    to: string,
    amount: string): Promise<CryptoTransactions> {
    const db = getDb();
   const tx =  db.getRepository(CryptoTransactions).create({
        id: v4(),
        sub,
        amount,
        status: 'enqueued',
        to
    })
    return tx.save();
}

async function checkTransactionCompleted(id: string): Promise<CryptoTransactionStatus> {
    const db = getDb();
    const tx = await db.getRepository(CryptoTransactions).findOneBy({id});
    if(!tx)
    {
        throw new createHttpError.NotFound('Transaction not found');
    }

    return tx.status
}

async function updateTransactionStatus(transactionId: string, status: CryptoTransactionStatus): Promise<UpdateResult>{
    const db = getDb();
    return await db.getRepository(CryptoTransactions).update({id: transactionId}, {status});
}


export {
    newTransaction,
    checkTransactionCompleted,
    updateTransactionStatus
}
