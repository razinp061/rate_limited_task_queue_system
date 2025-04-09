import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/constants/constants';
import { PriorityLabel } from 'src/constants/constants';

export class CreateTaskDto {
  @IsString()
  @IsOptional()
  type: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(PriorityLabel)
  @IsOptional()
  priority: PriorityLabel;

  @IsOptional()
  scheduleAt?: Date;
}
