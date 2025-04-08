import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/task/entities/task.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [CronjobService],
})
export class CronjobModule {}
