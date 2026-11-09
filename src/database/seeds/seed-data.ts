/**
 * Data awal CMS — diambil dari isi website lama (src/app/api/page-data & layout-data).
 * Format: { data: {...field non-terjemahan}, translations: { en: {...}, id: {...} } }
 */
type Item = { data?: Record<string, unknown>; translations?: { en?: Record<string, unknown>; id?: Record<string, unknown> } };

const social = (prefix = '/images/socialIcon') => [
  { icon: `${prefix}/twitter.svg`, link: 'https://twitter.com' },
  { icon: `${prefix}/Be.svg`, link: 'https://www.behance.net/' },
  { icon: `${prefix}/linkedin.svg`, link: 'https://linkedin.com' },
];

export const COLLECTION_SEED: Record<string, Item[]> = {
  services: [
    { data: { image: '/images/home/services/foundation.png' } },
    { data: { image: '/images/home/services/architecture.png' } },
    { data: { image: '/images/home/services/interior.png' } },
  ], // teks heading/desc diisi dari message JSON (ServicesSection.items)
  faqs: [{}, {}, {}, {}], // teks diisi dari message JSON (FaqSection.items)
  'home-stats': [
    { data: { number: 24, suffix: '' } },
    { data: { number: 50, suffix: '' } },
    { data: { number: 47256, suffix: 'm²' } },
  ], // teks dari StatsFacts.scores
  'about-stats': [
    { data: { number: 50, postfix: '+' } },
    { data: { number: 24, postfix: ' Years' } },
    { data: { number: 47256, postfix: ' m²' } },
  ], // teks dari AboutStats.stats
  team: [
    ['Fauzie Pohan', 'Chief Executive Officer', 'Direktur Utama'],
    ['Muhammad Iqbal', 'Chief Finance Officer', 'Direktur Keuangan'],
    ['Ahmad Fauzi', 'Chief Operative Officer', 'Direktur Operasional'],
    ['Muhammad Hari Wijaya', 'Chief Technology Officer', 'Direktur Teknologi'],
  ].map(([name, en, id]) => ({
    data: { name, image: '/images/home/team/team-img.jpg', socialLinks: social() },
    translations: { en: { position: en }, id: { position: id } },
  })),
  testimonials: [
    ['Our website redesign was flawless. They understood our vision perfectly!', 'Albert Flores', 'MasterCard'],
    ['From concept to execution, they delivered outstanding results. Highly recommend their expertise!', 'Robert Fox', 'Mitsubishi'],
    ['Super smooth process with incredible results. highly recommend!', 'Jenny Wilson', 'Pizza Hut'],
  ].map(([quote, author, company]) => ({
    data: { author, company },
    translations: { en: { preTitle: 'Hear from them', quote }, id: { preTitle: 'Kata mereka', quote } },
  })),
  partners: [1, 2, 3, 4, 5].map((n) => ({
    data: { name: `Partner ${n}`, logoLight: `/images/home/pricing/partner-${n}.svg`, logoDark: `/images/home/pricing/partner-dark-${n}.svg` },
  })),
  'services-slider': ['Design', 'Build', 'MEP', 'Interior', 'Architecture', 'BIM Modeling', 'Structure'].map((label) => ({
    data: { label },
  })),
  avatars: [
    ['Sarah Johnson', 1],
    ['Olivia Miller', 2],
    ['Sophia Roberts', 3],
    ['Isabella Clark', 4],
  ].map(([title, n]) => ({ data: { title, image: `/images/avatar/avatar_${n}.jpg` } })),
  offices: [
    ['Head Office Yogyakarta', 'Kantor Pusat Yogyakarta', 'https://maps.app.goo.gl/bivVqYQzxiisULLU9'],
    ['Jakarta Branch Office', 'Kantor Cabang Jakarta', 'https://maps.app.goo.gl/vsiYLejAPVmNuJNi6'],
    ['Surabaya Branch Office', 'Kantor Cabang Surabaya', 'https://maps.app.goo.gl/vSQywm5B2UkTcvxT8'],
    ['Bali Branch Office', 'Kantor Cabang Bali', 'https://maps.app.goo.gl/Uj7bQKHDanSExv6w8'],
  ].map(([en, id, mapUrl]) => ({ data: { mapUrl }, translations: { en: { name: en }, id: { name: id } } })),
  menu: [
    ['Home', 'Beranda', '/'],
    ['About Us', 'Tentang Kami', '/about'],
    ['Projects', 'Proyek', '/projects'],
    ['Blog', 'Blog', '/blog'],
    ['Services', 'Layanan', '/#services'],
    ['Career', 'Karir', '/career'],
    ['Contact', 'Kontak', '/contact'],
    ['System Information Management', 'Sistem Informasi Manajemen', 'https://simumira.com/'],
  ].map(([en, id, path]) => ({ data: { path, newTab: false }, translations: { en: { title: en }, id: { title: id } } })),
  'footer-links': [
    ['Home', 'Beranda', '/', false],
    ['About', 'Tentang', '/about', false],
    ['Services', 'Layanan', '/#services', false],
    ['Work', 'Proyek', '/projects', false],
    ['Company Profile', 'Company Profile', '/docs/COMPRO_USG.pdf', true],
  ].map(([en, id, href, download]) => ({ data: { href, download }, translations: { en: { name: en }, id: { name: id } } })),
  'social-links': [
    ['Facebook', 'https://www.facebook.com/umiraglobal'],
    ['Instagram', 'https://www.instagram.com/umiraglobal'],
    ['Youtube', 'https://youtube.com/@umiraglobal'],
    ['WhatsApp', 'http://wa.me/6285715783344'],
  ].map(([name, href]) => ({ data: { name, href } })),
};

export const SETTINGS_SEED: Record<string, Item> = {
  general: {
    data: {
      siteName: 'Umira Sinergi Global',
      logo: '/images/logo/umiralogo.png',
      logoDark: '/images/logo/umiralogo.png',
      favicon: '/favicon.ico',
      email: 'office@umiraglobal.com',
      phone: '',
      whatsapp: '6285715783344',
      address: '',
      companyProfilePdf: '/docs/COMPRO_USG.pdf',
    },
    translations: {
      en: { tagline: 'Build something together?', copyright: '© Umira Sinergi Global copyright 2025' },
      id: { tagline: 'Mari membangun sesuatu bersama?', copyright: '© Umira Sinergi Global hak cipta 2025' },
    },
  },
  home: {
    data: { heroVideo: '/video/banner-video.mp4', statsNumber: '01', servicesNumber: '03', teamNumber: '06' },
    translations: { en: { statsName: 'Stats' }, id: { statsName: 'Statistik' } },
  },
  contact: {
    data: { recipientEmail: 'office@umiraglobal.com', managerName: 'Courtney Henry', managerImage: '/images/avatar/avatar_1.jpg' },
    translations: {
      en: { keypoints: ['Always-On Customer Support', 'Service Across the Globe'], managerPosition: 'Onboarding & Success Manager' },
      id: { keypoints: ['Dukungan Pelanggan Setiap Saat', 'Layanan ke Seluruh Indonesia'], managerPosition: 'Onboarding & Success Manager' },
    },
  },
  seo: {
    data: { ogImage: '/images/logo/umiralogo.png' },
    translations: {
      en: {
        metaTitle: 'Umira Sinergi Global — Design & Build Construction Company',
        metaDescription: 'A professional, rapidly growing, sustainable design and engineering construction company since 2016.',
        keywords: ['construction', 'design and build', 'contractor bali', 'umira'],
      },
      id: {
        metaTitle: 'Umira Sinergi Global — Perusahaan Konstruksi Desain & Bangun',
        metaDescription: 'Perusahaan konstruksi desain dan rekayasa yang profesional, berkembang pesat, dan berkelanjutan sejak 2016.',
        keywords: ['konstruksi', 'design and build', 'kontraktor bali', 'umira'],
      },
    },
  },
};
