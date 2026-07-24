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
    <ResumeSectionCard className="!border-transparent !bg-white !p-0">
      <textarea
        value={summary}
        onChange={(event) => onChange(event.target.value)}
        className={resumeTextareaClass + ' min-h-[300px] resize-none'}
        placeholder="Conte um pouco sobre sua trajetória..."
        rows={11}
      />
      <div className="mt-2 flex justify-end">
        <div className={(isReady ? 'bg-[#63e1a5] text-white' : 'bg-[#ff4b8c]/14 text-[#ff4b8c]') + ' flex h-7 min-w-[92px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-[11px] font-semibold'}>
          {isReady ? <CheckCircle2 size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          {summary.length} / 300
        </div>
      </div>
    </ResumeSectionCard>
  );
}
