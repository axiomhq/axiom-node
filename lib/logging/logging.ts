export interface LogEvent {
    level: string;
    message: string;
    fields: {};
    _time: string;
    [key: string]: any;
    // request?: RequestReport;
    // platform?: PlatformInfo;
    // vercel?: PlatformInfo;
    // netlify?: PlatformInfo;
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
    siteId?: string;
    buildId?: string;
    deploymentUrl?: string;
    deploymentId?: string;
    environment?: string;
    region?: string;
    route?: string;
    source?: string;
}

export interface Logging {
    log(level: string, message: string, args: { [key: string]: any }): void;
    flush(): Promise<void>;
}
