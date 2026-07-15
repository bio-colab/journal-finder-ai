import { useState } from "react";
import { SearchPayload } from "../../types";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Input } from "../ui/Input";
import { Search, Sparkles, Filter } from "lucide-react";

interface SearchFormProps {
  onSearch: (payload: Omit<SearchPayload, "aiSettings">) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  
  const [filters, setFilters] = useState({
    apc: "Any",
    language: "Any",
    quartiles: [] as string[],
    indexing: [] as string[],
    accessType: "Any",
    scopes: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !abstract.trim()) {
      alert("الرجاء إدخال العنوان أو الملخص على الأقل.");
      return;
    }
    onSearch({ title, abstract, keywords, filters });
  };

  const handleCheckboxChange = (group: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[group] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={24} />
              تفاصيل البحث
            </CardTitle>
            <CardDescription>
              أدخل تفاصيل ورقتك البحثية ليقوم الذكاء الاصطناعي بتحليلها واقتراح أفضل المجلات.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="search-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">عنوان البحث (Title)</label>
                <Input
                  type="text"
                  placeholder="Enter the title of your paper..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  dir="auto"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                  <span>الملخص (Abstract)</span>
                  <span className="text-xs text-slate-400 font-normal">اختياري ولكنه موصى به جداً</span>
                </label>
                <textarea
                  placeholder="Paste your abstract here..."
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                  dir="auto"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">الكلمات المفتاحية (Keywords)</label>
                <Input
                  type="text"
                  placeholder="e.g. Machine Learning, NLP, Healthcare"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  dir="auto"
                />
                <p className="text-xs text-slate-500 mt-1">افصل بين الكلمات بفاصلة ( , )</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="text-indigo-600" size={20} />
              التفضيلات والفلاتر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">نطاق المجلة (Scope)</label>
              <div className="space-y-2">
                {[
                  { value: 'Global', label: 'عالمي (Global)' },
                  { value: 'Local (Iraqi)', label: 'محلي (عراقي)' },
                  { value: 'Arab', label: 'عربي (Arab)' }
                ].map(scope => (
                  <label key={scope.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.scopes.includes(scope.value)}
                      onChange={() => handleCheckboxChange('scopes', scope.value)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {scope.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">لغة النشر</label>
              <select 
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Any">غير محدد (Any)</option>
                <option value="English">الإنجليزية (English)</option>
                <option value="Arabic">العربية (Arabic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">نوع الوصول (Access)</label>
              <select 
                value={filters.accessType}
                onChange={(e) => setFilters({...filters, accessType: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Any">أي نوع (Any)</option>
                <option value="Open Access">مفتوح الوصول (Open Access)</option>
                <option value="Subscription">اشتراك (Subscription)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">رسوم النشر (APC)</label>
              <select 
                value={filters.apc}
                onChange={(e) => setFilters({...filters, apc: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Any">غير محدد (Any)</option>
                <option value="Free">مجاني (No APC)</option>
                <option value="Paid">مدفوع (Paid)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">الفهرسة (Indexing)</label>
              <div className="space-y-2">
                {['Scopus', 'Web of Science (WoS)', 'DOAJ', 'PubMed'].map(idx => (
                  <label key={idx} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.indexing.includes(idx)}
                      onChange={() => handleCheckboxChange('indexing', idx)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {idx}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">التصنيف (Quartile)</label>
              <div className="grid grid-cols-2 gap-2">
                {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                  <label key={q} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.quartiles.includes(q)}
                      onChange={() => handleCheckboxChange('quartiles', q)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {q}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          form="search-form"
          className="w-full shadow-md"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التحليل والبحث...
            </>
          ) : (
            <>
              <Search className="ml-2" size={20} />
              البحث عن مجلات
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
