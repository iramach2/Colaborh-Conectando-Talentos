import { CSSProperties, ReactNode } from 'react';

interface CandidateAssessmentIntroCardProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  instructions: ReactNode[];
  startLabel: string;
  iconClassName?: string;
  iconStyle?: CSSProperties;
  startButtonStyle?: CSSProperties;
  onBack: () => void;
  onStart: () => void;
}

export function CandidateAssessmentIntroCard({
  icon,
  title,
  description,
  instructions,
  startLabel,
  iconClassName = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff] shadow-sm',
  iconStyle,
  startButtonStyle,
  onBack,
  onStart,
}: CandidateAssessmentIntroCardProps) {
  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200/70 bg-white/85 p-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)] md:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className={iconClassName} style={iconStyle}>{icon}</div>
          <div className="min-w-0">
            <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">{title}</h2>
            <p className="mt-2 max-w-2xl text-[12px] font-medium leading-relaxed text-slate-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-5">
        <h3 className="text-[14px] font-semibold text-[#343241]">Instruções importantes</h3>
        <ul className="mt-3 space-y-2 text-[12px] font-medium leading-relaxed text-slate-500">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#940dff]" />
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onStart}
          className="h-8 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
          style={startButtonStyle}
        >
          {startLabel}
        </button>
      </div>
    </section>
  );
}
