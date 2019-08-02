const data = require('./utils/sequlizer');
const createAuthCredential = require('./utils/authenticateClient');
const companyUtils = require('./utils/company');
const jobUtils = require('./utils/job');
const COMPANY = 'company';
const JOB = 'job';
const CREATE = 'create';
const UPDATE = 'update';
const DELETE = 'delete';

const processHandler = async() => {
    try {
        const jobServiceClient = await createAuthCredential();
        //companyUtils.listCompanies(jobServiceClient);
        let queue = await data.QueueModel.findAll({
            order: [
                ['queueId', 'ASC']
            ],
            limit: 1
        });
        queue = queue[0];
        console.log(queue);
        switch (queue.actionType) {
            case CREATE:
                if (queue.serviceType === COMPANY)
                    companyUtils.createCompany(jobServiceClient, queue.payload, queue.actionId, queue.queueId);
                else if (queue.serviceType === JOB)
                    jobUtils.createJob(jobServiceClient, queue.payload, queue.actionId, queue.queueId);
                break;
            case UPDATE:
                if (queue.serviceType === COMPANY)
                    companyUtils.updateCompany(jobServiceClient, queue.payload, queue.actionId, queue.queueId);
                else if (queue.serviceType === JOB)
                    jobUtils.updateJob(jobServiceClient, queue.payload, queue.actionId, queue.queueId);
                break;
            case DELETE:
                if (queue.serviceType === COMPANY)
                    companyUtils.deleteCompany(jobServiceClient, queue.actionId, queue.queueId);
                else if (queue.serviceType === JOB)
                    jobUtils.deleteJob(jobServiceClient, queue.actionId, queue.queueId);
                break;
        }
    } catch (err) {
        process.exit();
    }
};
processHandler();