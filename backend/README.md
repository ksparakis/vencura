## Backend Introduction

I implemented a serverless architecture for this project using AWS services.

### Cloud Technologies:
- **AWS Lambda & Lambda Layers** - Function execution and shared dependencies.
- **AWS API Gateway** - To expose API endpoints.
- **AWS SQS** - For asynchronous processing.
- **AWS S3** - For storage.
- **Cockroach Cloud Serverless SQL** - As the database.

### Key Node Modules:
- **Serverless Framework** - For organizing, deploying, and local testing of the project.
- **Webpack** - For bundling and optimizing Lambda code.
- **Jest** - For testing.
- **TypeScript** - For type safety and better development experience.
- **Dynamic.xyz** - Used for authentication.
- **TypeORM** - For database migrations, model definitions, and interactions.
- **Middy** - Middleware engine for handling Lambda middleware. I developed custom middleware plugins.
- **Ethers** - For communication with ethereum networks
## API Endpoints

- **GET /user** - Fetch user details using sub in JWT token.
- **POST /user** - Create a new user, and an encrypted embedded wallet, encrypted with a password.
- **GET /user/other** - Fetch details of other users.
- **GET /wallet/balance** - Retrieve wallet balance.
- **POST /wallet/sign** - Sign transactions.
- **POST /wallet/transaction** - Submit a transaction to the Transactions sqs queueu for processing.
- **GET /wallet/transaction/:id** - Fetch transaction details by ID to see progress in queue.

## Transaction Processing with SQS

Since Ethereum and many blockchain transactions can take time, I used SQS to manage long-running processes. API Gateway's 30-second timeout necessitated this, as SQS allows for decoupling and handling transactions asynchronously.

The flow being the following
User initiates a transaction with POST /wallet/transaction, we save some transaction data to database, but then create a
message with the transaction data and put it into our sqs queue. AWS then launches our processTransaction lambda to complete the transaction.
We add an artificial timeout at 5 minutes here to prevent the lambda from running up to 15 min or more.

The client has to pint the GET /wallet/transaction/:id endpoint to check the status of the transaction periodically.
(a further improvement would be to use a websocket here instead)
## Optimized Deployment

In a typical Serverless deployment, everything is packaged into a single deployment bundle.
While this works initially, as the number of Lambda functions grows, so does the size of the
package, quickly hitting AWS's 150MB limit for deployment packages. The typical approach to solving this
is turning on individual packagin but that means for each lambda the node_modules need to be packaged with it
This can lead to slower deployments, increased storage costs, and longer cold start times.

To address this, I implemented a number of optimizations to keep the deployment package
size small and improve performance.

1. **Lambda Layers**: I separated out the common dependencies into a Lambda layer, which is shared across 
all the Lambda functions. This prevents the need to bundle the same `node_modules` directory
with each individual function, significantly reducing duplication and minimizing the deployment
size. By consolidating shared libraries into a layer, the Lambda functions can load
these dependencies directly from the layer, reducing the overall package size and improving cold start times.

2. **Package Deduplication and Pruning**: After bundling dependencies, I used the following commands to optimize the package further:
    - `npm dedupe` to remove duplicate packages from the dependency tree.
    - `npx npm-prune` to remove unnecessary files from `node_modules`, leaving only what's required for production.

   These steps helped to streamline the package and reduce the deployment size even more, with minimal impact on functionality.

3. **Per-Function Packaging**: By default, the Serverless Framework bundles all functions into a single package,
but I configured it to package each function individually. This approach leverages Lambda's ability to handle
function-level deployment, but with the added step of referencing the shared Lambda layer for dependencies, it keeps the individual package sizes minimal.

4. **Webpack Optimization**: I incorporated a custom Webpack configuration to further minimize the package size.
I used **TerserPlugin** for code minification and **webpack-node-externals** to exclude unnecessary dependencies
from the final bundle. This ensures that only the essential code is included in each Lambda function’s deployment
package. Additionally, I enabled source map generation to facilitate debugging in production, allowing me to trace
back errors to their original source code line numbers instead of minified code.

   The result of these optimizations is a significant reduction in cold start times. AWS only keeps a Lambda "warm"
if it's called frequently, and if inactive for a certain period (usually around 15-30 minutes), it can experience a "cold start" where it needs to be reloaded onto the server. By minimizing the memory footprint and package size, cold starts are faster, resulting in better user experience and reduced latency.

### Impact

- **Before Optimization**: The initial deployment package was larger and not minified, which not only caused deployment delays but also risked hitting AWS's maximum Lambda package size limit as the api project grows.
- **After Optimization**: The deployment package size was reduced to just 17.8MB, with the bulk of that (17MB) being the shared `node_modules` layer. This optimization significantly reduced both storage costs and cold start times while improving overall deployment efficiency.

By leveraging these optimizations, I ensured that the system scales efficiently while maintaining a smooth user experience. Future expansions can continue using this optimized framework, allowing for rapid, scalable deployments without the overhead of large, bloated packages.

