const CURRENCY_BASE_URL =
  "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Currency";

const CURRENCY_FILE_MAP: Record<string, string> = {
  Coins: "coins.png",
  Diamonds: "diamonds.png",
  Shards: "shards.png",
  Starpower: "starpower.png",
  Wildcards: "wildcards.png",
  Keys: "keys.png",
};

function getCurrencyImageUrl(currency: string): string | null {
  const file = CURRENCY_FILE_MAP[currency];
  if (!file) return null;
  return `${CURRENCY_BASE_URL}/${file}`;
}

interface CurrencyIconProps {
  currency: string;
  size?: number;
}

export function CurrencyIcon({ currency, size = 18 }: CurrencyIconProps) {
  const url = getCurrencyImageUrl(currency);

  if (!url) return null;

  return (
    <img
      src={url}
      alt={currency}
      title={currency}
      width={size}
      height={size}
      className="inline-block"
      loading="lazy"
    />
  );
}

/**
 * Detects the currency type from a value string like "20,000 Coins" or "1,260 Diamonds"
 * and renders the value with its currency icon.
 */
export function CurrencyValue({ value, size = 18 }: { value: string; size?: number }) {
  const currencies = ["Coins", "Diamonds", "Shards", "Starpower", "Wildcards", "Keys"];
  const found = currencies.find((c) => value.includes(c));

  if (!found) {
    return <span>{value}</span>;
  }

  return (
    <span className="inline-flex items-center gap-1">
      <span>{value.replace(found, "").trim()}</span>
      <CurrencyIcon currency={found} size={size} />
    </span>
  );
}
