const data = require('./sequlizer');
const Sequelize = require('sequelize');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('UTC');

const getCurrentTime = () => moment().format('YYYY-MM-DD HH:mm:ss');
const updateQueueStatus = (queueId, status,log ="error Message") => {
    data.dbCon.query('UPDATE queue SET status = :status, log = :log WHERE queueId = :queueId', {
        replacements: {
            status: status,
            log: log,
            queueId: queueId
        },
        type: Sequelize.QueryTypes.UPDATE
    }).then(data => {
        console.log(queueId + 'execution completed');
    }).catch(err => {
        console.error(err);
        console.error('error while updating the row in queue');
    });
};
const removeQueue = (queueId) => {
    data.dbCon.query('DELETE from queue where queueId = :queueId', {
        replacements: {
            queueId: queueId
        },
        type: Sequelize.QueryTypes.DELETE
    }).then(data => {
        console.log(queueId + 'execution completed');
    }).catch(err => {
        console.error('error while deleting row from queue');
    });
};
const getCompany = (employerId) => {
    return new Promise((resolve, reject) => {
        data.CompanyModel.findAll({
            where: {
                employerId: employerId
            }
        }).then(company => {
            resolve(company[0]);
        }).catch(err => {
            reject(err);
        });
    });
};
const createCompany = (employerId, googleCompanyId, status) => {
    data.CompanyModel.create({
        employerId: employerId,
        googleCompanyId: googleCompanyId,
        status: status
    }).then(company => {
        console.log('company created' + company);
    }).catch(err => {
        console.error('Not able create a company' + err);
    });
};
const updateCompany = (employerId, googleCompany, status) => {
    data.dbCon.query('UPDATE companies SET status = :status,googleCompanyId =:googleCompanyId, updatedAt =:updatedAt WHERE employerId = :employerId', {
        replacements: {
            status: status,
            googleCompanyId: googleCompany,
            updatedAt: getCurrentTime(),
            employerId: employerId
        },
        type: Sequelize.QueryTypes.UPDATE
    }).then(data => {
        console.log(employerId + 'employee status updated');
    }).catch(err => {
        console.error(err);
        console.error('error while updating companies');
    });
};
const getJob = (jobId) => {
    return new Promise((resolve, reject) => {
        data.JobModel.findAll({
            where: {
                jobId: jobId
            }
        }).then(job => {
            resolve(job[0]);
        }).catch(err => {
            reject(err);
        });
    });
};
const createJob = (jobId, googleJobId, status) => {
    data.JobModel.create({
        jobId: jobId,
        googleJobId: googleJobId,
        status: status
    }).then(job => {
        console.log('job created' + job);
    }).catch(err => {
        console.error('Not able to create a job' + err);
    });
};
const updateJob = (jobId, googleJob, status) => {
    data.dbCon.query('UPDATE jobs SET status = :status, googleJobId = :googleJob, updatedAt =:updatedAt WHERE id = :id', {
        replacements: {
            status: status,
            googleJob: googleJob,
            id: jobId,
            updatedAt: moment()
        },
        type: Sequelize.QueryTypes.UPDATE
    }).then(data => {
        console.log(jobId + 'job status updated');
    }).catch(err => {
        console.error(err);
        console.error('error while updating the job');
    });
};
module.exports = {
    updateQueueStatus,
    updateCompany,
    updateJob,
    createCompany,
    createJob,
    getJob,
    getCompany,
    removeQueue
};