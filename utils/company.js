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
const generateCompany = (companyData, companyName) => {
    const companyObj = JSON.parse(companyData);
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

const createCompany = async(jobServiceClient, companyData, employerId, queueId) => {
    try {
        const companyToBeCreated = generateCompany(companyData);
        const request = {
            parent: `projects/${process.env.googleProjectName}`,
            resource: {
                company: companyToBeCreated
            }
        };
        const companyCreated = await jobServiceClient.projects.companies.create(request);
        console.log(`Company created: ${JSON.stringify(companyCreated.data)}`);
        dbQueries.removeQueue(queueId);
        dbQueries.createCompany(employerId, companyCreated.data.name);
    } catch (err) {
        console.error(err);
        dbQueries.updateQueueStatus(queueId, constants.ISSUE);
    }
};


/**
 * update an company
 */
const updateCompany = async(jobServiceClient, companyData, employerId, queueId) => {
    try {
        const company = await dbQueries.getCompany(employerId);
        const companyName = company.googleCompanyId;
        const companyToBeUpdated = generateCompany(companyData, companyName);
        const request = {
            name: companyName,
            resource: {
                company: companyToBeUpdated
            }
        };
        const companyUpdated = await jobServiceClient.projects.companies.patch(request);
        console.log(`Company updated: ${JSON.stringify(companyUpdated.data)}`);
        dbQueries.removeQueue(queueId);
        dbQueries.updateCompany(employerId, companyUpdated.data.name, constants.ACTIVE);
    } catch (err) {
        console.error(err);
        dbQueries.updateQueueStatus(queueId, constants.ISSUE);
    }
};

const deleteCompany = async(jobServiceClient, employerId, queueId) => {
    try {
        const company = await dbQueries.getCompany(employerId);
        const companyName = company.googleCompanyId;
        const request = {
            name: companyName,
        };
        jobServiceClient.projects.companies.delete(request);
        console.log(`Company deleted`);
        dbQueries.updateCompany(employerId, '', constants.INACTIVE);
        dbQueries.removeQueue(queueId);
    } catch (err) {
        console.error(err);
        dbQueries.updateQueueStatus(queueId, constants.ISSUE);
    }
};
module.exports = {
    listCompanies,
    createCompany,
    updateCompany,
    deleteCompany
};