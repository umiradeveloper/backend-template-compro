import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteText } from './site-text.entity';
import { SiteTextsService } from './site-texts.service';
import { SiteTextsController } from './site-texts.controller';
import { CollectionsModule } from '../collections/collections.module';

@Module({
  imports: [TypeOrmModule.forFeature([SiteText]), CollectionsModule],
  providers: [SiteTextsService],
  controllers: [SiteTextsController],
  exports: [SiteTextsService],
})
export class SiteTextsModule {}
