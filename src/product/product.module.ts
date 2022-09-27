import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CronService } from './cron.service';


@Module({
  imports:[HttpModule, ScheduleModule.forRoot()],
  controllers: [ProductController],
  providers: [ProductService, CronService]
})
export class ProductModule {}
