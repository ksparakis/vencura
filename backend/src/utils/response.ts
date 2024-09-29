function response(statusCode: number, body: any) {
    return {
        statusCode,
        body: JSON.stringify(body),
    };
}

export { response };
