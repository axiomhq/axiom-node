import winston from 'winston';
import { WinstonTransport as AxiomTransport } from '@axiomhq/axiom-node';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new AxiomTransport({
            dataset: 'my-dataset', // defaults to process.env.AXIOM_DATASET
            token: 'my-token', // defaults to process.env.AXIOM_TOKEN
            orgId: 'my-org-id', // defaults to process.env.AXIOM_ORG_ID
            onError: (err: Error) => {
                /* ... */
            }, // defaults to console.error
        }),
    ],
});

// Add the console logger if we're not in production
if (process.env.NODE_ENV != 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}

logger.log({
    level: 'info',
    message: 'Logger successfuly setup',
});
