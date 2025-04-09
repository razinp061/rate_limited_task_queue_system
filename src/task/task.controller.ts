import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { queryTaskDto } from './dto/query-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const result = await this.taskService.create(createTaskDto);
    return result
  }

  @Get()
  async findAll(@Query() queryDto: queryTaskDto) {
    const result = this.taskService.findAll(queryDto);
    return result;
  }

  @Get('status')
  async groupByStatus() {
    const result = await this.taskService.groupByStatus();
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.taskService.findOne(id)
    return result
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const result = await this.taskService.update(id, updateTaskDto);
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
