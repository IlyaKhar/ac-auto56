/** Мини-флаг РФ для полей телефона в формах. */
export function RuFlagIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 16" width={28} height={18} aria-hidden>
      <rect width="24" height="5.33" fill="#fff" />
      <rect y="5.33" width="24" height="5.34" fill="#0039a6" />
      <rect y="10.67" width="24" height="5.33" fill="#d52b1e" />
    </svg>
  );
}
