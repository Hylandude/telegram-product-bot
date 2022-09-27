import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MercadolibreModule } from './mercadolibre/mercadolibre.module';

@Module({
  imports: [ProductModule, UserModule, TelegramModule, PrismaModule, MercadolibreModule],
  providers: [PrismaService]
})
export class AppModule {}
