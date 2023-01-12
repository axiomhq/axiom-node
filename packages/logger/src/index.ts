import { Logger, LoggerConfig } from "./logger";
import { AxiomTransport } from "./transport";

export { Logger } from "./logger";
export { LogEvent, EndpointType } from './logging';


// createLogger provides a way to quickly create a logger with default transports
const createLogger = (config: LoggerConfig) => {
    // if no transports passed, use AxiomTransport by default
    if (config.transports.length === 0) {
        // dataset and client options are mandatory for AxiomTransport
        if (!config.dataset || !config.clientOptions) {
            throw new Error('axiom: failed to setup logger. dataset and clientOptions are required for AxiomTransport')
        }

        config.transports.push(new AxiomTransport({ ...config.clientOptions, dataset: config.dataset}))
    }
    return new Logger(config)
}

export default createLogger
