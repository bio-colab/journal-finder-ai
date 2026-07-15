import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MainLayout } from "./components/layout/MainLayout";
import { SearchForm } from "./components/forms/SearchForm";
import { ResultsView } from "./components/results/ResultsView";
import { SettingsModal } from "./components/forms/SettingsModal";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { useAnalyze } from "./hooks/useAnalyze";
import { SearchPayload } from "./types";

function AppContent() {
  const { settings } = useSettings();
  const { analyze, data, loading, error, clear } = useAnalyze();
  const [showSettings, setShowSettings] = useState(false);

  const handleSearch = (payload: Omit<SearchPayload, "aiSettings">) => {
    analyze({ ...payload, aiSettings: settings });
  };

  return (
    <MainLayout onOpenSettings={() => setShowSettings(true)}>
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm"
        >
          <span>{error}</span>
          <button onClick={clear} className="text-red-500 hover:text-red-700 font-bold px-2 py-1">✕</button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!data ? (
          <motion.div 
            key="search"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8 text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">ابحث عن المجلة المثالية لبحثك</h2>
              <p className="text-slate-500 leading-relaxed">
                أدخل عنوان ورقتك البحثية، ملخصها، والكلمات المفتاحية وسيقوم نظامنا بتحليلها ومطابقتها مع المجلات المعتمدة في قاعدة بيانات OpenAlex لترشيح أفضل الخيارات المتاحة لك.
              </p>
            </div>
            <SearchForm onSearch={handleSearch} isLoading={loading} />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsView data={data} onBack={clear} />
          </motion.div>
        )}
      </AnimatePresence>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </MainLayout>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
