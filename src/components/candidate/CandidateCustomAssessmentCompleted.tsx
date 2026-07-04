import type { CustomQuestion } from '../../types/candidate';

interface CandidateCustomAssessmentCompletedProps {
  customTestQuestions: CustomQuestion[];
  selectedCustomTestResult: Record<string, string>;
  onBackToTests: () => void;
}

export function CandidateCustomAssessmentCompleted({
  customTestQuestions,
  selectedCustomTestResult,
  onBackToTests,
}: CandidateCustomAssessmentCompletedProps) {
  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-3xl mx-auto space-y-8 text-left animate-fade-in">
      <div className="text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-black">✓</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Questionário Customizado Enviado!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Suas respostas foram gravadas com sucesso</p>
      </div>

      <div className="space-y-4">
        {customTestQuestions.map((question, index) => {
          const answerText = selectedCustomTestResult[question.id] || 'Nenhuma resposta gravada.';
          return (
            <div key={question.id || index} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white bg-emerald-600 shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
                  {question.question}
                </h4>
              </div>
              <div className="p-4 bg-white border border-slate-150 rounded-2xl text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-line shadow-xs">
                {answerText}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onBackToTests}
          className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10"
        >
          Voltar para Testes
        </button>
      </div>
    </div>
  );
}
