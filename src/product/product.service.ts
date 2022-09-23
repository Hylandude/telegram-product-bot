import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {

  constructor(private prisma:PrismaService){}

  async create(dto: CreateProductDto) {

    if(dto.price < 0){
      return {
        success: false,
        error: "Price cannot be negative"
      }
    }
    let user = await this.prisma.user.findFirst({
      where:{user_id: dto.user_id}
    });
    if(!user){
      return {
        success: false,
        error: "Specified user does not exist"
      }
    }

    let product = await this.prisma.product.create({
      data: dto
    });

    return {
      success: true,
      resource: product
    }
  }

  async findAll(dto: QueryProductDto) {
    try{
      type query = {
        where: {
          user_id?: number,
          provider?: string
          price?: any,
          name?: any,
          description?: any
        }
      }
      let product_query:query = {where:{}}
      if(dto.name){
        product_query.where.name = {contains: dto.name};
      }
      if(dto.name){
        product_query.where.description = {contains: dto.description};
      }
      if(dto.provider){
        product_query.where.provider = dto.provider;
      }
      if(dto.min_price && dto.max_price){
        product_query.where.price = {lte: +dto.max_price, gte:+dto.min_price}
      }
      let products = await this.prisma.product.findMany(product_query);
  
      return{
        success: true,
        resource: products
      }
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2009"){
        throw new ForbiddenException('min_price or max_price is not a number')
      }
      return {
        success: false,
        error: e
      }
    }
  }

  async findOne(id: number) {
    let product;
    try{
      product = await this.prisma.product.findUnique({where:{product_id: id}});
    }catch(e){
      return {
        success: false,
        error: e
      }
    }
    if(!product){
      throw new NotFoundException("Product not found");
    }
    return {
      success: true,
      error: product
    }
    
  }

  async update(id: number, dto: UpdateProductDto) {
    try{
      let product = await this.prisma.product.update({
        data: dto,
        where:{product_id: id}
      });
      if(!product){
        return {
          success: false,
          error: "Product not found"
        }
      }
      return {
        success: true,
        resource: product
      }
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2025"){
        throw new ForbiddenException('Product does not exist')
      }
      return {
        success: false,
        error: e
      }
    }
  }

  async remove(id: number) {
    try{
      let product = await this.prisma.product.delete({where:{product_id: id}});
      
      return {
        success: true,
        resource: product
      }
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code == "P2025"){
        throw new ForbiddenException('Product does not exist')
      }
      return {
        success: false,
        error: e
      }
    }
  }
}
