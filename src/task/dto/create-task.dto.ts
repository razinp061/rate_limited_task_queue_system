import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsOptional()
  type: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
