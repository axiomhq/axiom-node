
import createLogger from 'axiom-js-logger';

const log = createLogger({ dataset: process.env.DATASET_NAME || '' });

export default log;

// TODO: test if this method would be applicable
// import { Logger as AxiomLogger } from 'axiom-js-logger';
// class Logger extends AxiomLogger {
//     constructor(config: any) {
//         super(config);
//     }
// }
