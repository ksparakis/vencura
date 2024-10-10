import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, Context, Callback } from 'aws-lambda';
import{ JwtHeader, verify, decode  } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import {getLogger, initLogger} from "../middleware/logger";
import {getConfig} from "../utils/config";
import {TokenPayload} from "../types/shared-types"; // For fetching signing keys if using JWKS endpoint

// Define the expected token payload structure

const config = getConfig();

const client = new JwksClient({
    jwksUri: `https://app.dynamic.xyz/api/v0/sdk/${config.DYNAMIC_ID}/.well-known/jwks`, // Replace with the actual JWKS URI
});

// Helper function to send Unauthorized response with logging
const unauthorizedResponse = (message: string, event: APIGatewayTokenAuthorizerEvent, callback: Callback): void => {
    const logger = getLogger();
    logger.debug(`Unauthorized: ${message}`, { event });
    callback('Unauthorized');
};

export const handler = async (
    event: APIGatewayTokenAuthorizerEvent,
    context: Context,
    callback: Callback<APIGatewayAuthorizerResult>,
) => {
    initLogger();
    const logger = getLogger();
    const token = event.authorizationToken;

    if (!token) {
        unauthorizedResponse('No token provided', event, callback);
        return;
    }

    try {
        // Strip 'Bearer ' prefix if present
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

        // Decode token header to get the key ID (kid)
        const decodedHeader = decode(tokenString, { complete: true }) as { header: JwtHeader };
        if (!decodedHeader || !decodedHeader.header) {
            unauthorizedResponse('Failed to decode JWT header', event, callback);
            return;
        }

        const kid = decodedHeader.header.kid;

        // Get signing key
        const getSigningKey = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                client.getSigningKey(kid, (err, key) => {
                    if (err) {
                        reject(err);
                    } else if (key) {
                        resolve(key.getPublicKey());
                    } else {
                        unauthorizedResponse('No signing key found', event, callback);
                        return;
                    }
                });
            });
        };

        const signingKey = await getSigningKey();
        const issuer = 'app.dynamicauth.com/69b77dec-b184-44c0-8517-d8927eff1d32';

        // Verify the token
        const decoded = verify(tokenString, signingKey, {
            algorithms: ['RS256'],
            issuer
        }) as TokenPayload;

        // Additional checks on the decoded token
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            unauthorizedResponse('Token has expired', event, callback);
            return;
        }

        if (decoded.iss !== issuer) {
            unauthorizedResponse('Token issuer mismatch', event, callback);
            return;
        }

        // Build IAM Policy
        const policy = generatePolicy(decoded.sub, 'Allow', '*', decoded);

        callback(null, policy);
    } catch (error) {
        logger.error('Authorization error:', error);
        callback('Unauthorized');
        return;
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
                    Resource: resource, // Be more specific than '*' when possible
                },
            ],
        },
        context: {
            claims: JSON.stringify(decodedToken)
        }
    };
};
