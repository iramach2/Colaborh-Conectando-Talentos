import type { ButtonHTMLAttributes, Key, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export const resumeInputClass = 'h-11 w-full min-w-0 max-w-full rounded-xl border !border-[#940dff]/18 !bg-white px-4 text-[12px] font-semibold text-[#343241] !shadow-none outline-none transition-colors placeholder:text-slate-300 focus:!border-[#940dff]/40 focus:!shadow-none focus:!ring-0 disabled:cursor-not-allowed disabled:opacity-50';
export const resumeTextareaClass = 'w-full min-w-0 max-w-full rounded-xl border !border-[#940dff]/18 !bg-white px-4 py-3 text-[12px] font-medium leading-relaxed text-[#343241] outline-none transition-colors placeholder:text-slate-300 focus:!border-[#940dff]/40 focus:!ring-0 disabled:cursor-not-allowed disabled:opacity-50';
export const resumeSelectClass = `${resumeInputClass} appearance-none pr-9`;

export function ResumeFieldLabel({ children }: { children: ReactNode }) {
  return <label className="relative top-[9px] z-10 ml-4 inline-flex w-fit bg-white px-2 text-[11px] font-semibold leading-none text-slate-500">{children}</label>;
}

export function ResumeSectionCard({ children, className = '' }: { children: ReactNode; className?: string; key?: Key }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

export function ResumeEmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/65 px-5 py-10 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
        <Icon size={19} />
      </div>
      <p className="text-[13px] font-semibold text-[#343241]">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-xs text-[12px] font-medium text-slate-400">{description}</p>}
    </div>
  );
}

export function ResumePrimaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-8 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ResumeSecondaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-8 items-center justify-center gap-2 rounded-xl border border-[#940dff] bg-white px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:bg-[#f3e5ff] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ResumeGhostButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-8 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/20 hover:text-[#940dff] active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}