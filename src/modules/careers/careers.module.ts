import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career, CareerTranslation } from './career.entity';
import { CareersService } from './careers.service';
import { CareersController } from './careers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Career, CareerTranslation])],
  providers: [CareersService],
  controllers: [CareersController],
  exports: [CareersService],
})
export class CareersModule {}
