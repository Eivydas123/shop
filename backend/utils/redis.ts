import redis from "redis";

import { promisify } from "util";

const client = redis.createClient();

client.on("ready", () => console.log("connected to redis"));
client.on("error", (err: object) => console.log(err));
client.on("SIGINT", () => client.quit());

export const redisGet: any = promisify(client.get).bind(client);
export const redisSet: any = promisify(client.set).bind(client);
export const redisDel: any = promisify(client.del).bind(client);
