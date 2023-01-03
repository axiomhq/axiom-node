export const DEFAULT_LOG_LEVEL = process.env.AXIOM_LOG_LEVEL || 'debug';

export interface LogEvent {
    level: string;
    message: string;
    fields: {};
    _time: string;
    request?: RequestReport;
    platform?: PlatformInfo;
    vercel?: PlatformInfo;
    // netlify?: NetlifyInfo;
}

export enum LogLevel {
    debug = 0,
    info = 1,
    warn = 2,
    error = 3,
    off = 100,
}

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

export interface PlatformInfo {
    environment?: string;
    region?: string;
    route?: string;
    source?: string;
}

export interface Logging {
    log(level: string, message: string, args: { [key: string]: any }): void;
    flush(): Promise<void>;
}
