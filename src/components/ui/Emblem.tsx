type EmblemProps = { className?: string; title?: string };

/**
 * Lambang situs: tiga lintasan atletik konsentris dengan satu titik pelari.
 * Bukan logo resmi UPI; ganti dengan logo resmi bila tersedia izin penggunaannya.
 */
export function Emblem({ className = '', title }: EmblemProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <circle cx="24" cy="24" r="23.25" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.75" />
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <rect x="8.5" y="14" width="31" height="20" rx="10" />
        <rect x="12.5" y="18" width="23" height="12" rx="6" strokeOpacity="0.7" />
        <rect x="16.5" y="22" width="15" height="4" rx="2" strokeOpacity="0.45" />
      </g>
      <circle cx="33" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}
