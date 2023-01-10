import { Logger } from 'axiom-node';
import { Plugin } from '@nuxt/types';

const plugin: Plugin = (_, inject) => {
    const logger = new Logger({}, process.env.AXIOM_DATASET || 'test');
    // Doing something with nuxtApp
    inject('logger', logger);
};

export default plugin;
// export default defineNuxtPlugin(() => {
// return {
//     provide: {
//         logger,
//     }
// }
// })
