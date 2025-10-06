import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisManagerService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { NotificationsService } from './../notifications/notifications.service';
import { createUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private repo: Repository<User>,
    private redisService: RedisManagerService,
    private notificationsService: NotificationsService) {}

    async create(body: createUserDto) {
        const user = this.repo.create(body);
        await this.redisService.createSet(`${user.email}:chats`, null);

        return this.repo.save(user);
    }

    find(where: {id?: string, email?: string, password?: string}) {
        return this.repo.find({
            where
        });
    }

    findOneBy(where: {id?: string}) {
        if(!where.id) {
            return null
        } 
        
        return this.repo.findOne({
            where
        });
    }

    async update(id: string, attrs: Partial<User>) {
        const user = await this.repo.findOneBy({id});

        if(!user) {
            throw new NotFoundException("user not found");
        }

        Object.assign(user, attrs);

        return this.repo.save(user);
    }

    async delete(id: string) {
        const user = await this.repo.findOneBy({id});

        if(!user) {
            throw new NotFoundException("user not found");
        }

        return this.repo.remove(user);
    }
}
