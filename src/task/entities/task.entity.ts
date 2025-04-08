import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
@Schema({ timestamps: true })
export class Task {
  @Prop({ enum: ['send-email', 'process-file'] }) type: string;
  @Prop({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;
  @Prop({ default: 0, min: 0, max: 0 }) attempts: number;
  @Prop() errorMessage: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
