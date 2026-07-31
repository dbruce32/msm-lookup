interface QuickLink {
  label: string;
  url: string;
  description: string;
  icon: string;
}

const LINKS: QuickLink[] = [
  {
    label: "MSM Wiki",
    url: "https://mysingingmonsters.fandom.com/",
    description: "Official community wiki",
    icon: "📖",
  },
  {
    label: "r/MySingingMonsters",
    url: "https://www.reddit.com/r/MySingingMonsters/",
    description: "Reddit community",
    icon: "💬",
  },
  {
    label: "MSM Discord",
    url: "https://discord.gg/mysingingmonsters",
    description: "Official Discord server",
    icon: "🎮",
  },
  {
    label: "MSM Official Site",
    url: "https://www.bigbluebubble.com/",
    description: "Big Blue Bubble",
    icon: "🌐",
  },
  {
    label: "msm-db API",
    url: "https://dbruce32.github.io/msm-db/",
    description: "Monster data source",
    icon: "🗄️",
  },
];

export function QuickLinks() {
  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-slate-800 text-white">
        <h3 className="text-sm font-semibold">Quick Links</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {LINKS.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-base" aria-hidden="true">{link.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {link.label}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {link.description}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
