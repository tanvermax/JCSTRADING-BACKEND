import { createClient } from 'redis';
import { envVarse } from './env';

export const redisclient = createClient({
    username: envVarse.REDIS_USERNAME,
    password: envVarse.REDIS_PASSWORD,
    socket: {
        host: envVarse.REDIS_HOST,
        port: Number(envVarse.REDIS_PORT)
    }
});


redisclient.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar


export const connectRedis = async ()=>{
    if (!redisclient.isOpen) {
        await redisclient.connect();
        console.log("Redis Conneted")
    }
}
