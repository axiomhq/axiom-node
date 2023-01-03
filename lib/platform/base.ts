import { NextWebVitalsMetric } from 'next/app';
import { RequestReport } from '../logging';
import { EndpointType } from '../shared';

// This is the base class for all platform providers. It contains all the different
// configrations per provider, and the functions that are used by the logger. Implement
// this interface to have special behaviour for your platform.
export default interface Provider {
  shoudSendEdgeReport: boolean;
  token: string | undefined;
  environment: string;
  region: string | undefined;
  axiomUrl: string | undefined;

  isEnvVarsSet(): boolean;
  getIngestURL(t: EndpointType): string;
  wrapWebVitalsObject(metrics: NextWebVitalsMetric[]): any;
  injectPlatformMetadata(logEvent: any, source: string): void;
  generateRequestMeta(req: any): RequestReport;
  getLogsEndpoint(): string
  getWebVitalsEndpoint(): string
}
