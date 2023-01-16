import { ConfigProvider, GenericConfigProvider, VercelConfigProvider, NetlifyConfigProvider } from "axiom-js-logger";

export const isVercel = process.env.AXIOM_INGEST_ENDPOINT || process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;
export const isNetlify = process.env.NETLIFY == 'true';

// Detect the platform provider, and return the appropriate config
// fallback to generic config if no provider is detected
let config: ConfigProvider = new GenericConfigProvider();
if (isVercel) {
    config = new VercelConfigProvider();
} else if (isNetlify) {
    config = new NetlifyConfigProvider();
}

export default config;