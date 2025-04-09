import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from './entities/task.entity';
import { TaskStatus } from 'src/contants/constants';
import { Model } from 'mongoose';

const mockTask = {
  _id: 'mock-id',
  title: 'Test Task',
  status: TaskStatus.PENDING,
  attempts: 0,
  save: jest.fn(),
};

describe('TaskService', () => {
  let service: TaskService;
  let model: Model<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken(Task.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockTask),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockTask),
            find: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([mockTask]),
            }),
            findOneAndUpdate: jest.fn().mockResolvedValue(mockTask),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    model = module.get<Model<Task>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const newTask = await service.create({ type: 'send-email' });
  });

  it('should retry a failed task if attempts < maxAttempts', async () => {
    const failedTask = {
      ...mockTask,
      attempts: 1,
      status: TaskStatus.FAILED,
    };

    const updateSpy = jest.spyOn(model, 'findByIdAndUpdate');
    await model.findByIdAndUpdate('mock-id', {
      $set: { status: TaskStatus.PENDING, updatedAt: new Date() },
      $inc: { attempts: 1 },
    });

    expect(updateSpy).toHaveBeenCalled();
  });
});
