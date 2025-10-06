import { Body, Controller, Post, Get, Query, Param, Delete, Put, UseInterceptors, ClassSerializerInterceptor, Session, UseGuards, Req, UseFilters } from '@nestjs/common';
import { Serialize } from './../interceptor/serialize.interceptor';
import { createUserDto } from './dto/create-user.dto';
import { userDto } from './dto/user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { updateUserDto } from './dto/update-user.dto';
import { AuthIAMGuard } from 'src/guards/authIAM.guard';

@Controller('users')
@Serialize(userDto)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    getusers(@Req() req) { 
        console.log(req.user)
        return this.userService.find({});
    }

    @Get('/:id')
    getUserByuuid(@Param('id') id: string) {
        return this.userService.find({id});
    }

    @Post('/')
    async create(@Req() req, @Body() body: createUserDto) {
        console.log('body -> ', body);

        console.log('body alter -> ', body);
        const user =  await this.userService.create(body);
        console.log('user -> ', user);
        return user;
    }

    @UseGuards(JwtAuthGuard, AuthIAMGuard)
    @Delete('/:id')
    delete(@Param('id') id: string) {
        console.log('DELETE id = ', id);
        return this.userService.delete(id);
    }

    @UseGuards(JwtAuthGuard, AuthIAMGuard)
    @Put('/:id')
    update(@Req() req, @Param('id') id: string, @Body() body: updateUserDto) {
        console.log('PUT id ? ', id);
        console.log('PUT body', body);
        console.log('body update alter -> ', body);
        return this.userService.update(id, body);
    }

}
