"use client";

import { useState } from "react";

interface CollapsibleProps {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Collapsible({ title, defaultOpen = true, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-2.5 bg-slate-200 border-b border-slate-300 flex items-center justify-between text-left hover:bg-slate-250 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-700 text-sm">{title}</span>
        <span className={`text-slate-400 text-xs transition-transform ${open ? "rotate-0" : "-rotate-90"}`}>
          ▼
        </span>
      </button>
      {open && children}
    </div>
  );
}
