import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia, polygonMumbai, baseSepolia } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

export function getConfig(connectors: ReturnType<typeof connectorsForWallets>) {
  return createConfig({
    chains: [mainnet, sepolia, polygonMumbai, baseSepolia],
    connectors,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygonMumbai.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
