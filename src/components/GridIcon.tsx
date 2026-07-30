const GENERAL_BASE_URL =
  "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/General";

const GRID_FILE_MAP: Record<string, string> = {
  "2x2": "2x2.png",
  "3x3": "3x3.png",
};

interface GridIconProps {
  size: string;
  iconSize?: number;
}

export function GridIcon({ size, iconSize = 22 }: GridIconProps) {
  const file = GRID_FILE_MAP[size];

  if (!file) {
    return <span>{size}</span>;
  }

  const url = `${GENERAL_BASE_URL}/${file}`;

  return (
    <img
      src={url}
      alt={`${size} grid`}
      title={size}
      width={iconSize}
      height={iconSize}
      className="inline-block"
      loading="lazy"
    />
  );
}
