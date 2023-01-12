// This is the generic config class for all platforms that doesn't have a special
// implementation (e.g: vercel, netlify). All config classes extends this one.
export class GenericConfigProvider {
    axiomUrl = process.env.AXIOM_URL || 'https://cloud.axiom.co';
    shoudSendEdgeReport = false;

    getProxyPath = () => "/_axiom"

    isEnvVarsSet(): boolean {
        return !!(this.axiomUrl && process.env.AXIOM_DATASET && process.env.AXIOM_TOKEN);
    }

    getIngestURL = (): string {
        return `${this.axiomUrl}/api/v1/datasets/${this.getDataset()}/ingest`;
    }

    getDataset(): string | undefined {
        return process.env.AXIOM_DATASET;
    }

    getAxiomToken(): string | undefined {
        return process.env.AXIOM_TOKEN
    }

    getEnvironment(): string | undefined {
        return process.env.NODE_ENV
    }

    getRegion(): string | undefined {
        return process.env.REGION 
    }

    getMeta() {
        return {
            platform: {
                environment: this.getEnvironment(),
                region: this.getRegion(),
            },
        };
    }
}
