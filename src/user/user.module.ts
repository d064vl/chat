import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RedisManagerService } from 'src/redis/redis.service';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, NotificationsService, RedisManagerService],
  exports: [UserService]
})
export class UserModule {}
