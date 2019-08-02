const { google } = require('googleapis');

const createAuthCredential = () => {
    return new Promise((resolve, reject) => {
        google.auth.getApplicationDefault((err, authClient) => {
            if (err) {
                console.error('Failed to acquire credentials');
                reject(err);
            }
            if (authClient.createScopedRequired) {
                authClient = authClient.createScoped([
                    'https://www.googleapis.com/auth/jobs',
                ]);
            }
            // Instantiates an authorized client
            resolve(google.jobs({
                version: 'v3',
                auth: authClient
            }));
        });

    });

};


module.exports = createAuthCredential;