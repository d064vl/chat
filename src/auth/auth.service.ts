import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { UserService } from 'src/user/user.service';
import { RedisManagerService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisManagerService,
    private userService: UserService
    ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('validateUser --->', email, password)
    let user;
    // checko if exist in redis the user
    let userRedis = await this.redisService.getKey(`${email}:${password}`);
    console.log('user redis', userRedis)
    if(!userRedis) {
      user = await this.userService.find({email, password});
    } else {
      user = {
        ...JSON.parse(userRedis),
        isRedis: true
      }

    }

    console.log('validateUser --->', user)
    
    return user;
  }

  async login(user: any) {
    console.log('login --->', user)
    const payload = { email: user.email, id: user.id};

    if(!user.isRedis) {
      // save the user in redis
      await this.redisService.createKey(`${user.email}:${user.password}`, JSON.stringify(user), 1000);
    }

    const chats = await this.redisService.getSet(`${user.email}:chats`);
    console.log('chats --->', chats)
    return {
      access_token: this.jwtService.sign(payload),
      chats
    };
  }
}