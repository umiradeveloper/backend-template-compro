import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlogsService } from '../blogs/blogs.service';
import { ProjectsService } from '../projects/projects.service';
import { CareersService } from '../careers/careers.service';
import { InquiriesService } from '../inquiries/inquiries.service';
import { MediaService } from '../media/media.service';
import { UsersService } from '../users/users.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CollectionsService } from '../collections/collections.service';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth()
@Controller('admin/dashboard')
export class DashboardController {
  constructor(
    private readonly blogs: BlogsService,
    private readonly projects: ProjectsService,
    private readonly careers: CareersService,
    private readonly inquiries: InquiriesService,
    private readonly media: MediaService,
    private readonly users: UsersService,
    private readonly logs: ActivityLogsService,
    private readonly collections: CollectionsService,
  ) {}

  @Get()
  async summary() {
    const [blogs, projects, careers, openCareers, inquiries, media, users, recentInquiries, recentActivity, monthly, latestBlogs, collections] =
      await Promise.all([
        this.blogs.countByStatus(),
        this.projects.countByStatus(),
        this.careers.countByStatus(),
        this.careers.countOpen(),
        this.inquiries.counts(),
        this.media.stats(),
        this.users.count(),
        this.inquiries.recent(5),
        this.logs.recent(8),
        this.inquiries.monthly(6),
        this.blogs.findAll({ page: 1, limit: 5, sortBy: 'updatedAt', sortOrder: 'DESC' }),
        this.collections.counts(),
      ]);
    return {
      counts: { blogs, projects, careers: { ...careers, open: openCareers }, inquiries, media, users, collections },
      recentInquiries,
      recentActivity,
      inquiriesMonthly: monthly,
      latestBlogs: latestBlogs.data,
    };
  }
}
