import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

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

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, dto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
