import { Telegram, User } from '.prisma/client';
import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { env } from 'process';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTelegramDto, UpdateTelegramDto, QueryTelegramDto} from './dto';
import { TelegramCommandService } from './telegram-command.service';

@Injectable()
export class TelegramService {

  constructor(
    private prisma:PrismaService, 
    private httpService: HttpService,
    private commands:TelegramCommandService){}

  async sendMessage(text:string, chat_id:string, token:string){
    //format json
    let telegram_message = {
      chat_id: chat_id,
      text: text,
    }
    //send data to telegram
    let telegram_api_url = "https://api.telegram.org/bot"+token+"/sendMessage";
    this.httpService.axiosRef.post(telegram_api_url, telegram_message)
  }

  async sendMedia(image_url:string, chat_id:string, token:string){
    //format json
    let telegram_message = {
      chat_id: chat_id,
      photo: image_url,
    }
    //send data to telegram
    let telegram_api_url = "https://api.telegram.org/bot"+token+"/sendPhoto";
    this.httpService.axiosRef.post(telegram_api_url, telegram_message)
  }

  async processCommands(telegram:Telegram, user:User, message){
    //get /command from text 
    let command = message.text.split(" ")
    let command_regex:RegExp;
    let error_message:string;
    let command_name:string;

    //Do actions based on command
    switch (command[0]) {
      //send welcome message
      case "/start":
        let message_text = `Hola ${user.name}!\n Usa alguno de los comandos en el menu para empezar.`;
        this.sendMessage(message_text, user.phone_number, telegram.token);
        return;
      
      //set syntax regex and messages for other commands
      case "/buscar":
        command_regex = new RegExp("\/buscar <[^>]*>", "gus");
        error_message = "Sintaxis invalida, debe ser '/buscar <producto>' incluyendo <>";
        command_name = "search";
        break;

      case "/suscribir":
        command_regex = new RegExp("\/suscribir <[^>]*> <[.0-9^>]*>", "gus");
        error_message = "Sintaxis invalida, debe ser '/suscribir <producto> <precio>' incluyendo <>";
        command_name = "subscribe";
        break;
    }

    //check if the message matches the syntax regex
    if(message.text.match(command_regex)){
      console.log("COMMAND")
      //extract command params from text
      let command_params = message.text.match(/<[^>]*>/gm);
      command_params = command_params.map(param => param.slice(1,param.length-1));

      //perform command actions
      let command_result = await this.commands[command_name](command_params, user);
      console.log(command_result);

      if(command_result.success){
        //send success message
        console.log("COMMAND SUCCESS");
        this.sendMessage(command_result.resource.message, user.phone_number, telegram.token);

        //send media according to received data
        if(command_result.resource.mercado_product && command_result.resource.mercado_product.image_url){
          this.sendMedia(command_result.resource.mercado_product.image_url, user.phone_number, telegram.token);
        }
        if(command_result.resource.amazon_product && command_result.resource.amazon_product.image_url){
          this.sendMedia(command_result.resource.amazon_product.image_url, user.phone_number, telegram.token);
        }
        
      }else{
        //send error message
        console.log("COMMAND FAILED");
        this.sendMessage(command_result.error, user.phone_number, telegram.token);
      }
    }else{
      //no command match, send syntax clarification
      this.sendMessage(error_message, user.phone_number, telegram.token);
    }
  }

  async processMessage(telegram:Telegram, user:User, message){
    //process bot commands
    if(message.entities && message.entities[0] && message.entities[0].type == "bot_command"){
      this.processCommands(telegram, user, message);
      return;
    }
    
    //not a command show how to use
    this.sendMessage(env.COMMAND_DESCRIPTIONS, user.phone_number, telegram.token)
  }

  async getApiUpdate(data:any, headers:any, bot_username:string){
    //check for secret token
    if(!headers || !headers['x-telegram-bot-api-secret-token'] || headers['x-telegram-bot-api-secret-token'] != env.TELEGRAM_TOKEN){
      throw new ForbiddenException("Invalid token");
    }
    //check there's a message in the received data
    if(!data.message || !data.message.text) return "Empty message";

    //Look up the telegram bot data
    let telegram = await this.prisma.telegram.findFirst({where:{username: bot_username}});
    console.log(telegram)
    if(!telegram){
      throw new NotFoundException("Telegram bot not found")
    }

    //find or create user
    let user_number = String(data.message.from.id)
    let user = await this.prisma.user.findFirst({where: {phone_number: user_number}});
    if(!user){
      user = await this.prisma.user.create({
        data:{
          phone_number: user_number,
          name: data.message.from.username ? data.message.from.username : data.message.from.first_name
        }
      });
    }

    this.processMessage(telegram, user, data.message);

    return "OK!"
  }

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
