import { Test, TestingModule } from '@nestjs/testing';
import { CronjobService } from './cronjob.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from '../../task/entities/task.entity';
import { Model } from 'mongoose';
import { TaskStatus } from '../../contants/constants';

const mockTaskModel = () => ({
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOneAndUpdate: jest.fn(),
});

describe('CronjobService', () => {
  let service: CronjobService;
  let model: Model<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronjobService,
        {
          provide: getModelToken(Task.name),
          useFactory: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<CronjobService>(CronjobService);
    model = module.get<Model<Task>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process and complete tasks', async () => {
    const mockTask = {
      _id: '123',
      status: TaskStatus.PENDING,
      attempts: 0,
    };

    const findMock = jest
      .fn()
      .mockReturnValue({ limit: jest.fn().mockResolvedValue([mockTask]) });
    const findOneAndUpdateMock = jest.fn().mockResolvedValue(mockTask);
    const findByIdAndUpdateMock = jest.fn().mockResolvedValue({});

    (model.find as any) = findMock;
    (model.findOneAndUpdate as any) = findOneAndUpdateMock;
    (model.findByIdAndUpdate as any) = findByIdAndUpdateMock;

    await service.handleCron();

    expect(findMock).toHaveBeenCalled();
    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { _id: mockTask._id, status: TaskStatus.PENDING },
      expect.any(Object),
      { new: true },
    );
    expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
      mockTask._id,
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        $set: expect.objectContaining({ status: TaskStatus.COMPLETED }),
      }),
    );
  });
});
