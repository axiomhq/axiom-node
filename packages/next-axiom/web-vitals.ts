import { NextWebVitalsMetric } from "next/app";
import config from "./config";
import log from './logger';

export declare type WebVitalsMetric = NextWebVitalsMetric & { route: string };

export function reportWebVitals(metric: NextWebVitalsMetric) {
    const event = { route: window.__NEXT_DATA__?.page, ...metric };
    // if Axiom env vars are not set, do nothing,
    // otherwise devs will get errors on dev environments
    if (!config.isEnvVarsSet()) {
        return;
    }
    // TODO: make sure to format the webVitals payload correctly
    log.info(event)
}
