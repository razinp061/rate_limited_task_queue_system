import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model, UpdateQuery } from 'mongoose';
import { Task, TaskStatus } from 'src/task/entities/task.entity';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);
  constructor(@InjectModel(Task.name) private taskMdl: Model<Task>) {}
  @Cron('0 * * * * *')
  async handleCron() {
    const limit = 5;
    const pendingTasks = await this.taskMdl
      .find({ status: TaskStatus.PENDING })
      .limit(limit);

    for (const task of pendingTasks) {
      const lockedTask = await this.taskMdl.findOneAndUpdate(
        { _id: task._id, status: TaskStatus.PENDING },
        { $set: { status: TaskStatus.PROCESSING, updatedAt: new Date() } },
        { new: true },
      );
      console.log(lockedTask)

      if (!lockedTask) continue; 

      try {
        await new Promise((res) => setTimeout(res, 2000));

        if (Math.random() < 0.3) {
          console.log(Math.random());
          throw new Error('Simulated task failure');
        }

        await this.taskMdl.findByIdAndUpdate(task._id, {
          $set: {
            status: TaskStatus.COMPLETED,
            updatedAt: new Date(),
          },
        });

        this.logger.log(` Task ${task._id.toString()} completed`);
      } catch (err) {
        let message = 'Unknown error';
        if (err instanceof Error) {
          message = err.message;
        }

        const attempts = (task.attempts ?? 0) + 1;
        const maxAttempts = 3;

        const update: UpdateQuery<Task> = {
          $set: {
            updatedAt: new Date(),
            errorMessage: message,
          },
          $inc: { attempts: 1 },
        };

        if (attempts >= maxAttempts) {
          update.$set!.status = TaskStatus.FAILED;
        } else {
          update.$set!.status = TaskStatus.PENDING;
        }

        await this.taskMdl.findByIdAndUpdate(task._id, update);

        this.logger.warn(`Task ${task._id.toString()} failed: ${message}`);
      }
    }

    this.logger.debug(`Processed up to ${pendingTasks.length} tasks`);
  }
}
