import { ReactNode } from 'react';
import { Award, Compass, FileText, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type CandidateTestResultType = 'DISC' | 'MBTI' | 'TEMPERAMENTOS' | 'CUSTOM' | 'QUESTIONS' | null;

interface CandidateTestResultDrawerProps {
  resultType: CandidateTestResultType;
  onClose: () => void;
  children: ReactNode;
}

const getResultTitle = (resultType: CandidateTestResultType) => {
  if (resultType === 'DISC') return 'Relatório comportamental DISC 5.0';
  if (resultType === 'MBTI') return 'Relatório de Personalidade MBTI';
  if (resultType === 'TEMPERAMENTOS') return 'Relatório de Temperamentos';
  if (resultType === 'CUSTOM') return 'Respostas do Questionário Customizado';
  return 'Mapeamento de Perfil (20 Perguntas)';
};

const getResultSubtitle = (resultType: CandidateTestResultType) => (
  resultType === 'CUSTOM' || resultType === 'QUESTIONS'
    ? 'Perguntas e Respostas da Vaga'
    : 'Mapeamento Comportamental Detalhado'
);

const ResultIcon = ({ resultType }: { resultType: CandidateTestResultType }) => {
  if (resultType === 'DISC') return <Award size={20} />;
  if (resultType === 'MBTI') return <Sparkles size={20} />;
  if (resultType === 'TEMPERAMENTOS') return <Compass size={20} />;
  return <FileText size={20} />;
};

export function CandidateTestResultDrawer({ resultType, onClose, children }: CandidateTestResultDrawerProps) {
  return (
    <AnimatePresence>
      {resultType && (
        <div className="fixed inset-0 z-[110] flex justify-end overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-2xl h-full bg-slate-50 shadow-2xl overflow-hidden flex flex-col rounded-l-[24px] rounded-r-none z-10 text-left border-l border-slate-100"
          >
            <div className="p-6 bg-white flex justify-between items-center border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <ResultIcon resultType={resultType} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    {getResultTitle(resultType)}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {getResultSubtitle(resultType)}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-950 rounded-full transition-all cursor-pointer border-0">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
