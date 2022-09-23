import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTelegramDto, UpdateTelegramDto } from './dto';
@Injectable()
export class TelegramService {
  create(createTelegramDto: CreateTelegramDto) {
    return 'This action adds a new telegram';
  }

  findAll() {
    return `This action returns all telegram`;
  }

  findOne(id: number) {
    return `This action returns a #${id} telegram`;
  }

  update(id: number, updateTelegramDto: UpdateTelegramDto) {
    return `This action updates a #${id} telegram`;
  }

  remove(id: number) {
    return `This action removes a #${id} telegram`;
  }
}
