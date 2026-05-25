import type { CatalogCard, CatalogCategory, Service, OrderField, Stat } from '../types';

export const catalogCategories: Record<string, CatalogCategory> = {
  '4K Pad Albums': {
    items: [
      { image: '/catalog/pad-01-12.jpg',  title: 'Designs 4K-01 to 4K-12' },
      { image: '/catalog/pad-13-24.jpg',  title: 'Designs 4K-13 to 4K-24' },
      { image: '/catalog/pad-25-36.jpg',  title: 'Designs 4K-25 to 4K-36' },
      { image: '/catalog/pad-37-48.jpg',  title: 'Designs 4K-37 to 4K-48' },
      { image: '/catalog/pad-49-60.jpg',  title: 'Designs 4K-49 to 4K-60' },
      { image: '/catalog/pad-61-72.jpg',  title: 'Designs 4K-61 to 4K-72' },
    ],
  },
  'Luxury Combos': {
    items: [
      { image: '/catalog/luxury-01.jpg', title: 'Luxury Combo Box 1' },
      { image: '/catalog/luxury-02.jpg', title: 'Luxury Combo Box 2' },
      { image: '/catalog/luxury-03.jpg', title: 'Luxury Combo Box 3' },
    ],
  },
  'LED Boxes': {
    items: [
      { image: '/catalog/led-01.jpg', title: 'LED Video Box 1' },
      { image: '/catalog/led-02.jpg', title: 'LED Video Box 2' },
    ],
  },
  'Special Combos': {
    items: [
      { image: '/catalog/combo-01.jpg', title: 'Special Combo Set 1' },
      { image: '/catalog/combo-02.jpg', title: 'Special Combo Set 2' },
      { image: '/catalog/combo-03.jpg', title: 'Special Combo Set 3' },
      { image: '/catalog/combo-04.jpg', title: 'Special Combo Set 4' },
      { image: '/catalog/combo-05.jpg', title: 'Special Combo Set 5' },
    ],
  },
  'Suitcase Packages': {
    items: [
      { image: '/catalog/suitcase-01.jpg', title: 'Suitcase Package 1' },
      { image: '/catalog/suitcase-02.jpg', title: 'Suitcase Package 2' },
    ],
  },
  'Three Fold & Pendrive': {
    items: [
      { image: '/catalog/threefold-01.jpg', title: 'Three Fold & Pendrive Box' },
    ],
  },
  'Mini Books': {
    items: [
      { image: '/catalog/minibooks-01.jpg', title: 'Mini Books' },
    ],
  },
};

export const catalogCards: CatalogCard[] = [
  { title: '4K Pad — Designs 4K-01 to 4K-12', subtitle: 'Classic album layouts' },
  { title: '4K Pad — Designs 4K-13 to 4K-24', subtitle: 'Bold premium spreads' },
  { title: '4K Pad — Designs 4K-25 to 4K-36', subtitle: 'Elegant cover options' },
  { title: '4K Pad — Designs 4K-37 to 4K-48', subtitle: 'Deep-color compositions' },
  { title: '4K Pad — Designs 4K-49 to 4K-60', subtitle: 'Gold-accent editions' },
  { title: '4K Pad — Designs 4K-61 to 4K-72', subtitle: 'Final signature series' },
];

export const serviceCategories: string[] = [
  '4K Pad Albums',
  'Luxury Combo Boxes',
  'LED Video Boxes',
  'Suitcase Packages',
  'Special Combo Sets',
  'Three Fold Pads',
  'Pendrive Boxes',
  'Box with Pad',
  'Premium Rexin & Leather Covers',
  'Custom Personalization',
  '72+ Exclusive Designs',
];

export const services: Service[] = [
  {
    icon: '📖',
    title: '4K Pad Albums',
    description:
      '72+ exclusive designs of premium pad albums for weddings, receptions, and engagements. Sizes 12×12 to 12×18 in standard rexin covers.',
  },
  {
    icon: '🎁',
    title: 'Luxury Combo Packages',
    description:
      'Multi-drawer designer boxes with wooden finishes and gold hardware. A treasure chest that opens to reveal your wedding story.',
  },
  {
    icon: '💡',
    title: 'LED Video Boxes',
    description:
      'Premium boxes with built-in LED screens. Play your wedding video right from the box in wood and brass finishes.',
  },
  {
    icon: '🧳',
    title: 'Suitcase Packages',
    description:
      'Briefcase-style carriers in richly textured rexin with photo cutouts and metallic clasps for a dramatic presentation.',
  },
  {
    icon: '📦',
    title: 'Special Combo Sets',
    description:
      'Complete sets pairing album, diary, calendar, pendrive, and frame, beautifully boxed for the full wedding memory package.',
  },
  {
    icon: '🖼️',
    title: 'Pendrive & Frame Boxes',
    description:
      'Elegant pendrive presentation boxes and three-fold display pads designed to package digital and printed memories.',
  },
];

export const highlights: string[] = [
  'All sizes from 12×12 to 12×18 available',
  'Custom name, date, and photo on every piece',
  'Premium rexin, leather, and wood finishes',
  'Quick turnaround with careful packaging',
  'Albums, LED boxes, suitcase sets, and more',
];

export const stats: Stat[] = [
  { value: '72+', label: '4K Designs' },
  { value: '12+', label: 'Combo Types' },
  { value: '100%', label: 'Custom Made' },
];

export const orderFields: OrderField[] = [
  { label: 'Your Name',           placeholder: 'Rohan' },
  { label: 'Phone Number',        placeholder: '9876543210' },
  { label: 'Your Email Address',  placeholder: 'yourname@gmail.com' },
  { label: 'Design Code',         placeholder: '4K-07' },
  { label: 'Names / Custom Text', placeholder: 'Rohan & Lakshmi — 14 Feb 2025' },
  { label: 'Additional Notes',    placeholder: 'Specific requests, finishes, delivery info...' },
];
