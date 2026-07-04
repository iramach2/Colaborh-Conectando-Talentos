interface CandidateAiParsingOverlayProps {
  isVisible: boolean;
}

export function CandidateAiParsingOverlay({ isVisible }: CandidateAiParsingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white">
      <div className="bg-white/15 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center">
        <div className="w-16 h-16 border-4 border-[#8959f5] border-t-transparent rounded-full animate-spin" />
        <div>
          <h3 className="text-lg font-black uppercase tracking-wider mb-2 text-white">Processando com IA</h3>
          <p className="text-xs text-slate-200 font-semibold leading-relaxed">
            Nossa Inteligência Artificial está lendo seu currículo para extrair os dados e preencher o formulário automaticamente. Aguarde alguns instantes...
          </p>
        </div>
      </div>
    </div>
  );
}
