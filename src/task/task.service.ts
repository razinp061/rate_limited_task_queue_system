import { HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskMdl: Model<Task>) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = await this.taskMdl.create(createTaskDto);
      return { message: 'Task added successfully', data: task };
    } catch (error) {
      const { status, message } = error as {
        status?: number;
        message?: string;
      };
      throw new HttpException(
        message || 'Internal server error',
        status || 500,
      );
    }
  }

  async groupByStatus() {
    try {
      const [pending, processing, completed, failed] = await Promise.all([
        this.taskMdl.countDocuments({ status: TaskStatus.PENDING }),
        this.taskMdl.countDocuments({ status: TaskStatus.PROCESSING }),
        this.taskMdl.countDocuments({ status: TaskStatus.COMPLETED }),
        this.taskMdl.countDocuments({ status: TaskStatus.FAILED }),
      ]);
      return { pending, processing, completed, failed };
    } catch (error) {
      const { status, message } = error as {
        status?: number;
        message?: string;
      };
      throw new HttpException(
        message || 'Internal server error',
        status || 500,
      );
    }
  }

  findAll() {
    return `This action returns all task`;
  }

  async findOne(id: string) {
    try {
      const data = await this.taskMdl.findById(id)
      return {
        message: 'Retrieved task detail',
        data
      }
    } catch (error) {
      console.log(error)
      const { status, message } = error as {
        status?: number;
        message?: string;
      };
      throw new HttpException(
        message || 'Internal server error',
        status || 500,
      );
    }
  }


  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
