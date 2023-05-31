import { fail } from 'assert';
import { Batch } from '../../lib/batch';

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Batch', () => {
    it('sends events after 1s', async () => {
        const sendFn = jest.fn();

        const batch = new Batch(sendFn, 'my-dataset', { timestampField: 'foo' });
        batch.ingest({ foo: 'bar' });
        batch.ingest({ foo: 'baz' });

        await sleep(500);
        expect(sendFn).toHaveBeenCalledTimes(0);
        await sleep(600);
        expect(sendFn).toHaveBeenCalledTimes(1);
    });

    it('sends events after 1k events', async () => {
        const sendFn = jest.fn();

        const batch = new Batch(sendFn, 'my-dataset', { timestampField: 'foo' });

        let events = [];
        for (let i = 0; i < 1000; i++) {
            batch.ingest({ foo: 'bar' });
        }

        await sleep(100); // just make sure we have enough time
        expect(sendFn).toHaveBeenCalledTimes(1);
    });

    it('sends events after 1s when ingesting one event every 100ms', async () => {
        const sendFn = jest.fn();

        const batch = new Batch(sendFn, 'my-dataset', { timestampField: 'foo' });

        for (let i = 0; i < 10; i++) {
            batch.ingest({ foo: 'bar' });
            await sleep(120);
        }

        await sleep(100); // just make sure we have enough time
        expect(sendFn).toHaveBeenCalledTimes(1);
    });

    it('sends events on flush', async () => {
        const sendFn = jest.fn();

        const batch = new Batch(sendFn, 'my-dataset', { timestampField: 'foo' });

        for (let i = 0; i < 10; i++) {
            batch.ingest({ foo: 'bar' });
        }

        expect(sendFn).toHaveBeenCalledTimes(0);
        await batch.flush();
        expect(sendFn).toHaveBeenCalledTimes(1);
    });
});
