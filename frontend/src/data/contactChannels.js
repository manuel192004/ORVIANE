const emailSubject = 'Consulta para Orviane';
const emailBody = 'Hola, quiero recibir informacion sobre una joya personalizada con Orviane.';

export const ORVIANE_CONTACT = {
  whatsappUrl: 'https://wa.me/qr/JXM3LVGEI75HC1',
  instagramUrl: 'https://www.instagram.com/manuel_s_s_o?igsh=bXA5YmJoaDlwejhw&utm_source=qr',
  facebookUrl: 'https://www.facebook.com/share/1CJKajqpYa/?mibextid=wwXIfr',
  telegramUrl: 'https://t.me/+573246007022',
  tiktokUrl: 'https://www.tiktok.com/@msso10.19?is_from_webapp=1&sender_device=pc',
  mapsUrl: 'https://maps.app.goo.gl/WnmBKxunCvwCd4Ls7',
  email: 'manuelsebastiansolorzanoochoa@gmail.com',
  emailHref: `mailto:manuelsebastiansolorzanoochoa@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
  address: 'Calle 24 #25A-26, Sincelejo, Sucre',
};

export const socialChannels = [
  {
    label: 'WhatsApp',
    href: ORVIANE_CONTACT.whatsappUrl,
    icon: 'whatsapp',
  },
  {
    label: 'Instagram',
    href: ORVIANE_CONTACT.instagramUrl,
    icon: 'instagram',
  },
  {
    label: 'Facebook',
    href: ORVIANE_CONTACT.facebookUrl,
    icon: 'facebook',
  },
  {
    label: 'Telegram',
    href: ORVIANE_CONTACT.telegramUrl,
    icon: 'telegram',
  },
  {
    label: 'TikTok',
    href: ORVIANE_CONTACT.tiktokUrl,
    icon: 'tiktok',
  },
];

export function buildWhatsAppHref() {
  return ORVIANE_CONTACT.whatsappUrl;
}
