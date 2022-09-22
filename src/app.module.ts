import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProductModule, UserModule, TelegramModule, PrismaModule],
  providers: [PrismaService]
})
export class AppModule {}
