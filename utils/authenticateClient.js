const { google } = require('googleapis');

const createAuthCredential = () => {
    return new Promise((resolve, reject) => {
        const scope = ['https://www.googleapis.com/auth/jobs'];
        credentials =  JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIAL);
        const jwtClient = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            scope,
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(google.jobs({
                version: 'v3',
                auth:jwtClient,
                
            }));
            });

        });

    };
    module.exports = createAuthCredential;