import { log } from 'axiom-node'
import {AppProps} from "next/app";

// export { reportWebVitals } from 'axiom-node/adapters/nextjs'

log.info('Hello from frontend', { foo: 'bar' })

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
