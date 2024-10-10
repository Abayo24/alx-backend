const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const Queue = require('kue');

const app = express();
const port = 1245;

// Redis client
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Kue queue
const queue = Queue();

// Application state
let availableSeats = 50;
let reservationEnabled = true;

// Redis functions
const reserveSeat = async () => {
  const currentAvailableSeats = await getCurrentAvailableSeats();
  if (currentAvailableSeats > 0) {
    await setAsync('available_seats', currentAvailableSeats - 1);
    return true;
  }
  return false;
};

const getCurrentAvailableSeats = async () => {
  const seats = await getAsync('available_seats');
  return seats || 0;
};

// Routes
app.get('/available_seats', async (req, res) => {
  const currentAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: currentAvailableSeats });
});

app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat', {}).save();
  res.json({ status: 'Reservation in process' });
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  await queue.process('reserve_seat', async (job, done) => {
    try {
      const success = await reserveSeat();
      if (!success) {
        throw new Error('Not enough seats available');
      }

      console.log('Seat reservation job', job.id, 'completed');
      done();
    } catch (error) {
      console.error('Seat reservation job', job.id, 'failed:', error.message);
      done(error);
    }

    const currentAvailableSeats = await getCurrentAvailableSeats();
    if (currentAvailableSeats === 0) {
      reservationEnabled = false;
    }
  });
});

// Initialize available seats
(async () => {
  await setAsync('available_seats', availableSeats);
})();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
