import { NextApiRequest } from "next";
import { NextWebVitalsMetric } from 'next/app';
import config, { isVercel, Version } from '../config';

export declare type WebVitalsMetric = NextWebVitalsMetric & { route: string };

let collectedMetrics: WebVitalsMetric[] = [];


export function reportWebVitals(metric: NextWebVitalsMetric) {
  collectedMetrics.push({ route: window.__NEXT_DATA__?.page, ...metric });
  // if Axiom env vars are not set, do nothing,
  // otherwise devs will get errors on dev environments
  if (!config.isEnvVarsSet()) {
    return;
  }
  throttledSendMetrics();
}
