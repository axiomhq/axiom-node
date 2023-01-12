import { Logger } from 'axiom-node';
// import { NuxtPlugin } from '@nuxt/kit';
import { Plugin } from '@nuxt/types';

// const nuxtApp = useNuxtApp()
const logger = new Logger({}, process.env.AXIOM_DATASET || 'test');
nuxtApp.provide('logger', logger)


// export default defineNuxtPlugin(() => {
// return {
//     provide: {
//         logger,
//     }
// }
// })
