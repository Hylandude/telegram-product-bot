import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CreateTelegramDto, UpdateTelegramDto, QueryTelegramDto} from './dto';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  //Telegram Webhook
  @Post('apiUpdate/:bot_username')
  getUpdate(@Body() data:any, @Headers() headers:any, bot_username:string){
    return this.telegramService.getApiUpdate(data, headers, bot_username)
  }

  @Post()
  create(@Body() createTelegramDto: CreateTelegramDto) {
    return this.telegramService.create(createTelegramDto);
  }

  @Get()
  findAll(@Query() queryTelegramDto:QueryTelegramDto ) {
    return this.telegramService.findAll(queryTelegramDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.telegramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTelegramDto: UpdateTelegramDto) {
    return this.telegramService.update(+id, updateTelegramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.telegramService.remove(+id);
  }
}
