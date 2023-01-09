import {NextFetchEvent, NextResponse} from 'next/server'
import {AxiomRequest, withAxiom} from 'axiom-node/dist/adapters/nextjs'

async function middleware(req: AxiomRequest, ev: NextFetchEvent) {
  req.log.info("Hello from middleware", { 'bar': 'baz' });
  return NextResponse.next()
}

export default withAxiom(middleware)