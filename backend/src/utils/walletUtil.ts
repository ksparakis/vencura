import type {APIGatewayProxyEvent} from "aws-lambda";
import {ethers} from "ethers";

function getWallet(req: APIGatewayProxyEvent):string{
    return req.requestContext.authorizer?.claims?.verified_credentials[0].address
}

function getProvider(){
    // TODO: Secrets should come from env vars or aws secret manager
    return new ethers.InfuraProvider(
        'sepolia',
        '2da9d3dd9fbd42ef9d3447774208153f',
        'eDygxYmfKnj52qDqTJCFkO43rjVk2CHJ4IhEWzkFFz4LMPU3+9NB1A'
    )
}

const apiKey= "dyn_t9PVDUcrb8rxXw84PCg8F2LaPoxsyUyqBym4QmrbN0qPXx3wHJ2uh8Sg"

export {
    getWallet,
    getProvider
}
