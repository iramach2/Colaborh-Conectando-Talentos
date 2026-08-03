import type { ReactNode } from 'react';

export const vacancyInputClass = 'h-10 w-full min-w-0 max-w-full rounded-xl border !border-[#940dff]/18 !bg-white px-4 text-[12px] font-semibold text-[#343241] !shadow-none outline-none transition-colors placeholder:text-slate-300 focus:!border-[#940dff]/40 focus:!shadow-none focus:!ring-0 disabled:cursor-not-allowed disabled:opacity-50';

export const vacancySelectClass = `${vacancyInputClass} appearance-none cursor-pointer pr-9`;

export const vacancyTextareaClass = 'min-h-[240px] w-full min-w-0 max-w-full resize-y rounded-xl border !border-[#940dff]/18 !bg-white px-4 py-3 text-[12px] font-medium leading-relaxed text-[#343241] !shadow-none outline-none transition-colors placeholder:text-slate-300 focus:!border-[#940dff]/40 focus:!shadow-none focus:!ring-0 disabled:cursor-not-allowed disabled:opacity-50';

export const VacancyFieldLabel = ({ children }: { children: ReactNode }) => (
  <label className="relative top-[9px] z-10 ml-4 inline-flex w-fit bg-white px-2 text-[11px] font-semibold leading-none text-slate-500">
    {children}
  </label>
);
