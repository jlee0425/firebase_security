const {
	loadFirestoreRules,
	initializeTestApp,
	initializeAdminApp,
	clearFirestoreData,
} = require('@firebase/rules-unit-testing');
const { readFileSync } = require('fs');

module.exports.setup = async (auth, data) => {
	const projectId = 'security-rules';
	const app = initializeTestApp({ projectId, auth });

	const db = app.firestore();

	if (data) {
		const admin = initializeAdminApp({ projectId });

		for (const key in data) {
			const ref = admin.firestore().doc(key);
			await ref.set(data[key]);
		}
	}

	await loadFirestoreRules({
		projectId,
		rules: readFileSync('firestore.rules', 'utf-8'),
	});

	return db;
};

module.exports.teardown = async () => {
	Promise.all(firebase.apps().map((app) => app.delete()));
	await clearFirestoreData();
};
