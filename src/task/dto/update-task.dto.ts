import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsNumber()
  @Min(0)
  @Max(3)
  @IsOptional()
  attempts?: number;

  @IsString()
  @IsOptional()
  errorMessage?: string;
}
