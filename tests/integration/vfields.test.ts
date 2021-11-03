import { expect } from 'chai';

import { CloudURL, datasets, vfields } from '../../lib';

const datasetSuffix = process.env.AXIOM_DATASET_SUFFIX || 'local';
const url = process.env.AXIOM_URL || CloudURL;
const token = process.env.AXIOM_TOKEN!;
const orgId = process.env.AXIOM_ORG_ID;

describe('VirtualFieldsService', () => {
    const datasetName = `test-axiom-node-monitors-${datasetSuffix}`;
    const datasetsClient = new datasets.Service(url, token, orgId);
    const client = new vfields.Service(url, token, orgId);

    let dataset: datasets.Dataset;
    let vfield: vfields.VirtualField;

    before(async () => {
        dataset = await datasetsClient.create({
            name: datasetName,
            description: 'This is a test dataset for monitors integration tests.',
        });

        vfield = await client.create({
            dataset: dataset.id.toString(),
            name: 'status_failed',
            description: 'Failed Requests',
            expression: 'response > 399',
        });
    });

    after(async () => {
        await client.delete(vfield.id!);

        await datasetsClient.delete(datasetName);
    });

    describe('update', () => {
        it('should update a vfield', async () => {
            const updatedVirtualField = await client.update(vfield.id!, {
                dataset: dataset.id.toString(),
                name: 'status_failed',
                description: 'Updated Failed Requests',
                expression: 'response >= 400',
            });

            expect(updatedVirtualField.description).to.equal('Updated Failed Requests');

            vfield = updatedVirtualField;
        });
    });

    describe('get', () => {
        it('should get a vfield', async () => {
            const fetchedVirtualField = await client.get(vfield.id!);

            expect(fetchedVirtualField.name).to.equal(vfield.name);
        });
    });

    describe('list', () => {
        it('should list vfields', async () => {
            const vfields = await client.list({
                dataset: dataset.id.toString(),
            });

            expect(vfields.length).to.be.greaterThan(0);
        });
    });
});
