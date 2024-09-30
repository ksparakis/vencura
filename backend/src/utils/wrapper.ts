export default getMiddleware;

function getMiddleware(getMiddleware:any) {
    return async (...args: any[]) => {
        const middleware = await getMiddleware();

        return await middleware(...args);
    };
}
