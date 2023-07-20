> **Note** Check out [axiom-js](https://github.com/axiomhq/axiom-js), our new cross-platform solution with JavaScript SDKs and libraries.

![axiom-node: The official NodeJS bindings for the Axiom API](.github/images/banner-dark.svg#gh-dark-mode-only)
![axiom-node: The official NodeJS bindings for the Axiom API](.github/images/banner-light.svg#gh-light-mode-only)

<div align="center">

[![Workflow][workflow_badge]][workflow]
[![Latest Release][release_badge]][release]
[![License][license_badge]][license]

</div>

[Axiom](https://axiom.co) unlocks observability at any scale.

-   **Ingest with ease, store without limits:** Axiom’s next-generation datastore enables ingesting petabytes of data with ultimate efficiency. Ship logs from Kubernetes, AWS, Azure, Google Cloud, DigitalOcean, Nomad, and others.
-   **Query everything, all the time:** Whether DevOps, SecOps, or EverythingOps, query all your data no matter its age. No provisioning, no moving data from cold/archive to “hot”, and no worrying about slow queries. All your data, all. the. time.
-   **Powerful dashboards, for continuous observability:** Build dashboards to collect related queries and present information that’s quick and easy to digest for you and your team. Dashboards can be kept private or shared with others, and are the perfect way to bring together data from different sources

For more information check out the [official documentation](https://axiom.co/docs)
and our
[community Discord](https://axiom.co/discord).

## Quickstart

Install using `npm install`:

```shell
npm install @axiomhq/axiom-node
```

If you use the [Axiom CLI](https://github.com/axiomhq/cli), run `eval $(axiom config export -f)` to configure your environment variables.

Otherwise create a personal token in [the Axiom settings](https://app.axiom.co/profile) and export it as `AXIOM_TOKEN`. Set `AXIOM_ORG_ID` to the organization ID from the settings page of the organization you want to access.

You can also configure the client using options passed to the constructor of the Client:

```ts
const client = new Client({
    token: process.env.AXIOM_TOKEN,
    orgId: process.env.AXIOM_ORG_ID,
});
```

Create and use a client like this:

```ts
import { Client } from '@axiomhq/axiom-node';

async function main() {
    const client = new Client();

    await client.ingestEvents('my-dataset', [{ foo: 'bar' }]);

    const res = await client.query(`['my-dataset'] | where foo == 'bar' | limit 100`);
}
```

## Using Axiom transport for Winston

You can use Winston logger to send logs to Axiom. First, install the `winston` and `@axiomhq/axiom-node` packages, then
create an instance of the logger with the AxiomTransport.

```ts
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
        }),
    ],
});
```

### Error, exception and rejection handling

If you want to log `Error`s, we recommend using the
[`winston.format.errors`](https://github.com/winstonjs/logform#errors)
formatter, for example like this:

```ts
import winston from 'winston';
import { WinstonTransport as AxiomTransport } from '@axiomhq/axiom-node';

const { combine, errors, json } = winston.format;

const axiomTransport = new AxiomTransport({ ... });
const logger = winston.createLogger({
  // 8<----snip----
  format: combine(errors({ stack: true }), json()),
  // 8<----snip----
});
```

To automatically log uncaught exceptions and rejections, add the Axiom transport to the
[`exceptionHandlers`](https://github.com/winstonjs/winston#exceptions) and
[`rejectionHandlers`](https://github.com/winstonjs/winston#rejections) like
this:

```ts
import winston from 'winston';
import { WinstonTransport as AxiomTransport } from '@axiomhq/axiom-node';

const axiomTransport = new AxiomTransport({ ... });
const logger = winston.createLogger({
  // 8<----snip----
  transports: [axiomTransport],
  exceptionHandlers: [axiomTransport],
  rejectionHandlers: [axiomTransport],
  // 8<----snip----
});
```

For further examples, see the [examples](examples) directory.

## License

Distributed under the [MIT License](LICENSE).

<!-- Badges -->

[workflow]: https://github.com/axiomhq/axiom-node/actions/workflows/ci.yml
[workflow_badge]: https://img.shields.io/github/actions/workflow/status/axiomhq/axiom-node/ci.yml?branch=main&ghcache=unused
[release]: https://github.com/axiomhq/axiom-node/releases/latest
[release_badge]: https://img.shields.io/github/release/axiomhq/axiom-node.svg?ghcache=unused
[license]: https://opensource.org/licenses/MIT
[license_badge]: https://img.shields.io/github/license/axiomhq/axiom-node.svg?color=blue&ghcache=unused
