import { Injectable } from '@nestjs/common';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisManagerService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    setAdd(key: string, value: string) {
        return this.redis.sadd(key, value)
    }

    setRem(key: string, value: string) {
        return this.redis.srem(key, value)
    }

    setSortedAdd(key: string, score: number, object: object) {
        return this.redis.zadd(key, score, JSON.stringify(object))
    }

    setSortedZScan(key: string, cursor: number, count: number = 20) {
        return this.redis.zscan(key, cursor, 'COUNT', count);
    }

    setSortedZRange(key: string, min: number, max: number, count: number = 20) {
        return this.redis.zrange(key, min, max);
    }

    setSortedZRemByScore(key: string, score: number) {
        return this.redis.zremrangebyscore(key, score, score + 1);
    }

    existsKey(key: string) {
        return this.redis.exists(key);
    }

    hashAdd(key: string, object: object) {
        return this.redis.hset(key, object);
    }

    hashGet(key: string, field: string) {
        return this.redis.hget(key, field);
    }

    hashExists(key: string, field: string) {
        return this.redis.hexists(key, field);
    }

    hashHScan(key: string, cursor: number, count: number = 20) {
        return this.redis.hscan(key, cursor, 'COUNT', count);
    }

    hashDel(key: string, field: string) {
        return this.redis.hdel(key, field);
    }

    delKey(key: string) {
        return this.redis.del(key);
    }

    async createSetSorted(key: string, score: number, object: object, expireTime: number = 0) {
        const data = await this.setSortedAdd(key, score, object)

        if(expireTime > 0) {
            this.redis.expire(key, expireTime);
        }

        return data;
    }

    async createSet(key: string, value: string, expireTime: number = 0) {
        const data = await this.setAdd(key, value)

        if(expireTime > 0) {
            this.redis.expire(key, expireTime);
        }

        return data;
    }

    async getSet(key: string) {
        const data = await this.redis.smembers(key)
        return data;
    }

    async createHash(key: string, object: object, expireTime: number = 0) {
        const data = await this.hashAdd(key, object);

        if(expireTime > 0) {
            this.redis.expire(key, expireTime);
        }

        return data;
    } 

    createKey(key: string, value: string, expireTime: number = 0) {
        if(expireTime > 0) {
            return this.redis.set(key, value, 'EX', expireTime)
        }
        
        this.redis.set(key, value, 'EX', 100)
    }

    getKey(key: string) {
        return this.redis.get(key)
    }
}
