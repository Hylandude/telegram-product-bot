import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
@Injectable()
export class UserService {

  constructor(private prisma:PrismaService){}

  async create(dto: CreateUserDto) {
    try{
      let user = await this.prisma.user.create({
        data:dto
      })
  
      return {
        success: true,
        resource: user
      }
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2002"){
        throw new ForbiddenException('Duplicate User, phone number must be unique')
      }
      return {
        success: false,
        error: e
      }
    }
  }

  async findAll(dto: QueryUserDto) {
    try{
      type query = {
        where: {
          name?: any,
          phone_number?: string
        }
      }
      let user_query:query = {where:{}}
      if(dto.name){
        user_query.where.name = {contains: dto.name};
      }
      if(dto.phone_number){
        user_query.where.phone_number = dto.phone_number;
      }
      let users = await this.prisma.user.findMany(user_query);
  
      return{
        success: true,
        resource: users
      }
    }catch(e){
      return {
        success: false,
        error: e
      }
    }
  }

  async findOne(id: number) {
    let user;
    try{
      user = await this.prisma.user.findUnique({where:{user_id: id}});
    }catch(e){
      return {
        success: false,
        error: e
      }
    }
    if(!user){
      throw new NotFoundException("User not found");
    }
    return {
      success: true,
      error: user
    }
    
  }

  async update(id: number, dto: UpdateUserDto) {
    try{
      let user = await this.prisma.user.update({
        data: dto,
        where:{user_id: id}
      });
      if(!user){
        return {
          success: false,
          error: "User not found"
        }
      }
      return {
        success: true,
        resource: user
      }
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2025"){
        throw new ForbiddenException('User does not exist')
      }
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2002"){
        throw new ForbiddenException('Duplicate User, phone number must be unique')
      }
      return {
        success: false,
        error: e
      }
    }
  }

  async remove(id: number) {
    try{
      let user = await this.prisma.user.delete({where:{user_id: id}});
      
      return {
        success: true,
        resource: user
      }
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2025"){
        throw new ForbiddenException('User does not exist')
      }
      return {
        success: false,
        error: e
      }
    }
  }
}
