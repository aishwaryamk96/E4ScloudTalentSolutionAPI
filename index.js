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
        createAuthCredential().then(jobServiceClient =>{
       // to check google key
       //companyUtils.listCompanies(jobServiceClient);
       //to check dbb connection
       data.QueueModel.findAll({
            order: [
                ['queueId', 'DESC']
            ],
            limit: 1
        }).then(function(queue) {
       // console.log(queue)
        queue = queue?queue[0]:[];
        console.log(queue.queueId);
       
       //lambda function
      // queue = event;
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
   });
   })
    } catch (err) {
        console.log(err);
        process.exit();
    }
};
//local testing
processHandler();