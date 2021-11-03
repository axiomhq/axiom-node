import { expect } from 'chai';

import { CloudURL, version } from '../../lib';

const url = process.env.AXIOM_URL || CloudURL;
const token = process.env.AXIOM_TOKEN!;
const orgId = process.env.AXIOM_ORG_ID;

describe('VersionService', () => {
    const client = new version.Service(url, token, orgId);

    describe('get', () => {
        it('should get a version', async () => {
            const version = await client.get();

            expect(version.currentVersion).to.satisfy((version: string) => version.startsWith('v1.'));
        });
    });
});
