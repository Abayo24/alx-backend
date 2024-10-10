export default function createPushNotificationsJobs(jobs, queue) {
    // Check if jobs is an array
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    // Iterate over the jobs array
    jobs.forEach((jobData) => {
        const job = queue.create('push_notification_code_3', jobData)
            .save((err) => {
                if (!err) {
                    console.log(`Notification job created: ${job.id}`);
                }
            });

        // Listen for job completion
        job.on('complete', () => {
            console.log(`Notification job ${job.id} completed`);
        });

        // Listen for job failure
        job.on('failed', (errorMessage) => {
            console.log(`Notification job ${job.id} failed: ${errorMessage}`);
        });

        // Listen for job progress
        job.on('progress', (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`);
        });
    });
}
