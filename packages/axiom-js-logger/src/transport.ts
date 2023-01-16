import Client, { ClientOptions } from "axiom-js";
import { LogEvent } from "./logging";

export default interface Transport {
    send(events: LogEvent[]): void;
}

interface AxiomTransportConfig extends ClientOptions {
    dataset: string;
}

export class AxiomTransport implements Transport {
    private client: Client;

    constructor(public config: AxiomTransportConfig) {
        this.client = new Client(config);
    }

    send(events: LogEvent[]) {
        this.client.ingestEvents(this.config.dataset, events);
    }
}
