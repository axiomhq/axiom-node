import { throttle } from './shared';
import { LogEvent, Logging, RequestReport } from './logging';
import { DEFAULT_LOG_LEVEL, LogLevel } from "./logLevel";
import { ClientOptions } from '../httpClient';
import Client from '../client';

/* 
Logger lifecycle:
- initiate logger 
- providate configuration url, token, dataset, logLevel ..etc
- receive log (decide to log or not?)
- inject custom metadata
- queue log
- send logs
- flush
*/
export class Logger implements Logging {
    public logEvents: LogEvent[] = [];
    throttledSendLogs = throttle(this.sendLogs, 1000);
    children: Logger[] = [];
    public logLevel: keyof typeof LogLevel = 'debug'
    public client: Client;
    logExtensions = {}

    constructor(
        public clientOptions: ClientOptions = {},
        public dataset: string,
        private args: { [key: string]: any } = {},
        private autoFlush: Boolean = true,
        public source: 'frontend' | 'lambda' | 'edge' = 'frontend',
        logLevel?: keyof typeof LogLevel,
    ) {
        this.client = new Client(this.clientOptions);
        

        const defaultLogLevel: string = DEFAULT_LOG_LEVEL || 'debug';
        // TODO: Fix
        // this.logLevel = logLevel ? LogLevel[logLevel] : LogLevel[defaultLogLevel as keyof typeof LogLevel];
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
        const child = new Logger(this.clientOptions, this.dataset, { ...this.args, ...args }, this.autoFlush, this.source);
        this.children.push(child);
        return child;
    };

    withRequest = (req: RequestReport) => {
        return new Logger(this.clientOptions, this.dataset, { ...this.args }, this.autoFlush, this.source);
    };

    log = (level: keyof typeof LogLevel, message: string, args: { [key: string]: any } = {}) => {
        if (LogLevel[level] < LogLevel[this.logLevel]) {
            return;
        }
        let logEvent: LogEvent = {
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

        // TODO: think about calling plugins on different lifecycle events
        // for (let plugin of this.plugins) {
        //     logEvent = plugin.extendLogEvent(logEvent, this.source)
        // }
        this._extendLogEvent(logEvent);

        // TODO: frameworks should inject their metadata in here, maybe 
        // also as plugins from above?
        // if (this.req != null) {
        //     logEvent.request = this.req;
        //     if (logEvent.platform) {
        //         logEvent.platform.route = this.req.path;
        //     } else if (logEvent.vercel) {
        //         logEvent.vercel.route = this.req.path;
        //     }
        // }

        this.logEvents.push(logEvent);
        if (this.autoFlush) {
            this.throttledSendLogs();
        }
    };

    // presets or plugins should call this before sending logs to be extend 
    // logs body with custom metadata
    extendLogEventsWith(body: {[key: string]: any}) {
        this.logExtensions = body;
    }

    _extendLogEvent(log: LogEvent) {
        return { ...log, ...this.logExtensions }
    }

    flush = async () => {
        await Promise.all([this.sendLogs(), ...this.children.map((c) => c.flush())]);
    };

    private sendLogs() {
        if (!this.logEvents.length) {
            return;
        }

        // if (!config.isEnvVarsSet()) {
        //     // if AXIOM ingesting url is not set, fallback to printing to console
        //     // to avoid network errors in development environments
        //     this.logEvents.forEach((ev) => prettyPrint(ev));
        //     this.logEvents = [];
        //     return;
        // }

        this.client.ingestEvents(this.dataset, this.logEvents);
    }
}
