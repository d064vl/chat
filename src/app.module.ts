import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';
import { RedisManagerService } from './redis/redis.service';


let DBConfig;
if(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'local') {
  DBConfig =  {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'sqlite',
      database: config.get<string>('DB_NAME'),
      entities: [Task, User],
      synchronize: true,
    })
  }
} else {
  DBConfig = {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'mysql',
      host: process.env.DOCKER === 'true' ? 'mydb' : 'localhost', 
      port: +config.get<string>('DB_PORT'), 
      username: config.get<string>('MYSQL_USER'),
      password: config.get<string>('MYSQL_PASSWORD'),
      database: config.get<string>('DB_NAME'),
      entities: [Task, User],
      synchronize: true,
    })
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TasksModule,
    TypeOrmModule.forRootAsync(DBConfig),
    AuthModule,
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL
      }
    }),
    ChatModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // validator
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    RedisManagerService
  ],
})
export class AppModule {}
