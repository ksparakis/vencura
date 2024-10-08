import { getDb } from "../utils/dbUtils";
import {CryptoTransactions} from "../models/cryptoTransactions";
import createHttpError from "http-errors";
import {CryptoTransactionStatus} from "../types/shared-types";
import {UpdateResult} from "typeorm";

async function newTransaction(
    sub: string,
    to: string,
    amount: string): Promise<CryptoTransactions> {
    const db = getDb();
   const tx =  db.getRepository(CryptoTransactions).create({
        id: '1234',
        sub,
        amount,
        status: 'enqueued',
        to
    })
    return tx.save();
}

async function checkTransactionCompleted(id: string): Promise<boolean> {
    const db = getDb();
    const tx = await db.getRepository(CryptoTransactions).findOneBy({id});
    if(!tx)
    {
        throw new createHttpError.NotFound('Transaction not found');
    }
    if(tx.status === 'succeeded' || tx.status === 'failed')
    {
        return true;
    } else {
        return false;
    }
}

async function updateTransactionStatus(status: CryptoTransactionStatus): Promise<UpdateResult>{
    const db = getDb();
    return await db.getRepository(CryptoTransactions).update({id: '1234'}, {status});
}


export {
    newTransaction,
    checkTransactionCompleted,
    updateTransactionStatus
}
