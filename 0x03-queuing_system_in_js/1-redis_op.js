import redis from 'redis';

const client  = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected to the client');
});

client.on('error', (err) => {
    console.error('Redis client not connected to the server:', err)
});

const setNewSchool = (schoolName, value) => {
    client.set(schoolName, value, redis.print);
}

const displaySchoolValue = async (schoolName) => {
    try {
        const value = await getAsync(schoolName);
        console.log(value);
      } catch (err) {
        console.error('Error retrieving the key:', err);
      }
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
