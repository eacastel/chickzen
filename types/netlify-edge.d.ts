// types/netlify-edge.d.ts
declare module "https://edge.netlify.net" {
  export interface Context {
    geo?: {
      country?: string;
      city?: string;
      region?: string;
    };
    next(): Promise<Response>;
  }
}