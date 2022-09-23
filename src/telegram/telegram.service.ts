import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTelegramDto, UpdateTelegramDto, QueryTelegramDto } from './dto';
@Injectable()
export class TelegramService {

  constructor(private prisma:PrismaService){}

  async create(dto: CreateTelegramDto) {
    try{
      let telegram = await this.prisma.telegram.create({
        data:dto
      })
  
      return {
        success: true,
        resource: telegram
      }
    }catch(e){
      return {
        success: false,
        error: e
      }
    }
  }

  async findAll(dto: QueryTelegramDto) {
    try{
      type query = {
        where: {
          username?: any,
          bot_id?: string
        }
      }
      let telegram_query:query = {where:{}}
      if(dto.username){
        telegram_query.where.username = {contains: dto.username};
      }
      if(dto.bot_id){
        telegram_query.where.bot_id = dto.bot_id;
      }
      let telegrams = await this.prisma.telegram.findMany(telegram_query);
  
      return{
        success: true,
        resource: telegrams
      }
    }catch(e){
      console.log(e);
      return {
        success: false,
        error: e
      }
    }
  }

  async findOne(id: number) {
    let telegram;
    try{
      telegram = await this.prisma.telegram.findUnique({where:{telegram_id: id}});
    }catch(e){
      return {
        success: false,
        error: e
      }
    }
    if(!telegram){
      throw new NotFoundException("Telegram not found");
    }
    return {
      success: true,
      error: telegram
    }
    
  }

  async update(id: number, dto: UpdateTelegramDto) {
    try{
      let telegram = await this.prisma.telegram.update({
        data: dto,
        where:{telegram_id: id}
      });
      if(!telegram){
        return {
          success: false,
          error: "Telegram not found"
        }
      }
      return {
        success: true,
        resource: telegram
      }
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2025"){
        throw new ForbiddenException('Telegram does not exist')
      }
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2002"){
        throw new ForbiddenException('Duplicate Telegram, phone number must be unique')
      }
      return {
        success: false,
        error: e
      }
    }
  }

  async remove(id: number) {
    try{
      let telegram = await this.prisma.telegram.delete({where:{telegram_id: id}});
      
      return {
        success: true,
        resource: telegram
      }
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2025"){
        throw new ForbiddenException('Telegram does not exist')
      }
      return {
        success: false,
        error: e
      }
    }
  }
}
