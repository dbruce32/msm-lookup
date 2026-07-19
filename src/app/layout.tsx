import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MSM Lookup — Monster Breeding Search",
  description:
    "Search breeding combinations for My Singing Monsters. Find pairs, times, and enhanced times for any monster.",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e293b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-100">
        <header className="bg-slate-800 text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">MSM Lookup</h1>
            <p className="text-sm text-slate-300">
              Monster Breeding Search Engine
            </p>
          </div>
        </header>
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="bg-slate-800 text-slate-400">
          <div className="max-w-3xl mx-auto px-4 py-4 text-sm">
            Data from{" "}
            <a
              href="https://dbruce32.github.io/msm-db/"
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              msm-db
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
