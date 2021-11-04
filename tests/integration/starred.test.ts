import { expect } from 'chai';

import { CloudURL, datasets, starred } from '../../lib';

const datasetSuffix = process.env.AXIOM_DATASET_SUFFIX || 'local';
const url = process.env.AXIOM_URL || CloudURL;
const token = process.env.AXIOM_TOKEN!;
const orgId = process.env.AXIOM_ORG_ID;

describe('StarredQueriesService', () => {
    const datasetName = `test-axiom-node-starred-queries-${datasetSuffix}`;
    const datasetsClient = new datasets.Service(url, token, orgId);
    const client = new starred.Service(url, token, orgId);

    let dataset: datasets.Dataset;
    let query: starred.StarredQuery;

    before(async () => {
        dataset = await datasetsClient.create({
            name: datasetName,
            description: 'This is a test dataset for starred queries integration tests.',
        });

        query = await client.create({
            name: 'Test Query',
            kind: starred.QueryKind.Stream,
            dataset: dataset.id.toString(),
        });
    });

    after(async () => {
        await client.delete(query.id!);

        await datasetsClient.delete(datasetName);
    });

    describe('update', () => {
        it('should update a query', async () => {
            const updatedQuery = await client.update(query.id!, {
                name: 'Updated Test Query',
                kind: starred.QueryKind.Stream,
                dataset: dataset.id.toString(),
            });

            expect(updatedQuery.name).to.equal('Updated Test Query');

            query = updatedQuery;
        });
    });

    // describe('get', () => {
    //     it('should get a query', async () => {
    //         const fetchedQuery = await client.get(query.id!);

    //         expect(fetchedQuery.name).to.equal(query.name);
    //     });
    // });

    // describe('list', () => {
    //     it('should list starred', async () => {
    //         const starred = await client.list({
    //             kind: QueryKind.Analytics,
    //         });

    //         expect(starred.length).to.be.greaterThan(0);
    //     });
    // });
});
