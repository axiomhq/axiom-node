import ConfigProvider from './config_provider';

const ingestEndpoint = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT || process.env.AXIOM_INGEST_ENDPOINT || '';
const isBrowser = typeof window !== 'undefined';

export default class VercelConfigProvider implements ConfigProvider {
    region = process.env.VERCEL_REGION || undefined;
    environment = process.env.VERCEL_ENV || process.env.NODE_ENV || '';
    axiomUrl = ingestEndpoint;

    isEnvVarsSet(): boolean {
        return ingestEndpoint != undefined && ingestEndpoint != '';
    }

    getDataset = () => 'vercel'

    getIngestURL(): string {
        if (isBrowser) {
            return `/_axiom/logs`;
        }
        const url = new URL(this.axiomUrl);
        // TODO: find a solution for vercel to get log type
        url.searchParams.set('type', 'log');
        return url.toString();
    }

    getMeta(req: any) {
        return {
            vercel: {
                environment: this.environment,
                region: this.region,
            },
        };
    }

    shouldSendEdgeReport = () => true;
}
