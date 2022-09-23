import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { QueryProductDto } from './dto/query-product.dto';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() CreateProductDto: CreateProductDto) {
    return this.productService.create(CreateProductDto);
  }

  @Get()
  findAll(@Query() QueryProductDto:QueryProductDto) {
    console.log(QueryProductDto)
    return this.productService.findAll(QueryProductDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateProductDto : UpdateProductDto) {
    return this.productService.update(+id, UpdateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
