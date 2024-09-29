'use client';

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";


export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {



  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: "69b77dec-b184-44c0-8517-d8927eff1d32",
           walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
