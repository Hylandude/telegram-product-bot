import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { HttpModule } from '@nestjs/axios';
import { TelegramCommandService } from './telegram-command.service';

@Module({
  imports: [HttpModule],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramCommandService]
})
export class TelegramModule {}
