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
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">MSM Lookup</h1>
            <p className="text-sm text-gray-500">
              Monster Breeding Search Engine
            </p>
          </div>
        </header>
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4 text-sm text-gray-500">
            Data from{" "}
            <a
              href="https://dbruce32.github.io/msm-db/"
              className="underline hover:text-gray-700"
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
