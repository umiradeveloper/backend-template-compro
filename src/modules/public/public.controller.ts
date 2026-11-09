import { Body, Controller, Get, Headers, Ip, NotFoundException, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { ContentStatus, DEFAULT_LOCALE, LOCALES } from '../../common/enums';
import { BlogsService } from '../blogs/blogs.service';
import { ProjectsService } from '../projects/projects.service';
import { CareersService } from '../careers/careers.service';
import { CollectionsService } from '../collections/collections.service';
import { SettingsService } from '../settings/settings.service';
import { SiteTextsService } from '../site-texts/site-texts.service';
import { InquiriesService } from '../inquiries/inquiries.service';
import { CreateInquiryDto } from '../inquiries/inquiries.dto';
import { PublicAssetInterceptor } from './public-asset.interceptor';

const loc = (l?: string) => (LOCALES.includes(l as any) ? (l as string) : DEFAULT_LOCALE);

@ApiTags('Public (dipakai website)')
@Public()
@UseInterceptors(PublicAssetInterceptor)
@Controller('public')
export class PublicController {
  constructor(
    private readonly blogs: BlogsService,
    private readonly projects: ProjectsService,
    private readonly careers: CareersService,
    private readonly collections: CollectionsService,
    private readonly settings: SettingsService,
    private readonly siteTexts: SiteTextsService,
    private readonly inquiries: InquiriesService,
  ) {}

  // ---------------- BLOG ----------------
  @ApiQuery({ name: 'locale', required: false, enum: LOCALES })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get('blogs')
  async blogList(@Query('locale') l?: string, @Query('page') page = '1', @Query('limit') limit = '100', @Query('search') search?: string) {
    const res = await this.blogs.findAll({
      status: ContentStatus.PUBLISHED, page: +page || 1, limit: Math.min(+limit || 100, 200), search, sortBy: 'publishedAt', sortOrder: 'DESC',
    });
    return { data: res.data.map((b) => this.blogs.toPublic(b, loc(l))), meta: res.meta };
  }

  @Get('blogs/:slug')
  async blog(@Param('slug') slug: string, @Query('locale') l?: string) {
    const b = await this.blogs.findBySlug(slug);
    if (!b) throw new NotFoundException('Artikel tidak ditemukan');
    void this.blogs.incrementViews(b.id);
    return this.blogs.toPublic(b, loc(l), true);
  }

  // ---------------- PROJECTS ----------------
  @Get('projects')
  async projectList(@Query('locale') l?: string, @Query('limit') limit = '100') {
    const res = await this.projects.findAll({ status: ContentStatus.PUBLISHED, page: 1, limit: Math.min(+limit || 100, 200) });
    return { data: res.data.map((p) => this.projects.toPublic(p, loc(l))), meta: res.meta };
  }

  @Get('projects/:slug')
  async project(@Param('slug') slug: string, @Query('locale') l?: string) {
    const p = await this.projects.findBySlug(slug);
    if (!p) throw new NotFoundException('Proyek tidak ditemukan');
    return this.projects.toPublic(p, loc(l), true);
  }

  // ---------------- CAREERS ----------------
  @Get('careers')
  async careerList(@Query('locale') l?: string, @Query('includeClosed') includeClosed?: string) {
    const res = await this.careers.findAll({ status: ContentStatus.PUBLISHED, page: 1, limit: 200 });
    const list = res.data.filter((c) => includeClosed === 'true' || this.careers.isOpen(c));
    return { data: list.map((c) => this.careers.toPublic(c, loc(l))), meta: { ...res.meta, total: list.length } };
  }

  @Get('careers/:slug')
  async career(@Param('slug') slug: string, @Query('locale') l?: string) {
    const c = await this.careers.findBySlug(slug);
    if (!c) throw new NotFoundException('Lowongan tidak ditemukan');
    return this.careers.toPublic(c, loc(l), true);
  }

  // ---------------- KONTEN UMUM ----------------
  @Get('collections/:key')
  collection(@Param('key') key: string, @Query('locale') l?: string) {
    return this.collections.resolved(key, loc(l));
  }

  @Get('settings')
  settingsAll(@Query('locale') l?: string) {
    return this.settings.resolvedAll(loc(l));
  }

  /** Message next-intl (pengganti src/message/{locale}/{locale}.json) */
  @Get('messages/:locale')
  messages(@Param('locale') l: string) {
    return this.siteTexts.messages(loc(l));
  }

  /** Format sama dengan /api/page-data milik website lama */
  @Get('page-data')
  async pageData(@Query('locale') l?: string) {
    const locale = loc(l);
    const r = (k: string) => this.collections.resolved(k, locale);
    const [avatars, homeStats, services, testimonials, team, partners, faqs, aboutStats, slider, home, contact, msg] = await Promise.all([
      r('avatars'), r('home-stats'), r('services'), r('testimonials'), r('team'), r('partners'), r('faqs'), r('about-stats'),
      r('services-slider'), this.settings.resolved('home', locale), this.settings.resolved('contact', locale), this.siteTexts.messages(locale),
    ]);
    const m = msg as any;

    const testimonialData: Record<string, unknown> = {};
    testimonials.forEach((t: any, i) => {
      testimonialData[`data_${i + 1}`] = { preTitle: t.preTitle ?? '', title: t.quote ?? '', author: t.author ?? '', company: t.company ?? '', image: t.image ?? null };
    });
    testimonialData.data = Object.values(testimonialData);

    return {
      avatarList: avatars.map((a: any) => ({ image: a.image, title: a.title })),
      statsFactData: {
        number: home.statsNumber || '01',
        name: home.statsName || 'Stats',
        heading: m.StatsFacts?.heading ?? '',
        description: m.StatsFacts?.description ?? '',
        scoreData: homeStats.map((s: any) => ({ number: Number(s.number ?? 0), numberValue: s.suffix || undefined, scoreDescp: s.description ?? '' })),
      },
      servicesData: {
        number: home.servicesNumber || '03',
        name: m.ServicesSection?.name ?? 'Services',
        heading: m.ServicesSection?.heading ?? '',
        description: m.ServicesSection?.descp ?? '',
        data: services.map((s: any) => ({ id: s.id, image: s.image, heading: s.heading ?? '', descp: s.desc ?? '' })),
      },
      testimonialData,
      teamData: {
        number: home.teamNumber || '06',
        data: team.map((t: any) => ({ image: t.image, name: t.name, position: t.position, socialLinks: t.socialLinks ?? [] })),
      },
      pricingData: {
        data: [],
        partnerLogo: partners.map((p: any) => ({ light: p.logoLight, dark: p.logoDark || p.logoLight, name: p.name, url: p.url })),
      },
      faqData: { data: faqs.map((f: any) => ({ faq_que: f.question ?? '', faq_ans: f.answer ?? '' })) },
      contactData: {
        keypoint: (contact.keypoints as string[]) ?? [],
        managerProfile: { image: contact.managerImage ?? null, name: contact.managerName ?? '', position: contact.managerPosition ?? '' },
      },
      aboutusStats: aboutStats.map((s: any) => ({ number: Number(s.number ?? 0), postfix: s.postfix ?? '', title: s.title ?? '', descp: s.description ?? '' })),
      servicesSliderData: slider.map((s: any) => s.label),
    };
  }

  /** Format sama dengan /api/layout-data milik website lama */
  @Get('layout-data')
  async layoutData(@Query('locale') l?: string) {
    const locale = loc(l);
    const [menu, offices, links, socials, general] = await Promise.all([
      this.collections.resolved('menu', locale),
      this.collections.resolved('offices', locale),
      this.collections.resolved('footer-links', locale),
      this.collections.resolved('social-links', locale),
      this.settings.resolved('general', locale),
    ]);
    const info: Array<Record<string, unknown>> = [];
    if (general.email) info.push({ icon: '/images/footer/email-arrow.svg', link: general.email, href: `mailto:${general.email}` });
    for (const o of offices as any[]) info.push({ icon: '/images/footer/Location.svg', link: o.name, href: o.mapUrl || '#', address: o.address });

    return {
      MenuData: menu.map((m: any, i) => ({ id: m.id ?? i + 1, title: m.title, path: m.path, newTab: !!m.newTab })),
      footerData: {
        name: general.siteName ?? '',
        tagline: general.tagline ?? '',
        info,
        links: links.map((x: any) => ({ name: x.name, href: x.href, ...(x.download ? { download: true } : {}) })),
        socialLinks: socials.map((s: any) => ({ name: s.name, href: s.href, icon: s.icon ?? null })),
        copyright: general.copyright ?? '',
        whatsapp: general.whatsapp ?? null,
        phone: general.phone ?? null,
        logo: general.logo ?? null,
      },
    };
  }

  // ---------------- FORM KONTAK ----------------
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('inquiries')
  createInquiry(@Body() dto: CreateInquiryDto, @Ip() ip: string, @Headers('user-agent') ua?: string) {
    return this.inquiries.create(dto, { ip, userAgent: ua });
  }
}
