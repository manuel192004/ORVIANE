const iconPaths = {
  whatsapp: (
    <>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2-5.5A8.4 8.4 0 1 1 21 11.5Z" />
      <path d="M9 8.8c.3 3.1 2.1 5.1 5.4 6.1l1.4-1.2c.3-.2.7-.2 1 .1l1.3 1.1" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M17.5 6.8h.01" />
    </>
  ),
  facebook: (
    <path d="M14.5 8H17V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v5h4v-5h3l.6-4H13V9c0-.6.4-1 1-1h.5Z" />
  ),
  telegram: (
    <>
      <path d="M21 4 3 11l7 2 2 7 9-16Z" />
      <path d="m10 13 4 4" />
    </>
  ),
  tiktok: (
    <>
      <path d="M14 3v10.4a4.2 4.2 0 1 1-4.2-4.2" />
      <path d="M14 6c1.1 2 2.8 3.1 5 3.4" />
    </>
  ),
  email: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  location: (
    <>
      <path d="M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  catalog: (
    <>
      <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4V4Z" />
      <path d="M9 8h6" />
      <path d="M9 12h5" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" />
    </>
  ),
  design: (
    <>
      <path d="m4 20 4.5-1 9.8-9.8a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z" />
      <path d="m14 7 3 3" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  dashboard: (
    <>
      <rect x="4" y="4" width="6" height="7" rx="1.5" />
      <rect x="14" y="4" width="6" height="5" rx="1.5" />
      <rect x="4" y="15" width="6" height="5" rx="1.5" />
      <rect x="14" y="13" width="6" height="7" rx="1.5" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2-5.5A8.4 8.4 0 1 1 21 11.5Z" />
      <path d="M8 11h8" />
      <path d="M8 14h5" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1.1-1.1" />
    </>
  ),
};

function ContactIcon({ name = 'link', className = '' }) {
  const icon = iconPaths[name] || iconPaths.link;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}

export default ContactIcon;
