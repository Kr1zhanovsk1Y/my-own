interface IconProps {
  size?: number;
  className?: string;
}

export function IconSparkles({ size = 18, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5l2.12 6.38a2.5 2.5 0 001.5 1.5L22 11.5l-6.38 2.12a2.5 2.5 0 00-1.5 1.5L12 21.5l-2.12-6.38a2.5 2.5 0 00-1.5-1.5L2 11.5l6.38-2.12a2.5 2.5 0 001.5-1.5z" />
      <path d="M19 2l.67 2.33L22 5l-2.33.67L19 8l-.67-2.33L16 5l2.33-.67z" opacity=".45" />
    </svg>
  );
}

export function IconTarget({ size = 18, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSearch({ size = 18, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function IconFilm({ size = 18, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M7 2v20M17 2v20M2 7h5M2 12h20M2 17h5M17 7h5M17 17h5" />
    </svg>
  );
}

export function IconFilmFilled({ size = 48, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" opacity=".25">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <rect x="3" y="8" width="4" height="3" rx=".5" fill="var(--bg-primary, #0a0908)" />
      <rect x="3" y="13" width="4" height="3" rx=".5" fill="var(--bg-primary, #0a0908)" />
      <rect x="17" y="8" width="4" height="3" rx=".5" fill="var(--bg-primary, #0a0908)" />
      <rect x="17" y="13" width="4" height="3" rx=".5" fill="var(--bg-primary, #0a0908)" />
      <rect x="8" y="6" width="8" height="12" rx="1" fill="var(--bg-primary, #0a0908)" />
    </svg>
  );
}

export function IconDice({ size = 18, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconEmptyState({ size = 64, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" opacity=".12" />
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" opacity=".08" />
      <rect x="18" y="18" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="1.8" opacity=".3" />
      <path d="M24 18v28M40 18v28M18 24h6M18 32h28M18 40h6M40 24h6M40 40h6" stroke="currentColor" strokeWidth="1.5" opacity=".2" />
      <circle cx="32" cy="32" r="4" fill="currentColor" opacity=".15" />
    </svg>
  );
}
