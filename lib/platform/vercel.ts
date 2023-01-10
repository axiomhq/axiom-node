import PlatformDetection from './detection';

const ingestEndpoint = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT || process.env.AXIOM_INGEST_ENDPOINT || '';

export default class VercelDetection implements PlatformDetection {
    isEnvVarsSet(): boolean {
        return ingestEndpoint != undefined && ingestEndpoint != '';
    }
}
