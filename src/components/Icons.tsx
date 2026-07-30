interface IconProps {
  size?: number;
  className?: string;
}

export function EggIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 3C8.5 3 5 8.5 5 14c0 3.87 3.13 7 7 7s7-3.13 7-7c0-5.5-3.5-11-7-11z"
        fill="#f9d77e"
        stroke="#d4a843"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TimeIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
