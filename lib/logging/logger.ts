import { throttle } from 'shared';
import Client from '../client';
import config from '../config';
import { DEFAULT_LOG_LEVEL, LogEvent, Logging, LogLevel, RequestReport } from '.';
import { prettyPrint } from './prettyPrint';


export class Logger implements Logging {
    public logEvents: LogEvent[] = [];
    throttledSendLogs = throttle(this.sendLogs, 1000);
    children: Logger[] = [];
    public logLevel: string;
    client: Client;

    constructor(
        private args: { [key: string]: any } = {},
        private req: RequestReport | null = null,
        private autoFlush: Boolean = true,
        public source: 'frontend' | 'lambda' | 'edge' = 'frontend',
        logLevel?: string,
    ) {
        this.client = new Client();
        const newLocal = (this.logLevel = logLevel || DEFAULT_LOG_LEVEL || 'debug');
    }

    debug = (message: string, args: { [key: string]: any } = {}) => {
        this.log('debug', message, args);
    };
    info = (message: string, args: { [key: string]: any } = {}) => {
        this.log('info', message, args);
    };
    warn = (message: string, args: { [key: string]: any } = {}) => {
        this.log('warn', message, args);
    };
    error = (message: string, args: { [key: string]: any } = {}) => {
        this.log('error', message, args);
    };

    with = (args: { [key: string]: any }) => {
        const child = new Logger({ ...this.args, ...args }, this.req, this.autoFlush, this.source);
        this.children.push(child);
        return child;
    };

    withRequest = (req: RequestReport) => {
        return new Logger({ ...this.args }, req, this.autoFlush, this.source);
    };

    log = (level: string, message: string, args: { [key: string]: any } = {}) => {
        if (LogLevel[level] < LogLevel[this.logLevel]) {
            return;
        }
        const logEvent: LogEvent = {
            level,
            message,
            _time: new Date(Date.now()).toISOString(),
            fields: this.args || {},
        };

        // check if passed args is an object, if its not an object, add it to fields.args
        if (typeof args === 'object' && args !== null && Object.keys(args).length > 0) {
            logEvent.fields = { ...logEvent.fields, ...args };
        } else if (args && args.length) {
            logEvent.fields = { ...logEvent.fields, args: args };
        }

        config.injectPlatformMetadata(logEvent, this.source);

        if (this.req != null) {
            logEvent.request = this.req;
            if (logEvent.platform) {
                logEvent.platform.route = this.req.path;
            } else if (logEvent.vercel) {
                logEvent.vercel.route = this.req.path;
            }
        }

        this.logEvents.push(logEvent);
        if (this.autoFlush) {
            this.throttledSendLogs();
        }
    };

    flush = async () => {
        await Promise.all([this.sendLogs(), ...this.children.map((c) => c.flush())]);
    };

    private sendLogs() {
        if (!this.logEvents.length) {
            return;
        }

        if (!config.isEnvVarsSet()) {
            // if AXIOM ingesting url is not set, fallback to printing to console
            // to avoid network errors in development environments
            this.logEvents.forEach((ev) => prettyPrint(ev));
            this.logEvents = [];
            return;
        }

        this.client.ingestEvents(config.dataset, this.logEvents);
    }
}
