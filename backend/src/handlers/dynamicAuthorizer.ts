import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, Context, Callback } from 'aws-lambda';
import{ JwtHeader, verify, decode  } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import {getLogger, initLogger} from "../middleware/logger"; // For fetching signing keys if using JWKS endpoint

// Define the expected token payload structure
interface TokenPayload {
    sub: string;
    iss: string;
    exp: number;
    walletAddress?: string;
    [key: string]: any;
}

const DYNAMIC_ID = "69b77dec-b184-44c0-8517-d8927eff1d32";
const client = new JwksClient({
    jwksUri: `https://app.dynamic.xyz/api/v0/sdk/${DYNAMIC_ID}/.well-known/jwks`, // Replace with the actual JWKS URI
});

export const handler = async (
    event: APIGatewayTokenAuthorizerEvent,
    context: Context,
    callback: Callback<APIGatewayAuthorizerResult>,
) => {
    initLogger();
   const logger =  getLogger();
    const token = event.authorizationToken;
    if (!token) {
        logger.debug('Unauthorized: No token provided', { event });
        callback('Unauthorized');
        return;
    }

    try {
        // Strip 'Bearer ' prefix if present
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

        // Decode token header to get the key ID (kid)
        const decodedHeader = decode(tokenString, { complete: true }) as { header: JwtHeader };
        if (!decodedHeader || !decodedHeader.header) {
            logger.debug('Unauthorized Decoding kid failed', { event });
            callback('Unauthorized');
            return;
        }

        const kid = decodedHeader.header.kid;

        // Get signing key
        const getSigningKey = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                client.getSigningKey(kid, (err, key) => {
                    if (err) {
                        reject(err);
                    } else {
                        if(key)
                        {
                            const signingKey = key.getPublicKey();
                            resolve(signingKey);
                        }  else{
                            logger.debug('Unauthorized Signing key failed', { event });
                            callback('Unauthorized');
                            return
                        }

                    }
                });
            });
        };

        const signingKey = await getSigningKey();
        const issuer = 'app.dynamicauth.com/69b77dec-b184-44c0-8517-d8927eff1d32';

        const decoded = verify(tokenString, signingKey, {
            algorithms: ['RS256'],
            issuer
        }) as TokenPayload;

        // TODO: For more security additional checks on the decoded token
        // e.g., check expiration, audience, etc.

        // Build IAM Policy
        const policy = generatePolicy('user', 'Allow', event.methodArn, decoded);

        callback(null, policy);
    } catch (error) {
        logger.error('Authorization error:', error);
        callback('Unauthorized');
        return
    }
};

// Helper function to generate IAM policy
const generatePolicy = (
    principalId: string,
    effect: 'Allow' | 'Deny',
    resource: string,
    decodedToken: TokenPayload,
): APIGatewayAuthorizerResult => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: '*',
                },
            ],
        },
    };
};
