import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PriorityValue, TaskStatus } from 'src/constants/constants';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Task } from './entities/task.entity';
import { queryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskMdl: Model<Task>) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      const priorityNumber = PriorityValue[createTaskDto.priority];

      const task = await this.taskMdl.create({
        ...createTaskDto,
        priority: priorityNumber,
      });
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

  async findAll(req: queryTaskDto): Promise<{
    data: Task[];
    page: number;
    limit: number;
    totalPages: number;
    totalElements: number;
  }> {
    try {
      let { page, limit } = req;
      page = page || 1;
      limit = limit || 100
      const skip = (page - 1) * limit;
      const query = this.taskMdl.find(this._addFilters(req));
      const totalElements = await this.taskMdl.countDocuments(query).exec();
      const totalPages = Math.ceil(totalElements / limit);
      const tasks = await query.skip(skip).limit(limit).exec();

      return { data: tasks, page, limit, totalPages, totalElements };
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

  async findOne(id: string) {
    try {
      const data = await this.taskMdl.findById(id);

      if (!data) {
        throw new NotFoundException('Task not found')
      }
      return {
        message: 'Retrieved task detail',
        data,
      };
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

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const updatedTask = await this.taskMdl.findByIdAndUpdate(
        id,
        updateTaskDto,
        { new: true },
      );
      if (!updatedTask) {
        throw new NotFoundException('Task not found')
      }
      return { message: 'Task updated successfully', data: updatedTask}
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

  async remove(id: string) {
    try {
      const result = await this.taskMdl.findByIdAndDelete(id);
      return { message: 'Task deleted successfully'}
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

  _addFilters(req: queryTaskDto) {
    const query: FilterQuery<Task> = {};
    if (req.type) {
      query.type = { $regex: new RegExp(req.type, 'i') };
    }
    if (req.status) {
      query.status = { $regex: new RegExp(req.status, 'i') };
    }
    return query;
  }
}
