import { Module } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RedisManagerService } from 'src/redis/redis.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, NotificationsService, RedisManagerService]
})
export class ChatModule {}
