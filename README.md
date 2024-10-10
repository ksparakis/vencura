# Vencura

## Introduction
I built a crypto Venmo-like app as part of a backend challange with the following features:

- Users can log in with various social accounts or a wallet.
- On account creation, an embedded wallet is encrypted with a user-defined password and stored securely.
- Users can send money, sign a message, & check their balance.


The app uses an AWS Serverless TypeScript backend and a Next.js frontend deployed on Vercel. My focus was to build a functional, production-ready product within a few days, showcasing:

- CI/CD pipelines
- Ethers.js for wallet creation and Ethereum interaction
- Unit testing with JEST
- Encryption and security best practices
- TypeScript, TypeORM, Zod, and Middy
- Serverless framework with AWS
- DB migrations using TypeORM-cli


**Deployed at:**
https://vencura.sparakis.com


Cheers,

Konstantinos Sparakis

## How to Run

1. Clone git repo locally
2. Get a copy of the `.env` file from @Ksparaks, or fill out your own variables into the backend `.env`
3. Inside the backend folder, run migrations if using your own database:
   ```bash
   npm run migrate:up
   ```
4. Run Backend locally: open a terminal, navigate to the backend folder, and run:
   ```bash
   npm i
   npm run dev
   ```
5. Run Frontend: open a terminal, navigate to the frontend folder, and run:
   ```bash
   npm i
   npm run dev
   ```
6. go to `localhost:3000`


## TODO's & Proggress
10/10/24 - The app is now fully functional and I am turning my attention to testing, cleaning & organizing the code as well as getting CI/CD Pipelines

### Things on my list to improve
 #### Backend
- Get backend deployed automatically with github action
- Add Jest tests and coverage of Backend
- Ensure Backend Typescript passes Eslint
- Encrypt SQS message since it contains a password
- Ensure there is no logging of passwords
- Get Zod body/path/query validation built into the middleware chain.
- Add better check for wrong password input
- Update IAM role to be of least privelage
- Update cors origin to restrict cors.

#### Frontend
- Clean up Code Organization
- Need loaders while frontend is calling backend
- Buttons need to be debounced on api actions
- Ensure password clears out on logout
- Rework UI

-----

## Backend Excersize Original Prompt

In this exercise, you are going to build the Venmo of wallets. 💰  We call it “VenCura” 

<aside>
🤯 Thank you GPT ❤️ “The name combines the words "Venmo" and "Custodian" to create a unique name that suggests a safe and reliable financial service.  "Cura" means "care" or "guardianship" in Latin, which fits with the idea of a custodian service.”
</aside>

In this take-home, you will build an API platform (with a basic UI) to generate custodial wallets on the backend with support for basic actions.  We leave it kinda open-ended to not limit your creativity and to let you focus on things that you are interested in, within this problem.

### Requirements:

- An authenticated user can create at least one account/wallet.
- All the interactions with the custodial wallet would be done on the backend via an API.
- A user can perform at least these actions on the wallet:
    - getBalance() →  balance: number (get the current balance on the wallet.
    - signMessage(msg: string) → signedMessage: string (The signed message with the private key)
    - sendTransaction(to: string, amount: number) → transactionHash: string (sends a transaction on the blockchain)
- Basic UI to interact with the API.
- We encourage you to use the language/framework that you’re most comfortable with as long as it is a language we are familiar with (Javascript/Typescript, Ruby, Python, Java, and Scala). Internally, we use TypeScript, Node and React, but our core product needs to work seamlessly with many different build tools and frameworks.

### What to focus on:

- Code + API + Schema design and implementation.
- Security considerations (could be in a writeup).
- Testing.

### UI:

The main focus of this takehome is the API/Backend experience. The UI should allow you to showcase the functionality that you built on the backend.


### Tips (you don’t have to follow any of them):
- You can use any open source library for managing the wallet interactions on the backend
    - Ethers has a [Wallet](https://docs.ethers.org/v6/api/wallet/#about-wallets) class that handles the private key and common methods
- You can use these faucets to get some free  [sepolia](https://sepoliafaucet.com/) (assuming that you are building it on Ethereum)
- Here are two RPC [infura](https://app.infura.io/) end-points for ETH testnets that you can use:
    - Seopolia - https://sepolia.infura.io/v3/91de7ed3c17344cc95f8ea31bf6b3adf
