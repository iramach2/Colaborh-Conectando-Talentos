import { CheckCircle2 } from 'lucide-react';
import { ResumeSectionCard, resumeTextareaClass } from './CandidateResumeEditorPrimitives';

interface CandidateResumeSummaryEditorProps {
  summary: string;
  onChange: (summary: string) => void;
}

export function CandidateResumeSummaryEditor({
  summary,
  onChange,
}: CandidateResumeSummaryEditorProps) {
  const isReady = summary.trim().length >= 300;

  return (
    <ResumeSectionCard>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#343241]">Resumo do perfil</p>
          <p className="mt-1 text-[12px] font-medium text-slate-400">Use um texto direto sobre sua trajetória e objetivos.</p>
        </div>
        <div className={`flex h-7 items-center gap-1.5 rounded-xl px-3 text-[11px] font-semibold ${isReady ? 'bg-[#f3e5ff] text-[#940dff]' : 'bg-[#f3e5ff] text-[#940dff]'}`}>
          {isReady ? <CheckCircle2 size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          {summary.length} / 300
        </div>
      </div>
      <textarea
        value={summary}
        onChange={(event) => onChange(event.target.value)}
        className={`${resumeTextareaClass} min-h-[220px] resize-none`}
        placeholder="Conte um pouco sobre sua trajetória..."
        rows={8}
      />
    </ResumeSectionCard>
  );
}