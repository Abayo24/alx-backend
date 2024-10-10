import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

// Set up the queue
const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {

  // Enter test mode for Kue before running tests
  beforeEach(() => {
    queue.testMode.enter();
  });

  // Exit test mode after each test and clear the queue
  afterEach(() => {
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('not an array', queue)).to.throw(Error, 'Jobs is not an array');
  });

  it('should create two new jobs in the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 5678 to verify your account',
      }
    ];

    createPushNotificationsJobs(jobs, queue);

    // Check that two jobs have been created
    expect(queue.testMode.jobs.length).to.equal(2);

    // Validate the data of the first job
    expect(queue.testMode.jobs[0].data).to.deep.equal({
      phoneNumber: '4153518780',
      message: 'This is the code 1234 to verify your account',
    });

    // Validate the data of the second job
    expect(queue.testMode.jobs[1].data).to.deep.equal({
      phoneNumber: '4153518781',
      message: 'This is the code 5678 to verify your account',
    });
  });

  it('should log job creation events', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
    ];

    const logSpy = sinon.spy(console, 'log');  // Use sinon to spy on console.log

    createPushNotificationsJobs(jobs, queue);

    // Ensure that the correct log is printed for job creation
    expect(logSpy.calledWithMatch(/Notification job created/)).to.be.true;

    logSpy.restore();  // Restore the original console.log
  });

});
