import Transport from '../logger/src/transport';
import { prettyPrint } from './prettyPrint';

class ConsoleTransport implements Transport {
    constructor(
        public config = {
            prettyPrint: true,
        },
    ) {}

    send(events) {
        events.map((event) => this._print(event));
    }

    _print(ev) {
        // check whether pretty print is disabled
        if (this.config) {
            const hasFields = Object.keys(ev.fields).length > 0;
            let msg = `${ev.level} - ${ev.message}`;
            if (hasFields) {
                msg += ' ' + JSON.stringify(ev.fields);
            }
            console.log(msg);
        } else {
            prettyPrint(ev);
        }
    }
}

export default ConsoleTransport;
