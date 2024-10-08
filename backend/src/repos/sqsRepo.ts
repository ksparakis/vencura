import {SQSClient, SendMessageCommand, SendMessageCommandOutput} from '@aws-sdk/client-sqs';
import {getConfig} from "../utils/config";
import createHttpError from "http-errors";

async function enqueueMessage(payload: any):Promise <SendMessageCommandOutput> {
    const client = new SQSClient({ region: "us-east-1" });
    const config = getConfig();

    const params = {
        QueueUrl: config.QUEUE_URL, // The URL of the SQS queue

        MessageBody: JSON.stringify({ // The message you want to send
            key: "sendTransaction",
            payload, // Include event payload or any other relevant data
        }),
        DelaySeconds: 0 // Optional: Delay message delivery by X seconds
    };

    try {
        const command = new SendMessageCommand(params);
        return await client.send(command);
    } catch (error) {
        // error handling.
        throw new createHttpError.InternalServerError('Error sending message to SQS');
    }
};

export {
    enqueueMessage
}
