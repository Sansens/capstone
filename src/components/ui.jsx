import React from "react";

const paths = {
  home: <><path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16.5 3.2a4 4 0 0 1 0 7.6" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></>,
  search: <><circle cx="11" cy="11" r="7.5" /><path d="m21 21-4.3-4.3" /></>,
  bell: <><path d="M18 8.5A6 6 0 0 0 6 8.5c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5" /><path d="M13.7 20.5a2 2 0 0 1-3.4 0" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  check: <><path d="m20 6.5-11 11-5-5" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7.5 8.5 4.5-4.5 4.5 4.5M12 4v12" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7.5 10.5 4.5 4.5 4.5-4.5M12 15V3" /></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  phone: <><path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-2.9 18.7 18.7 0 0 1-5.7-5.7A19 19 0 0 1 2.9 4.6 2 2 0 0 1 5 2.4h2.6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.7 10a15 15 0 0 0 5.4 5.4l1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></>,
  mail: <><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m3 6.5 9 6 9-6" /></>,
  shield: <><path d="M12 22s8-4 8-10V5.5L12 2.5 4 5.5V12c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M7 16v-4M12 16V8M17 16v-6" /></>,
  briefcase: <><rect x="2.5" y="7" width="19" height="13" rx="2.5" /><path d="M8.5 7V5.5A2 2 0 0 1 10.5 3.5h3a2 2 0 0 1 2 2V7M2.5 12.5h19" /></>,
  heart: <><path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 1 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1z" /></>,
  card: <><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><circle cx="8.5" cy="10.5" r="2.2" /><path d="M5 16.2c.6-1.5 1.9-2.3 3.5-2.3s2.9.8 3.5 2.3M15 10h4M15 14h4" /></>,
  rings: <><circle cx="9" cy="14.5" r="5.2" /><circle cx="15" cy="14.5" r="5.2" /><path d="m12 3 2.5 3h-5z" /></>,
  alert: <><path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3.1L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 16.5h.01" /></>,
  megaphone: <><path d="m3 11 15-6v13L3 12z" /><path d="M6.5 12.6V18a2.5 2.5 0 0 0 5 0v-3.6M20 10a3 3 0 0 1 0 5" /></>,
  layers: <><path d="m12 2.5 9 5-9 5-9-5z" /><path d="m3 12.5 9 5 9-5M3 17l9 5 9-5" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>,
  filter: <><path d="M3 5h18l-7 8.5V21l-4-2.5v-5z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" /></>,
  inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5.2 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.8A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.2z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21v-1.5a5.5 5.5 0 0 1 5.5-5.5h4a5.5 5.5 0 0 1 5.5 5.5V21" /></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></>,
  eyeOff: <><path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.1 3.7M6.2 6.3C3.5 8 2 12 2 12s3.5 6 10 6c1 0 1.9-.2 2.7-.5" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
};

export function Icon({ name, size = 20, className = "", strokeWidth = 1.7 }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.spark}
    </svg>
  );
}

const toneMap = {
  Menunggu: "tone-wait",
  Diproses: "tone-progress",
  Selesai: "tone-done",
  Terverifikasi: "tone-done",
  Tetap: "tone-done",
  Kontrak: "tone-wait",
  "Pindah masuk": "tone-info",
  "Pindah keluar": "tone-wait",
  Tinggi: "tone-danger",
  Sedang: "tone-wait",
  Rendah: "tone-info",
};

export function Badge({ children, tone }) {
  const cls = tone || toneMap[children] || "tone-info";
  return <span className={`badge ${cls}`}>{children}</span>;
}
