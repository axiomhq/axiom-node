import { IngestOptions, IngestStatus } from './client';

type IngestFunction = (id: string, events: Array<object> | object, options?: IngestOptions) => Promise<IngestStatus>;

export class Batch {
    ingestFn: IngestFunction;
    id: string;
    options?: IngestOptions;

    events: Array<object> = [];

    activeFlush: Promise<IngestStatus | void> = Promise.resolve();
    nextFlush: NodeJS.Timeout = setTimeout(() => {}, 0);
    lastFlush: Date = new Date();

    constructor(ingestFn: IngestFunction, id: string, options?: IngestOptions) {
        this.ingestFn = ingestFn;
        this.id = id;
        this.options = options;
    }

    ingest = (events: Array<object> | object) => {
        if (Array.isArray(events)) {
            this.events = this.events.concat(events);
        } else {
            this.events.push(events);
        }

        if (this.events.length >= 1000 || this.lastFlush.getTime() < Date.now() - 1000) {
            // We either have more than 1k events or the last flush was more than 1s ago
            clearTimeout(this.nextFlush);
            this.activeFlush = this.flush();
        } else {
            // Create a timeout so we flush remaining events even if no more come in
            clearTimeout(this.nextFlush);
            this.nextFlush = setTimeout(() => {
                this.activeFlush = this.flush();
            }, 1000);
        }
    };

    flush = async (): Promise<IngestStatus | undefined> => {
        clearTimeout(this.nextFlush);
        await this.activeFlush;

        if (this.events.length === 0) {
            this.lastFlush = new Date(); // we tried
            return;
        }

        const res = await this.ingestFn(this.id, this.events, this.options);
        this.events = [];
        this.lastFlush = new Date();
        return res;
    };
}
