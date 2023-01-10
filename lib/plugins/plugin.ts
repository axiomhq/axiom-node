// TODO: replace with a generic type?
// import { NextWebVitalsMetric } from 'next/app';
import { LogEvent, RequestReport } from '../logging';
import { EndpointType } from '../logging/shared';

// This is the base class for all platform providers. It contains all the different
// configrations per provider, and the functions that are used by the logger. Implement
// this interface to have special behaviour for your platform.
export default interface AxiomPlugin {
  getIngestURL(t: EndpointType): string;
  wrapWebVitalsObject(metrics: any[]): any;
  extendLogEvent(logEvent: LogEvent, source: string): LogEvent;
  generateRequestMeta(req: any): RequestReport;
  getLogsEndpoint(): string
  getWebVitalsEndpoint(): string
}
