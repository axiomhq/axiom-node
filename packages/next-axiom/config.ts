import { LogEvent } from "axiom-js-logger";
import { NextApiRequest } from "next";

export interface RequestReport {
  startTime: number;
  statusCode?: number;
  ip?: string;
  region?: string;
  path: string;
  host: string;
  method: string;
  scheme: string;
  userAgent?: string | null;
}

// This is the generic config class for all platforms that doesn't have a special
// implementation (e.g: vercel, netlify). All config classes extends this one.
export class GenericConfig {
  proxyPath = '/_axiom';
  isBrowser = typeof window !== 'undefined';
  shoudSendEdgeReport = false;
  token = process.env.AXIOM_TOKEN;
  dataset = process.env.AXIOM_DATASET || '';
  environment: string = process.env.NODE_ENV || '';
  axiomUrl = process.env.AXIOM_URL || 'https://cloud.axiom.co';
  region = process.env.REGION || undefined;

  isEnvVarsSet(): boolean {
    return !!(this.axiomUrl && process.env.AXIOM_DATASET && process.env.AXIOM_TOKEN);
  }

  getIngestURL(): string {
    return `${this.axiomUrl}/api/v1/datasets/${this.dataset}/ingest`;
  }

  wrapWebVitalsObject(metrics: any[]): any {
    return metrics.map(m => ({
        webVital: m,
        _time: new Date().getTime(),
        platform: {
          environment: this.environment,
          source: 'web-vital',
        },
    }))
  }

  injectPlatformMetadata(logEvent: LogEvent, source: string) {
    logEvent.platform = {
      environment: this.environment,
      region: this.region,
      source: source + '-log',
    };
  }

  // TODO: get from framework if possible, e.g: NextApiRequest
  generateRequestMeta(req: NextApiRequest): RequestReport {
    return {
      startTime: new Date().getTime(),
      path: req.url!,
      method: req.method!,
      host: this.getHeaderOrDefault(req, 'host', ''),
      userAgent: this.getHeaderOrDefault(req, 'user-agent', ''),
      scheme: 'https',
      ip: this.getHeaderOrDefault(req, 'x-forwarded-for', ''),
      region: this.region,
    };
  }

  // TODO: get from framework if possible, e.g: NextApiRequest
  getHeaderOrDefault(req: any, headerName: string, defaultValue: any) {
    return req.headers[headerName] ? req.headers[headerName] : defaultValue;
  }
}

export default new GenericConfig()
