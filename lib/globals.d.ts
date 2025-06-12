declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: NodeJS.Process;
    global: typeof globalThis;
  }
    let Buffer: typeof Buffer;
  let process: NodeJS.Process;
  let global: typeof globalThis;
}

// Add declaration for process/browser module
declare module 'process/browser' {
  const process: NodeJS.Process;
  export default process;
}

export {};
