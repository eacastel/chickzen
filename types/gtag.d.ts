export {};

declare global {
  interface Window {
    gtag: (...args: [command: string, ...fields: unknown[]]) => void;
  }
}
