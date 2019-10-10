const data = require('./utils/sequlizer');
const createAuthCredential = require('./utils/authenticateClient');
const companyUtils = require('./utils/company');
const jobUtils = require('./utils/job');
const COMPANY = 'company';
const JOB = 'job';
const CREATE = 'create';
const UPDATE = 'update';
const DELETE = 'delete';
const processHandler = (event, context) => {
    try {
        createAuthCredential().then(jobServiceClient => {
            // to check google key
        ///    companyUtils.listCompanies(jobServiceClient);
            //to check db connection
            data.QueueModel.findAll({
                 order: [
                     ['queueId', 'DESC']
                 ],
                 limit: 1
             }).then(function(queue) {
            console.log(queue)
            queue = queue?queue[0]:[];

            //lambda function
            //queue = event;
            switch (queue.actionType) {
                case CREATE:
                    if (queue.serviceType === COMPANY) {
                        companyUtils.createCompany(jobServiceClient, queue.payload, queue.actionId, queue.queueId).then((createdCompany) => {
                            console.log(`Company created: ${JSON.stringify(createdCompany.data)}`);
                            return {
                                statusCode: 200,
                                body: JSON.stringify('successull creation of the company'),
                            };
                        }).catch((error) => {
                            console.log(JSON.stringify(error));
                            return {
                                statusCode: 500,
                                body: JSON.stringify('Can not able to create the company'),
                            };
                        });
                    } else if (queue.serviceType === JOB) {
                        jobUtils.createJob(jobServiceClient, queue.payload, queue.actionId, queue.queueId).then((createdJob) => {
                            console.log(`Job created: ${JSON.stringify(createdJob.data)}`);
                            return {
                                statusCode: 200,
                                body: JSON.stringify('successull creation of the job'),
                            };
                        }).catch((error) => {
                            console.log(JSON.stringify(error));
                            return {
                                statusCode: 500,
                                body: JSON.stringify('Can not able to create the job'),
                            };
                        });
                    }
                    break;
                case UPDATE:
                    if (queue.serviceType === COMPANY) {
                        companyUtils.updateCompany(jobServiceClient, queue.payload, queue.actionId, queue.queueId).then((updatedCompany) => {
                            console.log(`Company updated: ${JSON.stringify(updatedCompany.data)}`);
                            return {
                                statusCode: 200,
                                body: JSON.stringify('successull updation of company'),
                            };
                        }).catch((error) => {
                            console.log(JSON.stringify(error));
                            return {
                                statusCode: 500,
                                body: JSON.stringify('Can not able to update the company'),
                            };
                        });
                    } else if (queue.serviceType === JOB) {
                        jobUtils.updateJob(jobServiceClient, queue.payload, queue.actionId, queue.queueId).then((updatedJob) => {
                            console.log(`Job updated: ${JSON.stringify(updatedJob.data)}`);
                            return {
                                statusCode: 200,
                                body: JSON.stringify('successull updation of job'),
                            };
                        }).catch((error) => {
                            console.log(JSON.stringify(error));
                            return {
                                statusCode: 500,
                                body: JSON.stringify('Can not able to update the job'),
                            };
                        });
                    }
                    break;
                case DELETE:
                    if (queue.serviceType === COMPANY) {
                        companyUtils.deleteCompany(jobServiceClient, queue.actionId, queue.queueId).then((companyDeleted) => {
                            return {
                                statusCode: 200,
                                body: JSON.stringify('successull deletion of company'),
                            };
                        }).catch((error) => {
                            console.log(JSON.stringify(error));
                            return {
                                statusCode: 500,
                                body: JSON.stringify('Can not able to delete the company'),
                            };
                        });
                    } else if (queue.serviceType === JOB) {
                        jobUtils.deleteJob(jobServiceClient, queue.actionId, queue.queueId).then((jobDeleted) => {
                            return {
                                statusCode: 200,
                                body: JSON.stringify('successull deletion of job'),
                            };
                        }).catch((error) => {
                            console.log(JSON.stringify(error));
                            return {
                                statusCode: 500,
                                body: JSON.stringify('Can not able to delete job'),
                            };
                        });
                    }
                    break;
                default:
                    return {
                        statusCode: 500,
                        body: JSON.stringify('Can not found the proper action type'),
                    };                    
                    break;
            }
        });
    });
    } catch (err) {
        console.log(err);
        process.exit();
    }
};
//local testing
processHandler();