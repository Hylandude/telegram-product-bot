import { Module } from '@nestjs/common';
import { MercadolibreService } from './mercadolibre.service';
import { MercadolibreController } from './mercadolibre.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MercadolibreController],
  providers: [MercadolibreService]
})
export class MercadolibreModule {}
