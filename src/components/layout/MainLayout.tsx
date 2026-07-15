import React from "react";
import { Settings, BookOpen } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
  onOpenSettings: () => void;
}

export function MainLayout({ children, onOpenSettings }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <BookOpen size={24} />
            <h1 className="text-xl font-bold tracking-tight">مُكتشف المجلات الأكاديمية (JournalFinderAI)</h1>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
            title="الإعدادات (Settings)"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="mt-auto py-8 text-center text-slate-400 text-sm">
        <p>مُكتشف المجلات الأكاديمية - مدعوم بالذكاء الاصطناعي و OpenAlex API</p>
      </footer>
    </div>
  );
}
