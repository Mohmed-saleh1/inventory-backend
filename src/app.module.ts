import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './products/products.module';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
