const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { setup, teardown } = require('./helpers');

// bug report: http://localhost:8080/emulator/v1/projects/<project-ID>:ruleCoverage.html

const mockUser = {
	uid: 'bob',
};

const mockData = {
	'users/bob': {
		roels: ['admin'],
	},
	'posts/abc': {
		content: 'hello world',
		uid: 'alice',
		createdAt: null,
		published: false,
	},
};

describe('Database rules', () => {
	let db;

	beforeAll(async () => {
		db = await setup(mockUser, mockData);
	});

	afterAll(async () => {
		await teardown();
	});

	test('deny when reading an unauthorized collection', async () => {
		const ref = db.collection('secret-stuff');

		expect(await assertFails(ref.get()));
	});

	test('allow admin to read unpublished posts', async () => {
		const ref = db.doc('posts/abc');

		expect(await assertSucceeds(ref.get()));
	});

	test('allow admin to update posts of other users', async () => {
		const ref = db.doc('posts/abc');

		expect(await assertSucceeds(ref.update({ published: true })));
	});
});
