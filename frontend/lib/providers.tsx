'use client';

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";


export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {

    const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;
    if(!environmentId) {
        throw new Error('Environment ID not found, please set NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID env var');
    }

    return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: environmentId,
           walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
