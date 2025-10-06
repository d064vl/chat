import { Body, Controller, Post, Get, Query, Param, Delete, Put, UseInterceptors, ClassSerializerInterceptor, Session, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from './../interceptor/serialize.interceptor';
import { TaskDto } from './dto/task.dto';
import { createTaskDto } from './dto/create-task.dto';
import { updateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';

@Controller('tasks')
@Serialize(TaskDto)
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    getTasks(@Req() req) { 
        console.log(req.user)
        if(req.user.userType === 'Manager') {
            return this.tasksService.find({});
        }
        
        return this.tasksService.find({technicianId: req.user.userId});
    }

    @Get('/user/:id')
    getTasksByUser(@Param('id') id: number) {
        return this.tasksService.find({technicianId: id});
    }

    @UseGuards(JwtAuthGuard)
    @Get('/current/')
    getMyTasks(@Req() req) {
        console.log(req.user)
        return this.tasksService.find({technicianId: req.user.userId});
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async create(@Req() req, @Body() body: createTaskDto) {
        console.log('body -> ', body);

        if(req.user.userType !== 'Manager') {
            body.technicianId = req.user.userId;
        }

        console.log('body alter -> ', body, req.user.userType);
        const task =  await this.tasksService.create(body);
        console.log('task -> ', task);
        return task;
    }

    @UseGuards(JwtAuthGuard, AuthGuard)
    @Delete('/:id')
    delete(@Param('id') id: number) {
        console.log('DELETE id = ', id);
        return this.tasksService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    update(@Req() req, @Param('id') id: number, @Body() body: updateTaskDto) {
        console.log('PUT id ? ', id);
        console.log('PUT body', body);
        if(req.user.userType === 'Manager') {
            return this.tasksService.update(id, body, null);
        }
        console.log('body update alter -> ', body, req.user.userType);
        return this.tasksService.update(id, body, req.user.userId);
    }

}
