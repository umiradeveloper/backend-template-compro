import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { ENTITIES } from './database/entities';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { CareersModule } from './modules/careers/careers.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SiteTextsModule } from './modules/site-texts/site-texts.module';
import { MediaModule } from './modules/media/media.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PublicModule } from './modules/public/public.module';
import { HealthController } from './health.controller';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('db.host'),
        port: config.get<number>('db.port'),
        username: config.get('db.username'),
        password: config.get('db.password'),
        database: config.get('db.database'),
        entities: ENTITIES,
        synchronize: config.get<boolean>('db.synchronize'),
        logging: config.get<boolean>('db.logging'),
        charset: 'utf8mb4_unicode_ci',
        timezone: 'Z',
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    StorageModule,
    ActivityLogsModule,
    SettingsModule,
    AuthModule,
    UsersModule,
    BlogsModule,
    ProjectsModule,
    CareersModule,
    CollectionsModule,
    SiteTextsModule,
    MediaModule,
    InquiriesModule,
    DashboardModule,
    PublicModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
