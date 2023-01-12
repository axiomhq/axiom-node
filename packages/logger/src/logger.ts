import { throttle } from './throttle';
import { LogEvent, Logging } from './logging';
import { DEFAULT_LOG_LEVEL, LogLevel } from "./logLevel";
import Client, { ClientOptions } from '../../axiom-js/src/';
import Transport from './transport';


export interface LoggerConfig {
    transports: Transport[],
    // for using AxiomTransport by default
    dataset?: string,
    clientOptions?: ClientOptions,
    // optional, logger constructor will set defaults
    // if values were not provided
    level?: keyof typeof LogLevel, // default: 'debug'
    source?: string, // default: 'frontend'
    disableAutoFlush?: boolean, // default: false
    // default args that will be attached to every log event
    args?: {[key: string]: any}
    // attach custom metadata to every log event
    meta?: {[key: string]: any}
}

export class Logger implements Logging {
    private logEvents: LogEvent[] = [];
    throttledSendLogs = throttle(this.sendLogs, 1000);
    children: Logger[] = [];
    public logLevel: keyof typeof LogLevel = 'debug'
    public client: Client;
    logExtensions = {}

    constructor(public config: LoggerConfig)
    {
        const defaultLogLevel: string = DEFAULT_LOG_LEVEL || 'debug';
        if (!config.level) {
            config.level = defaultLogLevel as keyof typeof LogLevel;
        }
        if(!config.source) {
            config.source = 'frontend'
        }
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

    // create a child logger with the same config as parent, extend its default args
    with = (args: { [key: string]: any }) => {
        const child = new Logger({ ...this.config, args: {...this.config.args, ...args }});
        this.children.push(child);
        return child;
    };

    log = (level: keyof typeof LogLevel, message: string, args: { [key: string]: any } = {}) => {
        if (LogLevel[level] < LogLevel[this.logLevel]) {
            return;
        }
        let logEvent: LogEvent = {
            level,
            message,
            _time: new Date(Date.now()).toISOString(),
            fields: this.config.args || {},
        };

        // check if passed args is an object, if its not an object, add it to fields.args
        if (typeof args === 'object' && args !== null && Object.keys(args).length > 0) {
            logEvent.fields = { ...logEvent.fields, ...args };
        } else if (args && args.length) {
            logEvent.fields = { ...logEvent.fields, args: args };
        }

        this.extendLogEvent(logEvent);

        this.logEvents.push(logEvent);
        if (!this.config.disableAutoFlush) {
            this.throttledSendLogs();
        }
    };

    // extends logEvent with custom metadata
    private extendLogEvent(log: LogEvent) {
        return { ...log, ...this.config.meta }
    }

    flush = async () => {
        await Promise.all([this.sendLogs(), ...this.children.map((c) => c.flush())]);
    };

    private sendLogs() {
        if (!this.logEvents.length) {
            return;
        }

        for(let transport of this.config.transports) {
            transport.send(this.logEvents)
        }
    }
}

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