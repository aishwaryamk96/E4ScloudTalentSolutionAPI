const dbQueries = require('./dbQueries');
const constants = require('../config/constants');


/**
 * list the companies
 */
const listCompanies = async(jobServiceClient) => {
    try {
        const request = {
            parent: `projects/${process.env.googleProjectName}`,
        };
        // Lists companies
        jobServiceClient.projects.companies.list(request, (err, result) => {
            if (err) {
                console.error(`Failed to retrieve companies! ${err}`);
            }
            console.log(`Request ID: ${result.data.metadata.requestId}`);
            const companies = result.data.companies || [];
            if (companies.length) {
                console.log('Companies:');
                companies.forEach(company => console.log(company.name));
            } else {
                console.log(`No companies found.`);
            }
        });
    } catch (error) {
        console.error(error);
    }
};
/**
 * generat an comapny
 */
const generateCompany = (companyObj, companyName) => {
    ///const companyObj = JSON.parse(companyData);
    const company = {
        displayName: companyObj.displayName,
        externalId: companyObj.externalId.toString(),
        headquartersAddress: companyObj.headquartersAddress,
        websiteUri: companyObj.websiteUrl,
        imageUri: companyObj.imageUrl,
        careerSiteUri: companyObj.careerSiteUrl,
        keywordSearchableJobCustomAttributes: companyObj.keywordSearchableJobCustomAttributes,
        size: companyObj.size
    };
    if (companyName)
        company.name = companyName;
    return company;
};

const createCompany = (jobServiceClient, companyData, employerId, queueId) => {
    return new Promise((resolve, reject) => {
        const companyToBeCreated = generateCompany(companyData);
        const request = {
            parent: `projects/${process.env.googleProjectName}`,
            resource: {
                company: companyToBeCreated
            }
        };
        jobServiceClient.projects.companies.create(request).then((companyCreated) => {
            dbQueries.removeQueue(queueId);
            dbQueries.createCompany(employerId, companyCreated.data.name);
            resolve(companyCreated);
        }).catch((error) => {
            dbQueries.updateQueueStatus(queueId, constants.ISSUE);
            reject(error);
        });
    });
};


/**
 * update an company
 */
const updateCompany = (jobServiceClient, companyData, employerId, queueId) => {
    return new Promise((resolve, reject) => {
        dbQueries.getCompany(employerId).then(company => {
            if (!company)
                return createCompany(jobServiceClient, companyData, employerId, queueId);
            const companyName = company.googleCompanyId;
            const companyToBeUpdated = generateCompany(companyData, companyName);
            const request = {
                name: companyName,
                resource: {
                    company: companyToBeUpdated
                }
            };
            jobServiceClient.projects.companies.patch(request).then((companyUpdated) => {
                dbQueries.removeQueue(queueId);
                dbQueries.updateCompany(employerId, companyUpdated.data.name, constants.ACTIVE);
                resolve(companyUpdated);
            }).catch((error) => {
                dbQueries.updateQueueStatus(queueId, constants.ISSUE);
                reject(error);
            });
        });
    });
};

const deleteCompany = (jobServiceClient, employerId, queueId) => {
    return new Promise((resolve, reject) => {
        dbQueries.getCompany(employerId).then(company => {
            if (!company)
                reject("google company Id is not there");
            const companyName = company.googleCompanyId;
            const request = {
                name: companyName,
            };
            jobServiceClient.projects.companies.delete(request).then((companyDeleted) => {
                dbQueries.removeQueue(queueId);
                dbQueries.updateCompany(employerId, '', constants.INACTIVE);
                resolve("company deleted");
            }).catch((error) => {
                dbQueries.updateQueueStatus(queueId, constants.ISSUE);
                reject(error);
            });
        });

    });
};
module.exports = {
    listCompanies,
    createCompany,
    updateCompany,
    deleteCompany
};