import { ContentSchema } from './schema.types';

/**
 * Definisi koleksi konten (daftar item yang bisa ditambah, diurutkan, dan dihapus).
 * Admin panel membentuk form secara otomatis dari definisi ini.
 * Tambah koleksi baru cukup dengan menambah objek di sini.
 */
export const COLLECTION_SCHEMAS: ContentSchema[] = [
  {
    key: 'services',
    label: 'Layanan',
    icon: 'briefcase',
    description: 'Daftar layanan di section "What we do" halaman beranda.',
    usedOn: 'Beranda → Services',
    titleField: 'heading',
    fields: [
      { name: 'heading', label: 'Judul layanan', type: 'text', translatable: true, required: true },
      { name: 'desc', label: 'Deskripsi', type: 'textarea', translatable: true },
      { name: 'image', label: 'Gambar', type: 'image' },
    ],
  },
  {
    key: 'team',
    label: 'Tim / Manajemen',
    icon: 'users',
    usedOn: 'Beranda → Team',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Nama', type: 'text', required: true },
      { name: 'position', label: 'Jabatan', type: 'text', translatable: true, required: true },
      { name: 'image', label: 'Foto', type: 'image' },
      {
        name: 'socialLinks',
        label: 'Link sosial media',
        type: 'list',
        fields: [
          { name: 'icon', label: 'Ikon', type: 'image' },
          { name: 'link', label: 'URL', type: 'url' },
        ],
      },
    ],
  },
  {
    key: 'testimonials',
    label: 'Testimoni',
    icon: 'quote',
    usedOn: 'Beranda → Testimonial',
    titleField: 'author',
    fields: [
      { name: 'preTitle', label: 'Label kecil', type: 'text', translatable: true, placeholder: 'Hear from them' },
      { name: 'quote', label: 'Isi testimoni', type: 'textarea', translatable: true, required: true },
      { name: 'author', label: 'Nama', type: 'text', required: true },
      { name: 'company', label: 'Perusahaan', type: 'text' },
      { name: 'image', label: 'Foto', type: 'image' },
    ],
  },
  {
    key: 'faqs',
    label: 'FAQ',
    icon: 'help',
    usedOn: 'Beranda → FAQs',
    titleField: 'question',
    fields: [
      { name: 'question', label: 'Pertanyaan', type: 'text', translatable: true, required: true },
      { name: 'answer', label: 'Jawaban', type: 'textarea', translatable: true, required: true },
    ],
  },
  {
    key: 'partners',
    label: 'Partner / Klien',
    icon: 'handshake',
    usedOn: 'Beranda → logo slider partner',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Nama', type: 'text', required: true },
      { name: 'logoLight', label: 'Logo (mode terang)', type: 'image', required: true },
      { name: 'logoDark', label: 'Logo (mode gelap)', type: 'image' },
      { name: 'url', label: 'Website', type: 'url' },
    ],
  },
  {
    key: 'home-stats',
    label: 'Statistik Beranda',
    icon: 'chart',
    usedOn: 'Beranda → Stats',
    titleField: 'description',
    fields: [
      { name: 'number', label: 'Angka', type: 'number', required: true },
      { name: 'suffix', label: 'Satuan / akhiran', type: 'text', placeholder: 'm², +, Years' },
      { name: 'description', label: 'Keterangan', type: 'textarea', translatable: true, required: true },
    ],
  },
  {
    key: 'about-stats',
    label: 'Statistik Tentang Kami',
    icon: 'chart',
    usedOn: 'Halaman About',
    titleField: 'title',
    fields: [
      { name: 'number', label: 'Angka', type: 'number', required: true },
      { name: 'postfix', label: 'Akhiran', type: 'text', placeholder: '+, Years, m²' },
      { name: 'title', label: 'Judul', type: 'text', translatable: true, required: true },
      { name: 'description', label: 'Keterangan', type: 'textarea', translatable: true },
    ],
  },
  {
    key: 'services-slider',
    label: 'Teks Berjalan (Marquee)',
    icon: 'marquee',
    usedOn: 'Halaman About → slider kata layanan',
    titleField: 'label',
    fields: [{ name: 'label', label: 'Teks', type: 'text', required: true }],
  },
  {
    key: 'avatars',
    label: 'Avatar Beranda',
    icon: 'image',
    usedOn: 'Beranda → About us (deretan avatar)',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Nama', type: 'text', required: true },
      { name: 'image', label: 'Foto', type: 'image', required: true },
    ],
  },
  {
    key: 'offices',
    label: 'Kantor & Lokasi',
    icon: 'map',
    usedOn: 'Footer',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Nama kantor', type: 'text', translatable: true, required: true },
      { name: 'address', label: 'Alamat', type: 'textarea' },
      { name: 'mapUrl', label: 'Link Google Maps', type: 'url' },
      { name: 'phone', label: 'Telepon', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
    ],
  },
  {
    key: 'menu',
    label: 'Menu Header',
    icon: 'menu',
    usedOn: 'Header (navigasi utama)',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Label menu', type: 'text', translatable: true, required: true },
      { name: 'path', label: 'Path / URL', type: 'text', required: true, placeholder: '/about atau https://...' },
      { name: 'newTab', label: 'Buka di tab baru', type: 'boolean' },
    ],
  },
  {
    key: 'footer-links',
    label: 'Link Footer',
    icon: 'link',
    usedOn: 'Footer',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Label', type: 'text', translatable: true, required: true },
      { name: 'href', label: 'Path / URL / file', type: 'text', required: true },
      { name: 'download', label: 'Link download file', type: 'boolean' },
    ],
  },
  {
    key: 'social-links',
    label: 'Media Sosial',
    icon: 'share',
    usedOn: 'Footer',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Nama', type: 'text', required: true, placeholder: 'Instagram' },
      { name: 'href', label: 'URL', type: 'url', required: true },
      { name: 'icon', label: 'Ikon (opsional)', type: 'image' },
    ],
  },
];
