"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisDel = exports.redisSet = exports.redisGet = void 0;
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const client = redis_1.default.createClient();
client.on("ready", () => console.log("connected to redis"));
client.on("error", (err) => console.log(err));
client.on("SIGINT", () => client.quit());
exports.redisGet = util_1.promisify(client.get).bind(client);
exports.redisSet = util_1.promisify(client.set).bind(client);
exports.redisDel = util_1.promisify(client.del).bind(client);
