import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatus } from 'src/constants/constants';

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
  @Prop({ enum: [1, 2, 3, 4], default: 1 }) priority: number;
  @Prop({ type: Date, required: false })
  scheduleAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

