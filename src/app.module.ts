import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ProductModule, UserModule, TelegramModule]
})
export class AppModule {}
