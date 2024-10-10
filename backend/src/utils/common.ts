import {getUserBySub} from "../repos/userRepo";
import {decrypt} from "./crypto";
import {getWallet} from "../repos/walletUtil";
import {HDNodeWallet} from "ethers";
import {APIGatewayProxyEvent} from "aws-lambda";
import {Claims, TokenPayload} from "../types/shared-types";

async function getWalletForUser(sub: string, password: string): Promise<HDNodeWallet>{
    const user = await getUserBySub(sub);
    const mnemonic = decrypt(user.encryptedMnemonic, password, sub);
    return getWallet(mnemonic);
}


function getClaims(event: APIGatewayProxyEvent): TokenPayload {
    // Check to see if the request has a valid authorizer and is a json object or not
    const claims = event.requestContext.authorizer?.claims as Claims;
    if (!claims) {
            throw new Error('No authorizer found in request');
    }

    if(typeof claims === 'string'){
        return JSON.parse(claims) as TokenPayload;
    } else{
        return claims;
    }
}

export {
    getWalletForUser,
    getClaims
}
