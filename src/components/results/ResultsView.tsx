import { AnalysisResponse } from "../../types";
import { JournalCard } from "./JournalCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ArrowRight, Beaker, FileText, Target, Tag } from "lucide-react";

interface ResultsViewProps {
  data: AnalysisResponse;
  onBack: () => void;
}

export function ResultsView({ data, onBack }: ResultsViewProps) {
  // Ensure we have fallbacks
  const analysis = data?.analysis || {
    mainDiscipline: "N/A",
    subDiscipline: "N/A",
    studyType: "N/A",
    methodology: "N/A",
    suggestedKeywords: []
  };
  const journals = data?.journals || [];
  const suggestedKeywords = Array.isArray(analysis.suggestedKeywords) ? analysis.suggestedKeywords : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">نتائج التحليل والمجلات المقترحة</h2>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowRight size={16} />
          عودة للبحث
        </Button>
      </div>

      {/* Analysis Overview */}
      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
            <Target size={20} className="text-indigo-600" />
            تحليل الورقة البحثية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalysisItem icon={<BookIcon />} label="التخصص الرئيسي" value={analysis.mainDiscipline} />
            <AnalysisItem icon={<Target size={16} />} label="التخصص الدقيق" value={analysis.subDiscipline} />
            <AnalysisItem icon={<FileText size={16} />} label="نوع الدراسة" value={analysis.studyType} />
            <AnalysisItem icon={<Beaker size={16} />} label="المنهجية" value={analysis.methodology} />
          </div>
          
          {suggestedKeywords.length > 0 && (
            <div className="mt-5 pt-4 border-t border-indigo-100/50">
              <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5 mb-2">
                <Tag size={14} /> الكلمات المفتاحية المقترحة:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedKeywords.map((kw, i) => (
                  <Badge key={i} variant="outline" className="bg-white border-indigo-200 text-indigo-700">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Journals List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BookIcon />
          المجلات المرشحة ({journals.length})
        </h3>
        
        {journals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <BookIcon className="w-12 h-12 mb-3 text-slate-300" />
              <p>لم يتم العثور على مجلات مناسبة. جرب تغيير كلمات البحث أو الفلاتر.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {journals.map((journal, index) => (
              <JournalCard key={index} journal={journal} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalysisItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-indigo-500/70 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
        <span className="text-indigo-400">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function BookIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
