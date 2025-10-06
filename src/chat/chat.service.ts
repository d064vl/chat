import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from 'src/user/entity/user.entity';
import { RedisManagerService } from 'src/redis/redis.service';
import { addMessageDto } from './dto/add-message.dto';
import { createChatDto } from './dto/create-chat.dto';
import { joinChatDto } from './dto/join-chat.dto';
import { removeChatDto } from './dto/remove-chat.dto';
import { removeMessageDto } from './dto/remove-message.dto';
import { getMessageDto } from './dto/get-message.dto';

@Injectable()
export class ChatService {
    constructor(private redisService: RedisManagerService,
    private notificationsService: NotificationsService) {}

    async createChat(body: createChatDto, user: User) {
        const name = body.name || "default";

        const chat = `${uuidv4()}:${name}:${moment().format('DDMMYYYYHHMMss')}`;
        let chatName = '';
        if(user.email) {
            chatName = `${user.email}:chat:${chat}`;
            await this.redisService.createSetSorted(chatName, moment().valueOf(), { start: '' }, 1000);
            await this.redisService.setAdd(`${user.email}:chats`, chatName);
        } else {
            chatName = `${body.id}:chat:${chat}`;
            await this.redisService.createSetSorted(chatName, moment().valueOf(), { start: '' }, 100);
            await this.redisService.createSet(`${body.id}:chats`, chatName, 100);
        }

        return {chat: chatName};
    }

    async removeChat(body: removeChatDto, user: User) {
        const exist = await this.existChat(body.chat);
        console.log('exist -', exist, )
        if(exist) {
            const [owner] = body.chat.split(':');
            console.log('owner', owner)
            if(owner && (owner === user.email || owner === body.id)) {
                await this.redisService.delKey(body.chat);
                if(user.email) {
                    return this.redisService.setRem(`${user.email}:chats`, body.chat);
                } else {
                    return this.redisService.setRem(`${body.id}:chats`, body.chat);
                }
            }

            throw new HttpException({ reason: 'Unable to performe this operation' }, HttpStatus.BAD_REQUEST)
        }

        throw new HttpException({ reason: 'Chat not exist' }, HttpStatus.NOT_FOUND)
    }

    async joinChat(body: joinChatDto, user: User) {
        const exist = await this.existChat(body.chat);
        console.log('exist', exist)
        if(!exist) {
            throw new HttpException({ reason: 'Chat not exist' }, HttpStatus.NOT_FOUND)
        }

        if(user.email) {
            await this.redisService.setAdd(`${user.email}:chats`, body.chat);
        } else {
            await this.redisService.createSet(`${body.id}:chats`, body.chat, 100);
        }

        return {name: body.chat};
    }

    async existChat(chatName: string) {
        const exist = await this.redisService.existsKey(chatName);

        return exist
    }

    async addMessage(body: addMessageDto, user: User) {
        let messageId = '';
        const exist = await this.existChat(body.chat);
        console.log('exist', exist)
        if(exist) {
            const score = moment().valueOf();
            if(user.email) {
                messageId = `${user.email}:${score}:${uuidv4()}`; 
            } else {
                messageId = `${body.id}:${score}:${uuidv4()}`; 
            }
            await this.redisService.setSortedAdd(body.chat, score, { [messageId]: body.message });

            return messageId;
        }
        
        throw new HttpException({ reason: 'Chat not exist' }, HttpStatus.NOT_FOUND)
    }

    async removeMessage(body: removeMessageDto, user: User) {
        const exist = await this.existChat(body.chat);
        console.log('exist', exist)
        if(exist) {

            const [owner, score] = body.messageId.split(':');
            console.log('owner', owner, score)
            if(owner && (owner === user.email || owner === body.id)) {
                return this.redisService.setSortedZRemByScore(body.chat, +score);
            }

            throw new HttpException({ reason: 'Unable to performe this operation' }, HttpStatus.BAD_REQUEST)
        }

        throw new HttpException({ reason: 'Chat not exist' }, HttpStatus.NOT_FOUND)
    }

    async getMessages(body: getMessageDto, user: User) {
        const exist = await this.existChat(body.chat);
        console.log('exist', exist)
        if(exist) {
            const res = await this.redisService.setSortedZRange(body.chat, body.page * (body.limit + 1), (body.page + 1) * body.limit, body.page);
            return res.map(data => JSON.parse(data))
        }

        throw new HttpException({ reason: 'Chat not exist' }, HttpStatus.NOT_FOUND)
    }
}
