import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Brain, Compass, HelpCircle, Thermometer, X } from 'lucide-react';
import { MBTI_QUESTIONS, TEMPERAMENTOS_QUESTIONS } from '../../../data/assessmentProfiles';
import { perguntasDISC } from '../../../data/discQuestions';
import { QUESTIONS_CATEGORIES } from '../../../data/profileQuestions';

type TestGuideId = 'profile' | 'disc' | 'mbti' | 'temperamentos';

type GuideQuestion = {
  id: number;
  question: string;
  group?: string;
  options?: string[];
};

type TestGuide = {
  id: TestGuideId;
  title: string;
  badge: string;
  color: string;
  iconColor: string;
  icon: typeof HelpCircle;
  desc: string;
  target: string;
  time: string;
};

const testGuides: TestGuide[] = [
  {
    id: 'profile',
    title: 'Mapeamento de Perfil',
    badge: 'Exclusivo Colaborh',
    color: 'border-[#ffc24b]/24 bg-[#ffc24b]/16 text-[#ffa303]',
    iconColor: '#ffa303',
    icon: HelpCircle,
    desc: 'Avaliação qualitativa com perguntas descritivas sobre histórico, conquistas, trabalho em equipe e resiliência diante de desafios.',
    target: 'Ajuda a entender comunicação escrita, profundidade técnica e alinhamento com valores da cultura corporativa.',
    time: '20-30 min',
  },
  {
    id: 'disc',
    title: 'DISC 5.0',
    badge: 'Padrão de mercado',
    color: 'border-[#63e1a5]/24 bg-[#63e1a5]/14 text-[#40b87f]',
    iconColor: '#63e1a5',
    icon: Brain,
    desc: 'Mapeia tendências naturais em dominância, influência, estabilidade e conformidade.',
    target: 'Essencial para entender relacionamento, ritmo de execução, resiliência e adaptação a ambientes dinâmicos.',
    time: '10 min',
  },
  {
    id: 'mbti',
    title: 'MBTI',
    badge: 'Comportamento e foco',
    color: 'border-[#533af6]/18 bg-[#533af6]/10 text-[#533af6]',
    iconColor: '#533af6',
    icon: Compass,
    desc: 'Categoriza perfis em 16 tipos de personalidade combinando dicotomias mentais.',
    target: 'Útil para posições de liderança e estratégia, identificando motivadores e padrões de decisão.',
    time: '15 min',
  },
  {
    id: 'temperamentos',
    title: 'Temperamentos',
    badge: 'Energia e estilo',
    color: 'border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c]',
    iconColor: '#ff4b8c',
    icon: Thermometer,
    desc: 'Analisa perfil emocional a partir dos quatro temperamentos: sanguíneo, colérico, fleumático e melancólico.',
    target: 'Ajuda a interpretar respostas sob pressão, estabilidade emocional e compatibilidade motivacional com a equipe.',
    time: '8 min',
  },
];

const getGuideQuestions = (guideId: TestGuideId): GuideQuestion[] => {
  if (guideId === 'profile') {
    let questionIndex = 0;

    return Object.values(QUESTIONS_CATEGORIES).flatMap((category) =>
      category.questions.map((question) => {
        questionIndex += 1;
        return {
          id: questionIndex,
          group: category.title,
          question,
        };
      })
    );
  }

  if (guideId === 'disc') {
    return perguntasDISC.map((item, index) => ({
      id: index + 1,
      question: item.pergunta,
      options: Object.entries(item.opcoes).map(([key, value]) => `${key}: ${value}`),
    }));
  }

  if (guideId === 'mbti') {
    return MBTI_QUESTIONS.map((item) => ({
      id: item.id,
      question: item.text,
      options: [
        `A: ${item.optionA.text}`,
        `B: ${item.optionB.text}`,
      ],
    }));
  }

  return TEMPERAMENTOS_QUESTIONS.map((item) => ({
    id: item.id,
    question: item.text,
    options: Object.entries(item.options).map(([key, value]) => `${key}: ${value}`),
  }));
};

const QuestionPreviewDrawer = ({ guide, onClose }: { guide: TestGuide; onClose: () => void }) => {
  const questions = useMemo(() => getGuideQuestions(guide.id), [guide.id]);
  const GuideIcon = guide.icon;

  return createPortal(
    <div className="company-dashboard-surface fixed inset-0 z-[2147483647] flex justify-end bg-slate-900/20 backdrop-blur-sm">
      <button type="button" aria-label="Fechar visualização de perguntas" className="absolute inset-0 cursor-default" onClick={onClose} />
      <aside className="company-dashboard-surface relative z-10 flex h-full w-full max-w-2xl flex-col bg-[#fbf9ff] shadow-[-20px_0_50px_rgba(15,23,42,0.14)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-7 py-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 bg-white shadow-[0_6px_16px_rgba(15,23,42,0.06)]" style={{ color: guide.iconColor }}>
              <GuideIcon size={21} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">{guide.title}</h2>
              <p className="mt-1 text-[12px] font-medium text-slate-400">{questions.length} perguntas cadastradas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-[0_6px_16px_rgba(15,23,42,0.06)] transition-all hover:text-[#940dff] active:scale-95"
            aria-label="Fechar"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div className="space-y-3">
            {questions.map((item) => (
              <div key={`${guide.id}-${item.id}`} className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff]">
                    {item.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    {item.group && <p className="mb-1 text-[11px] font-semibold text-slate-400">{item.group}</p>}
                    <p className="text-[13px] font-semibold leading-relaxed text-[#343241]">{item.question}</p>
                    {item.options && item.options.length > 0 && (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {item.options.map((option) => (
                          <div key={option} className="rounded-xl border border-slate-200/70 bg-[#fbfaff] px-3 py-2 text-[12px] font-medium leading-relaxed text-slate-500">
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
};

export const CompanyAssessmentGuide = () => {
  const [selectedGuide, setSelectedGuide] = useState<TestGuide | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {testGuides.map((guide) => {
          const GuideIcon = guide.icon;

          return (
            <div
              key={guide.title}
              className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] transition-all hover:border-[#940dff]/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 bg-white shadow-[0_6px_16px_rgba(15,23,42,0.06)]" style={{ color: guide.iconColor }}>
                    <GuideIcon size={21} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold text-[#343241]">{guide.title}</h3>
                    <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-500">{guide.desc}</p>
                  </div>
                </div>
                <span className={`inline-flex h-7 shrink-0 items-center rounded-xl border px-3 text-[11px] font-semibold ${guide.color}`}>
                  {guide.badge}
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4 text-[12px] font-medium leading-relaxed text-slate-500">
                <span className="font-semibold text-[#343241]">Objetivo:</span> {guide.target}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-[12px] font-medium text-slate-400">
                <span className="font-semibold text-slate-500">{guide.time}</span>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(guide)}
                  className="inline-flex h-8 items-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95"
                >
                  Ver perguntas
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedGuide && <QuestionPreviewDrawer guide={selectedGuide} onClose={() => setSelectedGuide(null)} />}
    </>
  );
};