import redis from 'redis';

const client  = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected to the client');
});

client.on('error', (err) => {
    console.error('Redis client not connected to the server:', err)
});