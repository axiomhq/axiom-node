import { GenericConfigProvider } from "./generic_provider";

const ingestEndpoint = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT || process.env.AXIOM_INGEST_ENDPOINT || '';

export default class VercelConfig extends GenericConfigProvider {
    provider = 'vercel';
    shoudSendEdgeReport = true;
    region = process.env.VERCEL_REGION || undefined;
    environment = process.env.VERCEL_ENV || process.env.NODE_ENV || '';
    token = undefined;
    axiomUrl = ingestEndpoint;

    constructor() {
        super()
    }

    isEnvVarsSet(): boolean {
        return ingestEndpoint != undefined && ingestEndpoint != '';
    }

    getIngestURL(t: EndpointType) {
        const url = new URL(this.axiomUrl);
        url.searchParams.set('type', t.toString());
        return url.toString();
    }

    getWebVitalsEndpoint(): string {
        return `${this.proxyPath}/web-vitals`;
    }

    getMeta() {
        return {
            vercel: {
                environment: this.environment,
                region: this.region,
            },
        };
    }
}
