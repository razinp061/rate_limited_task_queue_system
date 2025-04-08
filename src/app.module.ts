import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobModule } from './middlewares/cronjob/cronjob.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOURI'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CronjobModule,
    TaskModule,
  ],
})
export class AppModule {}
