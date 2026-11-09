import { User } from '../modules/users/user.entity';
import { Blog, BlogTranslation } from '../modules/blogs/blog.entity';
import { Project, ProjectTranslation } from '../modules/projects/project.entity';
import { Career, CareerTranslation } from '../modules/careers/career.entity';
import { CollectionItem } from '../modules/collections/collection-item.entity';
import { Setting } from '../modules/settings/setting.entity';
import { SiteText } from '../modules/site-texts/site-text.entity';
import { Media } from '../modules/media/media.entity';
import { Inquiry } from '../modules/inquiries/inquiry.entity';
import { ActivityLog } from '../modules/activity-logs/activity-log.entity';

export const ENTITIES = [
  User, Blog, BlogTranslation, Project, ProjectTranslation, Career, CareerTranslation,
  CollectionItem, Setting, SiteText, Media, Inquiry, ActivityLog,
];
