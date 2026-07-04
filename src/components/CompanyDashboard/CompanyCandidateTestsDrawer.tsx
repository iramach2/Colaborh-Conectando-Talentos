import { Brain, BrainCircuit, ChevronRight, Clock, X as CloseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  CompanyApplicant,
  CompanyApplication,
  CompanyJob,
  DiscReportResult,
  MbtiReportResult,
  TemperamentosReportResult,
} from '../../types/companyDashboard';
import { parseCandidatePhoneData } from '../../utils/companyDashboardUtils';

type TestStatus = 'COMPLETED' | 'PENDING' | 'NONE' | string;

interface CompanyCandidateTestsDrawerProps {
  applicant: CompanyApplicant | null;
  selectedJob: CompanyJob | null;
  onClose: () => void;
  onApplicantChange: (applicant: CompanyApplicant | null) => void;
  onAlert: (message: string, title?: string) => void;
  onRequestDisc: (application: CompanyApplication) => void;
  onRequestQuestions: (application: CompanyApplication) => void;
  onRequestMbti: (application: CompanyApplication) => void;
  onRequestTemperamentos: (application: CompanyApplication) => void;
  onViewDisc: (result: DiscReportResult) => void;
  onViewQuestions: (applicant: CompanyApplicant) => void;
  onViewMbti: (result: MbtiReportResult) => void;
  onViewTemperamentos: (result: TemperamentosReportResult) => void;
  onViewCustom: (applicant: CompanyApplicant) => void;
  onRequestCustom: (application: CompanyApplication) => void;
}

interface TestCardProps {
  title: string;
  description: string;
  status: TestStatus;
  completedLabel: string;
  completedClassName: string;
  onView: () => void;
  onRequest: () => void;
}

const statusLabel = (status: TestStatus) => {
  if (status === 'COMPLETED') return 'Concluido';
  if (status === 'PENDING') return 'Pendente';
  return 'Nao Solicitado';
};

const statusClassName = (status: TestStatus) => {
  if (status === 'COMPLETED') return 'bg-[#63e1a5]/14 text-[#2f9f6b] border border-[#63e1a5]/20';
  if (status === 'PENDING') return 'bg-[#ffc24b]/16 text-[#ffa303] border border-[#ffc24b]/22';
  return 'bg-slate-50 text-slate-500 border border-slate-150';
};

function TestCard({
  title,
  description,
  status,
  completedLabel,
  completedClassName,
  onView,
  onRequest,
}: TestCardProps) {
  return (
    <div className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 transition-all shadow-2xs">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h6 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight">{title}</h6>
          <p className="text-[10px] font-semibold text-slate-500 mt-1">{description}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 select-none ${statusClassName(status)}`}>
          {statusLabel(status)}
        </span>
      </div>

      <div className="mt-3 flex justify-end">
        {status === 'COMPLETED' ? (
          <button
            type="button"
            onClick={onView}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border ${completedClassName}`}
          >
            <span>{completedLabel}</span>
            <ChevronRight size={10} className="shrink-0" />
          </button>
        ) : status === 'PENDING' ? (
          <div className="flex items-center gap-1 text-[10px] text-[#ffa303] font-black uppercase tracking-wider bg-[#ffc24b]/16 px-2.5 py-1.5 rounded-lg border border-[#ffc24b]/20">
            <Clock size={10} className="animate-spin text-[#ffc24b]" /> Aguardando Candidato
          </div>
        ) : (
          <button
            type="button"
            onClick={onRequest}
            className="px-3.5 py-1.5 bg-[#8959f5] hover:bg-[#7846e3] text-white font-extrabold rounded-full uppercase text-[10px] transition-all cursor-pointer border-0 shadow-sm active:scale-95"
          >
            Solicitar Teste
          </button>
        )}
      </div>
    </div>
  );
}

export function CompanyCandidateTestsDrawer({
  applicant,
  selectedJob,
  onClose,
  onApplicantChange,
  onAlert,
  onRequestDisc,
  onRequestQuestions,
  onRequestMbti,
  onRequestTemperamentos,
  onViewDisc,
  onViewQuestions,
  onViewMbti,
  onViewTemperamentos,
  onViewCustom,
  onRequestCustom,
}: CompanyCandidateTestsDrawerProps) {
  const requestIfAllowed = (
    request: (application: CompanyApplication) => void,
    statusKey: string,
    message: string
  ) => {
    if (!applicant) return;
    if (applicant.normalizedStatus !== 'Testes') {
      onAlert(message, 'Aviso');
      return;
    }
    request(applicant.fullApp || applicant);
    onApplicantChange({ ...applicant, [statusKey]: 'PENDING' });
  };

  const customTestStatus = (() => {
    if (!applicant) return 'NONE';
    const parsedData = parseCandidatePhoneData(applicant.candidate_phone || '');
    if (parsedData.customTest?.startsWith('PENDING')) return 'PENDING';
    if (parsedData.customTest?.startsWith('COMPLETED')) return 'COMPLETED';
    return 'NONE';
  })();

  return (
    <AnimatePresence>
      {applicant && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[4px]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none h-full shadow-2xl flex flex-col border-l border-slate-100/80 z-10 text-left font-sans"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#533af6]/10 rounded-xl flex items-center justify-center text-[#533af6] shadow-sm border border-[#533af6]/15">
                  <Brain size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                    Testes do Candidato
                  </h4>
                  <p className="text-[10px] font-black text-[#8959f5] uppercase tracking-widest mt-1.5 truncate max-w-[220px]" title={applicant.fullApp.candidate_name}>
                    {applicant.fullApp.candidate_name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20 no-scrollbar">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/60">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Resumo da Candidatura</h5>
                <div className="space-y-1.5 text-[10px] font-bold text-slate-650 uppercase tracking-wider">
                  <p>Vaga: <span className="text-slate-800 font-extrabold">{selectedJob?.title}</span></p>
                  <p>Etapa Atual: <span className="text-[#8959f5] font-black">{applicant.status || applicant.normalizedStatus}</span></p>
                  <p>Match IA: <span className="text-[#40b87f] font-black">{applicant.matchScore}%</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <BrainCircuit size={14} className="text-[#8959f5]" /> Avaliacoes Disponiveis
                </h5>

                <div className="space-y-3">
                  {(applicant.normalizedStatus === 'Testes' || applicant.discStatus === 'COMPLETED' || applicant.discStatus === 'PENDING') && (
                    <TestCard
                      title="DISC"
                      description="Avaliacao de perfil comportamental (Dominancia, Influencia, Estabilidade, Conformidade)"
                      status={applicant.discStatus}
                      completedLabel="Ver Perfil DISC"
                      completedClassName="bg-[#ff4b8c]/10 hover:bg-[#ff4b8c]/15 text-[#ff4b8c] border-[#ff4b8c]/15"
                      onView={() => onViewDisc({
                        applicantName: applicant.fullApp.candidate_name,
                        completedAt: applicant.discDate || applicant.fullApp.created_at,
                        D: Number(applicant.D || 0),
                        I: Number(applicant.I || 0),
                        S: Number(applicant.S || 0),
                        C: Number(applicant.C || 0),
                      })}
                      onRequest={() => requestIfAllowed(
                        onRequestDisc,
                        'discStatus',
                        "A solicitacao do teste DISC so e permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'."
                      )}
                    />
                  )}

                  {(applicant.normalizedStatus === 'Testes' || applicant.questionsStatus === 'COMPLETED' || applicant.questionsStatus === 'PENDING') && (
                    <TestCard
                      title="Mapeamento de Perfil"
                      description="Perguntas estruturadas sobre expectativas e experiencias"
                      status={applicant.questionsStatus}
                      completedLabel="Ver Respostas"
                      completedClassName="bg-[#533af6]/10 hover:bg-[#533af6]/15 text-[#533af6] border-[#533af6]/15"
                      onView={() => onViewQuestions({
                        ...applicant,
                        completedAt: applicant.questionsDate || applicant.fullApp.created_at,
                      })}
                      onRequest={() => requestIfAllowed(
                        onRequestQuestions,
                        'questionsStatus',
                        "A solicitacao do Mapeamento so e permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'."
                      )}
                    />
                  )}

                  {(applicant.normalizedStatus === 'Testes' || applicant.mbtiStatus === 'COMPLETED' || applicant.mbtiStatus === 'PENDING') && (
                    <TestCard
                      title="MBTI"
                      description="Indicador de tipos de personalidade com 16 perfis possiveis"
                      status={applicant.mbtiStatus}
                      completedLabel={`Ver Perfil: ${applicant.mbtiResponses?.type || 'MBTI'}`}
                      completedClassName="bg-violet-50 hover:bg-violet-100/70 text-violet-700 border-violet-150/40"
                      onView={() => onViewMbti({
                        applicantName: applicant.fullApp.candidate_name,
                        completedAt: applicant.mbtiDate || applicant.fullApp.created_at,
                        ...applicant.mbtiResponses,
                      })}
                      onRequest={() => requestIfAllowed(
                        onRequestMbti,
                        'mbtiStatus',
                        "A solicitacao do teste MBTI so e permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'."
                      )}
                    />
                  )}

                  {(applicant.normalizedStatus === 'Testes' || applicant.temperamentosStatus === 'COMPLETED' || applicant.temperamentosStatus === 'PENDING') && (
                    <TestCard
                      title="Temperamentos"
                      description="Identificacao de temperamentos (Sanguineo, Colerico, Melancolico, Fleumatico)"
                      status={applicant.temperamentosStatus}
                      completedLabel={`Ver Perfil: ${applicant.temperamentosResponses?.type || 'TEMP'}`}
                      completedClassName="bg-sky-50 hover:bg-sky-100/70 text-sky-700 border-sky-150/40"
                      onView={() => onViewTemperamentos({
                        applicantName: applicant.fullApp.candidate_name,
                        completedAt: applicant.temperamentosDate || applicant.fullApp.created_at,
                        ...applicant.temperamentosResponses,
                      })}
                      onRequest={() => requestIfAllowed(
                        onRequestTemperamentos,
                        'temperamentosStatus',
                        "A solicitacao do Teste de Temperamentos so e permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'."
                      )}
                    />
                  )}

                  {(applicant.normalizedStatus === 'Testes' || customTestStatus === 'COMPLETED' || customTestStatus === 'PENDING') && (
                    <TestCard
                      title="Questionario Customizado"
                      description="Perguntas customizadas criadas para esta vaga"
                      status={customTestStatus}
                      completedLabel="Ver Respostas"
                      completedClassName="bg-[#63e1a5]/14 hover:bg-[#63e1a5]/20 text-[#2f9f6b] border-[#63e1a5]/20"
                      onView={() => onViewCustom({
                        ...applicant,
                        completedAt: applicant.customTestDate || applicant.fullApp.created_at,
                      })}
                      onRequest={() => {
                        if (applicant.normalizedStatus !== 'Testes') {
                          onAlert("A solicitacao de Questionario Customizado so e permitida na etapa 'Testes'. Mova o candidato para a coluna 'Testes'.", 'Aviso');
                          return;
                        }
                        onRequestCustom(applicant.fullApp);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
