import { Body, Controller, Post, Get, Query, Param, Delete, Put, UseInterceptors, ClassSerializerInterceptor, Session, UseGuards, Req, UseFilters } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Currentuser } from './../decorators/currentuser.decorator';
import { User } from 'src/user/entity/user.entity';
import { OptionalJwtAuthGuard } from 'src/auth/jwt-optional-auth.guard';
import { addMessageDto } from './dto/add-message.dto';
import { createChatDto } from './dto/create-chat.dto';
import { joinChatDto } from './dto/join-chat.dto';
import { removeChatDto } from './dto/remove-chat.dto';
import { getMessageDto } from './dto/get-message.dto';
import { removeMessageDto } from './dto/remove-message.dto';

@Controller('chats')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('/')
    @UseGuards(OptionalJwtAuthGuard)
    async create(@Body() body: createChatDto, @Currentuser() user: User) {
        console.log('user -> ', user);

        return this.chatService.createChat(body, user);
    }

    @Post('/message')
    @UseGuards(OptionalJwtAuthGuard)
    async addMessage(@Body() body: addMessageDto, @Currentuser() user: User) {
        console.log('user -> ', user, body);

        const message = await this.chatService.addMessage(body, user);

        return {message};
    }

    @Post('/join')
    @UseGuards(OptionalJwtAuthGuard)
    async joinChat(@Body() body: joinChatDto, @Currentuser() user: User) {
        console.log('user -> ', user);

        return this.chatService.joinChat(body, user);
    }

    @Delete('/')
    @UseGuards(OptionalJwtAuthGuard)
    async removeChat(@Body() body: removeChatDto, @Currentuser() user: User) {
        console.log('user -> ', user);

        const chat = await this.chatService.removeChat(body, user);

        return {chat};
    }

    @Delete('/message')
    @UseGuards(OptionalJwtAuthGuard)
    async removeMessage(@Body() body: removeMessageDto, @Currentuser() user: User) {
        console.log('user -> ', user);

        const message = await this.chatService.removeMessage(body, user);

        return {message};
    }

    @Get('/message')
    @UseGuards(OptionalJwtAuthGuard)
    async getMessages(@Query() query: getMessageDto, @Currentuser() user: User) {
        console.log('user -> ', user, query);

        return this.chatService.getMessages(query, user);
    }
}
