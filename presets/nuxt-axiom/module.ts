// import { resolve } from 'path'
// import { fileURLToPath } from 'url'
// import defu from 'defu'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

export interface ModuleOptions {
    /**
     * Enable Axiom Module
     * @default true
     * @type boolean
     */
    enabled: boolean;
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'axiom-js',
        configKey: 'axiom',
        compatibility: {
            nuxt: '^3.0.0-rc.5 || ^2.16.0',
            bridge: true,
        },
    },
    defaults: {
        enabled: true,
    },
    setup(options, nuxt) {
        if (options.enabled) {
            // Create resolver to resolve relative paths
            const { resolve } = createResolver(import.meta.url);

            //   const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
            //   nuxt.options.build.transpile.push(runtimeDir)
            addPlugin(resolve('./runtime/plugin'));

            //   nuxt.hook('imports:dirs', (dirs) => {
            //     dirs.push(resolve(runtimeDir, 'composables'))
            //   })
        }
    },
});
