import { useState, useEffect } from "react";
import { useSettings } from "../../context/SettingsContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { X, Key, Bot } from "lucide-react";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  // Focus lock or basic escape to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon />
            إعدادات الذكاء الاصطناعي
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Bot size={16} className="text-indigo-500" />
                مزود الخدمة (Provider)
              </label>
              <select
                value={localSettings.provider}
                onChange={(e) => setLocalSettings({ ...localSettings, provider: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="gemini">Google Gemini</option>
                <option value="mistral">Mistral AI</option>
                <option value="openrouter">OpenRouter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Key size={16} className="text-indigo-500" />
                مفتاح API
              </label>
              <Input
                type="password"
                placeholder="اتركه فارغاً لاستخدام المفتاح الافتراضي (Gemini فقط)"
                value={localSettings.apiKey || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                className="text-left"
                dir="ltr"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                مفتاحك يُحفظ في متصفحك محلياً ولا يُخزن في أي قاعدة بيانات.
              </p>
            </div>

            {localSettings.provider === "openrouter" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  نموذج OpenRouter
                </label>
                <Input
                  type="text"
                  placeholder="e.g. anthropic/claude-3-opus"
                  value={localSettings.model || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                  className="text-left"
                  dir="ltr"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ الإعدادات</Button>
        </div>
      </div>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}
