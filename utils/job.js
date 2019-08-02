const dbQueries = require('./dbQueries');
const constants = require('../config/constants');

const generateJob = (jobObj, companyName, jobName) => {
    try {
        const job = {
            requisitionId: jobObj.requisitionId.toString(),
            addresses: jobObj.address,
            companyName: companyName,
            description: jobObj.description,
            title: jobObj.title,
            applicationInfo: {
                emails: jobObj.email
            },
            employmentTypes: jobObj.employementTypes,
            incentives: jobObj.incentives,
            promotionValue: jobObj.promotionValue,
            qualifications: jobObj.qualifications,
            jobStartTime: jobObj.jobStartTime,
            jobEndTime: jobObj.jobEndTime,
            // postingPublishTime: jobObj.postingPublishTime,
            postingRegion: jobObj.postingRegion,
            customAttributes: {
                boResidential: { stringValues: jobObj.customAttributes.boResidential, filterable: true },
                IndoorOutdoor: { stringValues: jobObj.customAttributes.IndoorOutdoor, filterable: true },
                FullorParttime: { stringValues: jobObj.customAttributes.FullorParttime, filterable: true },
                jobCompanyName: { stringValues: jobObj.customAttributes.jobCompanyName, filterable: true },
                jobBand: { longValues: jobObj.customAttributes.jobBand, filterable: true },
                jobRank: { longValues: jobObj.customAttributes.jobRank, filterable: true },
                WTdaytime: { stringValues: jobObj.customAttributes.WTdaytime, filterable: true },
                WTevening: { stringValues: jobObj.customAttributes.WTevening, filterable: true },
                WTweekend: { stringValues: jobObj.customAttributes.WTweekend, filterable: true },
                jobSector: { stringValues: jobObj.customAttributes.jobSector, filterable: true },
                jobType: { stringValues: jobObj.customAttributes.jobType, filterable: true },
            },
            processingOptions: { disableStreetAddressResolution: true }
        };
        if (jobName)
            job.name = jobName;
        return job;
    } catch (e) {
        console.log(e);
    }
};

const createJob = async(jobServiceClient, jobData, jobId, queueId) => {
    try {
        const jobObj = JSON.parse(jobData);
        console.log(jobObj);
        const company = await dbQueries.getCompany(jobObj.employerId);
        const companyName = company.googleCompanyId;
        const jobToBeCreated = generateJob(jobObj, companyName);
        console.log(jobToBeCreated);
        const request = {
            parent: `projects/${process.env.googleProjectName}`,
            resource: {
                job: jobToBeCreated,
            },
        };
        const jobCreated = await jobServiceClient.projects.jobs.create(request);
        console.log(`Job created: ${JSON.stringify(jobCreated.data)}`);
        dbQueries.removeQueue(queueId);
        dbQueries.createJob(jobId, jobCreated.data.name, constants.ACTIVE);
    } catch (error) {
        console.error(error);
        console.error(`Got exception while creating job!`);
        dbQueries.updateQueueStatus(queueId, constants.ISSUE);
    }
};

const updateJob = async(jobServiceClient, jobData, jobId, queueId) => {
    try {
        const jobObj = JSON.parse(jobData);
        const job = await dbQueries.getJob(jobId);
        const jobName = job.googleJobId;
        const company = await dbQueries.getCompany(jobObj.employerId);
        const companyName = company.googleCompanyId;
        const jobToBeUpdated = generateJob(jobObj, companyName, jobName);
        const request = {
            name: jobName,
            resource: {
                job: jobToBeUpdated,
            },
        };
        const jobUpdated = await jobServiceClient.projects.jobs.patch(request);
        console.log(`Job updated: ${JSON.stringify(jobUpdated.data)}`);
        dbQueries.updateJob(jobId, jobUpdated.data.name, constants.ACTIVE);
        dbQueries.removeQueue(queueId);
    } catch (e) {
        console.error(e);
        console.error(`Got exception while updating job!`);
        dbQueries.updateQueueStatus(queueId, constants.ISSUE);
    }
};
const deleteJob = async(jobServiceClient, jobId, queueId) => {
    try {
        const job = await dbQueries.getJob(jobId);
        const jobName = job.googleJobId;
        const request = {
            name: jobName,
        };
        await jobServiceClient.projects.jobs.delete(request);
        console.log('Job deleted');
        dbQueries.updateJob(jobId, '', constants.INACTIVE);
        dbQueries.removeQueue(queueId);
    } catch (e) {
        console.error(e);
        console.error('Got exception while deleting job');
        dbQueries.updateQueueStatus(queueId, constants.ISSUE);
    }
};

module.exports = {
    createJob,
    updateJob,
    deleteJob
};