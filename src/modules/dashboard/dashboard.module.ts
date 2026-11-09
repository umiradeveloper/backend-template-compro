import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { BlogsModule } from '../blogs/blogs.module';
import { ProjectsModule } from '../projects/projects.module';
import { CareersModule } from '../careers/careers.module';
import { InquiriesModule } from '../inquiries/inquiries.module';
import { MediaModule } from '../media/media.module';
import { UsersModule } from '../users/users.module';
import { CollectionsModule } from '../collections/collections.module';

@Module({
  imports: [BlogsModule, ProjectsModule, CareersModule, InquiriesModule, MediaModule, UsersModule, CollectionsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
