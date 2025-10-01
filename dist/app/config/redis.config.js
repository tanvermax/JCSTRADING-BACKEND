"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisclient = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
exports.redisclient = (0, redis_1.createClient)({
    username: env_1.envVarse.REDIS_USERNAME,
    password: env_1.envVarse.REDIS_PASSWORD,
    socket: {
        host: env_1.envVarse.REDIS_HOST,
        port: Number(env_1.envVarse.REDIS_PORT)
    }
});
exports.redisclient.on('error', err => console.log('Redis Client Error', err));
// await client.connect();
// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.redisclient.isOpen) {
        yield exports.redisclient.connect();
        console.log("Redis Conneted");
    }
});
exports.connectRedis = connectRedis;
