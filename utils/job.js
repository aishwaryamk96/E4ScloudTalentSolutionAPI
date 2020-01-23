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
            processingOptions: { disableStreetAddressResolution: true }
        };
        const customAttributes = {
            boResidential : { stringValues: jobObj.customAttributes.boResidential, filterable: true },
            IndoorOutdoor : { stringValues: jobObj.customAttributes.IndoorOutdoor, filterable: true },
            FullorParttime : { stringValues: jobObj.customAttributes.FullorParttime, filterable: true },
            jobCompanyName : { stringValues: jobObj.customAttributes.jobCompanyName, filterable: true },
            jobBand : { longValues: jobObj.customAttributes.jobBand, filterable: true },
            jobRank : { longValues: jobObj.customAttributes.jobRank, filterable: true }
        };
        if(jobObj.customAttributes.WTdaytime)
            customAttributes.WTdaytime = { stringValues: jobObj.customAttributes.WTdaytime, filterable: true };
        if(jobObj.customAttributes.WTevening)
            customAttributes.WTevening = { stringValues: jobObj.customAttributes.WTevening, filterable: true };
        if(jobObj.customAttributes.WTweekend)
            customAttributes.WTweekend = { stringValues: jobObj.customAttributes.WTweekend, filterable: true };
        if(jobObj.customAttributes.jobSector)
            customAttributes.jobSector = { stringValues: jobObj.customAttributes.jobSector, filterable: true };
        if(jobObj.customAttributes.jobType)
            customAttributes.jobType= { stringValues: jobObj.customAttributes.jobType, filterable: true };
        if(jobObj.customAttributes.internType)
            customAttributes.internType= { stringValues: jobObj.customAttributes.internType, filterable: true };
        if(jobObj.customAttributes.deadlineDate)
            customAttributes.deadlineDate= { stringValues: jobObj.customAttributes.deadlineDate, filterable: true };

        job.customAttributes = customAttributes;
        if (jobName)
            job.name = jobName;
        return job;
    } catch (e) {
        console.log(e);
    }
};

const createJob = (jobServiceClient, jobData, jobId, queueId) => {
    return new Promise((resolve, reject) => {
        const jobObj = JSON.parse(jobData);
        dbQueries.getCompany(jobObj.employerId).then(company => {
            const companyName = company.googleCompanyId;
            const jobToBeCreated = generateJob(jobObj, companyName);
            const request = {
                parent: `projects/${process.env.googleProjectName}`,
                resource: {
                    job: jobToBeCreated,
                },
            };
            jobServiceClient.projects.jobs.create(request).then((jobCreated) => {
                dbQueries.removeQueue(queueId);
                dbQueries.createJob(jobId, jobCreated.data.name, constants.ACTIVE);
                resolve(jobCreated);
            }).catch((error) => {
                dbQueries.updateQueueStatus(queueId, constants.ISSUE);
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        })
    });
};

const updateJob = (jobServiceClient, jobData, jobId, queueId) => {
    return new Promise((resolve, reject) => {
        const jobObj = JSON.parse(jobData);
        dbQueries.getJob(jobId).then(job => {
            if (!job) {
                createJob(jobServiceClient, jobData, jobId, queueId);
                return resolve("job needs to create");
            }
            const jobName = job.googleJobId;
            dbQueries.getCompany(jobObj.employerId).then(company => {
                const companyName = company.googleCompanyId;
                const jobToBeUpdated = generateJob(jobObj, companyName, jobName);
                const request = {
                    name: jobName,
                    resource: {
                        job: jobToBeUpdated,
                    },
                };
                jobServiceClient.projects.jobs.patch(request).then((jobUpdated) => {
                    dbQueries.removeQueue(queueId);
                    dbQueries.updateJob(jobId, jobUpdated.data.name, constants.ACTIVE);
                    resolve(jobUpdated);
                }).catch((error) => {
                    dbQueries.updateQueueStatus(queueId, constants.ISSUE);
                    reject(error);
                });
            });
        });
    });
};
const deleteJob = (jobServiceClient, jobId, queueId) => {
    return new Promise((resolve, reject) => {
        dbQueries.getJob(jobId).then(job => {
            if (!job)
                reject("google job Id is not there to delete the job");
            const jobName = job.googleJobId;
            const request = {
                name: jobName,
            };
            jobServiceClient.projects.jobs.delete(request).then((jobDeleted) => {
                dbQueries.removeQueue(queueId);
                dbQueries.updateJob(jobId, '', constants.INACTIVE);
                resolve("job deleted");
            }).catch((error) => {
                dbQueries.updateQueueStatus(queueId, constants.ISSUE);
                reject(error);
            });
        });
    });
};

module.exports = {
    createJob,
    updateJob,
    deleteJob
};