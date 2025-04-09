import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/contants/constants';
import { PriorityLabel } from 'src/contants/constants';

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
