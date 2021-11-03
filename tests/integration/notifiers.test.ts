import { expect } from 'chai';

import { CloudURL, notifiers } from '../../lib';

const url = process.env.AXIOM_URL || CloudURL;
const token = process.env.AXIOM_TOKEN!;
const orgId = process.env.AXIOM_ORG_ID;

describe('NotifiersService', () => {
    const client = new notifiers.Service(url, token, orgId);

    let notifier: notifiers.Notifier;

    before(async () => {
        notifier = await client.create({
            name: 'Test Notifier',
            type: notifiers.Type.Email,
            properties: {
                to: 'john@example.com',
            },
        });
    });

    after(async () => {
        await client.delete(notifier.id!);
    });

    describe('update', () => {
        it('should update a notifier', async () => {
            const updatedNotifier = await client.update(notifier.id!, {
                name: 'Updated Test Notifier',
                type: notifiers.Type.Email,
                properties: {
                    to: 'fred@example.com',
                },
            });

            expect(updatedNotifier.name).to.equal('Updated Test Notifier');
            expect(updatedNotifier.type).to.equal(notifiers.Type.Email);
            expect(updatedNotifier.properties.to).to.equal('fred@example.com');

            notifier = updatedNotifier;
        });
    });

    describe('get', () => {
        it('should get a notifier', async () => {
            const fetchedNotifier = await client.get(notifier.id!);

            expect(fetchedNotifier.name).to.equal(notifier.name);
            expect(fetchedNotifier.type).to.equal(notifier.type);
            expect(fetchedNotifier.properties.to).to.equal(notifier.properties.to);
        });
    });

    describe('list', () => {
        it('should list notifiers', async () => {
            const notifiers = await client.list();

            expect(notifiers.length).to.be.greaterThan(0);
        });
    });
});
