export interface LogEvent {
    level: string;
    message: string;
    fields: {};
    _time: string;
    // extra fields that could be added by various frameworks or plugins
    [key: string]: any;
}

export enum EndpointType {
    webVitals = 'web-vitals',
    logs = 'logs',
}

export interface Logging {
    log(level: string, message: string, args: { [key: string]: any }): void;
    flush(): Promise<void>;
}
