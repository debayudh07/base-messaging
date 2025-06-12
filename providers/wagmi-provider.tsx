"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { getConfig } from "../lib/wagmi";

coinbaseWallet.preference = "smartWalletOnly";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        rainbowWallet,
        walletConnectWallet,
        metaMaskWallet,
        coinbaseWallet,
      ],
    },
  ],  {
    appName: "XMTP Messaging App",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "2f5a2fa919a66a4b4c2b5c80a5a8b5f3", // Replace with your actual project ID
  }
);

export default function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig(connectors));
  const [queryClient] = useState(() => new QueryClient());

  const selectedTheme = darkTheme({
    accentColor: "rgb(34 197 94)", // Tailwind green-500
    accentColorForeground: "white",
    borderRadius: "small",
    fontStack: "system",
    overlayBlur: "small",
  });

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={selectedTheme}
          coolMode
          modalSize="wide"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
