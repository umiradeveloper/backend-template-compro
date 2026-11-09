import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { BlogsModule } from '../blogs/blogs.module';
import { ProjectsModule } from '../projects/projects.module';
import { CareersModule } from '../careers/careers.module';
import { CollectionsModule } from '../collections/collections.module';
import { SiteTextsModule } from '../site-texts/site-texts.module';
import { InquiriesModule } from '../inquiries/inquiries.module';

@Module({
  imports: [BlogsModule, ProjectsModule, CareersModule, CollectionsModule, SiteTextsModule, InquiriesModule],
  controllers: [PublicController],
})
export class PublicModule {}
