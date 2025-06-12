// Format time
export const formatTime = (timestamp: Date): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Format date
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Shorten address for display
export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Copy address to clipboard
export const copyAddressToClipboard = (address: string): void => {
  if (address && typeof navigator !== "undefined") {
    navigator.clipboard.writeText(address);
  }
};

// Validate Ethereum address
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
