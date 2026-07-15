import { JournalMatch } from "../../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { BookOpen, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";

interface JournalCardProps {
  journal: JournalMatch;
  index: number;
}

export function JournalCard({ journal, index }: JournalCardProps) {
  // Ensure we have fallbacks for undefined properties to prevent crashes
  const metrics = journal.metrics || {};
  const breakdown = journal.breakdown || {};
  const indexing = Array.isArray(metrics.indexing) ? metrics.indexing : [];
  const warnings = Array.isArray(journal.warnings) ? journal.warnings : [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 text-xs shrink-0">
              {index + 1}
            </span>
            <CardTitle className="text-xl" dir="ltr">
              <span className="text-slate-800">{journal.name || "Unknown Journal"}</span>
              {journal.url && (
                <a 
                  href={journal.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center ml-2 text-indigo-500 hover:text-indigo-700 transition-colors"
                  title="Visit Journal"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1.5" dir="ltr">
            <BookOpen size={14} className="text-slate-400" />
            <span>Publisher: {journal.publisher || "Unknown"}</span>
          </CardDescription>
        </div>
        
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-black text-indigo-600">{journal.matchScore || 0}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Match Score</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">المقاييس (Metrics)</h4>
            <div className="grid grid-cols-2 gap-3" dir="ltr">
              <MetricBox label="Impact Score" value={metrics.impactFactor} />
              <MetricBox label="Quartile" value={metrics.quartile} />
              <MetricBox label="APC" value={metrics.apc} />
              <MetricBox label="Review Speed" value={metrics.reviewSpeed} />
            </div>
            {indexing.length > 0 && (
              <div className="mt-3" dir="ltr">
                <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">Indexing</span>
                <div className="flex flex-wrap gap-1.5">
                  {indexing.map((idx, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{idx}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              نصيحة للقبول (Advice)
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
              {journal.advice || "No advice provided."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">التبرير (Justification)</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {journal.justification || "No justification provided."}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">تفاصيل التقييم (Breakdown)</h4>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs" dir="ltr">
              <BreakdownItem label="Topic Match" value={breakdown.topic} max={30} />
              <BreakdownItem label="Quality" value={breakdown.quality} max={20} />
              <BreakdownItem label="Acceptance" value={breakdown.acceptance} max={15} />
              <BreakdownItem label="Speed" value={breakdown.speed} max={10} />
              <BreakdownItem label="APC Suitability" value={breakdown.apc} max={10} />
              <BreakdownItem label="Publisher Rep" value={breakdown.publisher} max={10} />
              <BreakdownItem label="Spread/Reach" value={breakdown.spread} max={5} />
            </div>
          </div>
          
          {warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle size={16} />
                تحذيرات (Warnings)
              </h4>
              <ul className="list-disc list-inside text-xs text-red-600 space-y-1 bg-red-50 p-2 rounded-md border border-red-100">
                {warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="bg-slate-50 p-2 rounded border border-slate-100 flex flex-col">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{label}</span>
      <span className="text-sm font-semibold text-slate-700">{value || "N/A"}</span>
    </div>
  );
}

function BreakdownItem({ label, value, max }: { label: string; value: number | undefined; max: number }) {
  const val = value || 0;
  // Simple bar visualization
  const pct = Math.min(100, Math.max(0, (val / max) * 100));
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-end">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{val}/{max}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
