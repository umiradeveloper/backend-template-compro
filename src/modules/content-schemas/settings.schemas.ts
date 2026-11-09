import { ContentSchema } from './schema.types';

/** Grup pengaturan (singleton). Disimpan di tabel settings dengan key = schema.key */
export const SETTING_SCHEMAS: ContentSchema[] = [
  {
    key: 'general',
    label: 'Umum',
    icon: 'settings',
    description: 'Identitas perusahaan, logo, dan kontak utama.',
    fields: [
      { name: 'siteName', label: 'Nama perusahaan', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline footer', type: 'text', translatable: true },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'logoDark', label: 'Logo (mode gelap)', type: 'image' },
      { name: 'favicon', label: 'Favicon', type: 'image' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Telepon', type: 'text' },
      { name: 'whatsapp', label: 'WhatsApp (format 62xxx)', type: 'text' },
      { name: 'address', label: 'Alamat kantor pusat', type: 'textarea' },
      { name: 'companyProfilePdf', label: 'File Company Profile (PDF)', type: 'file' },
      { name: 'copyright', label: 'Teks copyright', type: 'text', translatable: true },
    ],
  },
  {
    key: 'home',
    label: 'Beranda',
    icon: 'home',
    description: 'Media hero dan nomor urut section di beranda.',
    fields: [
      { name: 'heroVideo', label: 'Video hero', type: 'file', help: 'MP4, disarankan < 15MB' },
      { name: 'heroImage', label: 'Gambar hero (fallback)', type: 'image' },
      { name: 'statsNumber', label: 'Nomor section Stats', type: 'text', placeholder: '01' },
      { name: 'statsName', label: 'Label section Stats', type: 'text', translatable: true, placeholder: 'Stats' },
      { name: 'servicesNumber', label: 'Nomor section Services', type: 'text', placeholder: '03' },
      { name: 'teamNumber', label: 'Nomor section Team', type: 'text', placeholder: '06' },
    ],
  },
  {
    key: 'contact',
    label: 'Kontak & Formulir',
    icon: 'mail',
    description: 'Penerima pesan formulir kontak dan profil yang tampil di section kontak.',
    fields: [
      { name: 'recipientEmail', label: 'Email penerima notifikasi pesan', type: 'email', help: 'Tidak ditampilkan di website' },
      { name: 'keypoints', label: 'Poin keunggulan', type: 'tags', translatable: true },
      { name: 'managerName', label: 'Nama contact person', type: 'text' },
      { name: 'managerPosition', label: 'Jabatan contact person', type: 'text', translatable: true },
      { name: 'managerImage', label: 'Foto contact person', type: 'image' },
    ],
  },
  {
    key: 'seo',
    label: 'SEO & Analytics',
    icon: 'search',
    fields: [
      { name: 'metaTitle', label: 'Meta title default', type: 'text', translatable: true },
      { name: 'metaDescription', label: 'Meta description default', type: 'textarea', translatable: true },
      { name: 'keywords', label: 'Keywords', type: 'tags', translatable: true },
      { name: 'ogImage', label: 'Gambar share (OG image)', type: 'image' },
      { name: 'googleAnalyticsId', label: 'Google Analytics ID', type: 'text', placeholder: 'G-XXXXXXX' },
      { name: 'googleSiteVerification', label: 'Google site verification', type: 'text' },
    ],
  },
];

/** field setting yang tidak boleh keluar lewat API publik */
export const PRIVATE_SETTING_FIELDS: Record<string, string[]> = {
  contact: ['recipientEmail'],
};
