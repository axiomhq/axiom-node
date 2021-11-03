import { expect } from 'chai';

import { CloudURL, users } from '../../lib';

const url = process.env.AXIOM_URL || CloudURL;
const token = process.env.AXIOM_TOKEN!;
const orgId = process.env.AXIOM_ORG_ID;

describe('UsersService', () => {
    const client = new users.Service(url, token, orgId);

    let user: users.User;

    before(async () => {
        user = await client.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: users.Role.User,
        });
    });

    after(async () => {
        await client.delete(user.id!);
    });

    describe('get', () => {
        it('should get a user', async () => {
            const fetchedUser = await client.get(user.id!);

            expect(fetchedUser.name).to.equal(user.name);
        });
    });

    describe('list', () => {
        it('should list users', async () => {
            const users = await client.list();

            expect(users.length).to.be.greaterThan(0);
        });
    });
});
