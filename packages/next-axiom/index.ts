import createLogger from 'axiom-js-logger';

export { withAxiom, AxiomRequest, AxiomAPIRequest, AxiomMiddleware, AxiomApiHandler } from './withAxiom'
export { reportWebVitals } from './web-vitals';
 
const log = createLogger({ dataset: process.env.DATASET_NAME || '' });
export { log }
