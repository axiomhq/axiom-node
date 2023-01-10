import { Logger } from 'axiom-node';

export const log = new Logger({}, process.env.DATASET_NAME || '');
export { reportWebVitals, withAxiom, AxiomRequest, AxiomAPIRequest, AxiomMiddleware, AxiomApiHandler } from './withAxiom'
