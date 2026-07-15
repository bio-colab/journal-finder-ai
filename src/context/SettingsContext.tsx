import { createContext, useContext, useEffect, useState } from "react";
import { AISettings } from "../types";

interface SettingsContextType {
  settings: AISettings;
  updateSettings: (newSettings: AISettings) => void;
}

const defaultSettings: AISettings = {
  provider: "gemini",
  apiKey: "",
  model: "",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(() => {
    try {
      const stored = localStorage.getItem("ai_settings");
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem("ai_settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings: setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
