import { type Dispatch, type SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CheckCircle2, ChevronRight, Share2 } from 'lucide-react';

interface CompanyPublishedJobLinkModalProps {
  publishedJobLink: string | null;
  hasCopiedPublishedLink: boolean;
  setHasCopiedPublishedLink: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}

export const CompanyPublishedJobLinkModal = ({
  publishedJobLink,
  hasCopiedPublishedLink,
  setHasCopiedPublishedLink,
  onClose
}: CompanyPublishedJobLinkModalProps) => (
  <AnimatePresence>
    {publishedJobLink && (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-lg bg-white rounded-[5px] shadow-2xl p-8 text-center overflow-hidden border border-slate-100"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#63e1a5] via-primary-500 to-[#533af6]" />

          <div className="mx-auto w-16 h-16 bg-[#63e1a5]/14 rounded-full flex items-center justify-center text-[#63e1a5] mb-6 mt-2 ring-8 ring-[#63e1a5]/14">
            <CheckCircle2 size={36} />
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Vaga Publicada com Sucesso!
          </h3>

          <p className="text-slate-500 text-sm font-medium mb-8 max-w-sm mx-auto leading-relaxed">
            Sua vaga já está ativa no sistema. Use o link exclusivo abaixo para atrair candidatos diretamente de suas redes sociais ou canais de comunicação.
          </p>

          <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 mb-8 flex items-center justify-between gap-3 text-left">
            <div className="overflow-hidden flex-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">LINK DE DIVULGAÇÃO</p>
              <p className="text-xs font-bold text-slate-800 truncate select-all">{publishedJobLink}</p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(publishedJobLink).then(() => {
                  setHasCopiedPublishedLink(true);
                  setTimeout(() => setHasCopiedPublishedLink(false), 3000);
                });
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${
                hasCopiedPublishedLink
                  ? 'bg-[#63e1a5] text-white shadow-lg shadow-[#63e1a5]/15'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {hasCopiedPublishedLink ? (
                <><Check size={12} /> Copiado</>
              ) : (
                <><Share2 size={12} /> Copiar</>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-600/10 transition-all flex items-center justify-center gap-2"
          >
            <span>Ir Para Minhas Vagas</span>
            <ChevronRight size={14} />
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
