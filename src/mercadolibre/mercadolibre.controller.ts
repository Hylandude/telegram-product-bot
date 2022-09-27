import { Body, Controller, Get, Post, Query} from '@nestjs/common';
import { MercadolibreService } from './mercadolibre.service';

@Controller('mercadolibre')
export class MercadolibreController {
  constructor(private readonly mercadolibreService: MercadolibreService) {}

  @Post()
  postDataIn(@Body() body:any, @Query() query:any) {
    return this.mercadolibreService.token(body, query);
  }

  @Get()
  getDataIn(@Body() body:any, @Query() query:any) {
    return this.mercadolibreService.token(body, query);
  }

  @Get("/refresh")
  refreshToken(){
    return this.mercadolibreService.refreshToken();
  }
}
