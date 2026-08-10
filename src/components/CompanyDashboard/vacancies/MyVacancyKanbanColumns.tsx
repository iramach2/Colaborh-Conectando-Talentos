import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import {
  Brain,
  CalendarDays,
  ChevronDown,
  Download,
  Clock,
  Inbox,
  MapPin,
  MoreHorizontal,
  Star,
  User,
  X,
} from 'lucide-react';
import {
  calculateAge,
  calculateAiMatchScore,
  parseCandidatePhoneData,
} from '../../../utils/companyDashboardUtils';
import { LoadingAnimation } from '../../Loader';
import type { CompanyApplicant, CompanyApplication, CompanyJob } from '../../../types/companyDashboard';

interface MyVacancyKanbanColumnsProps {
  selectedJob: CompanyJob;
  stages: string[];
  stageTests: Record<string, string[]>;
  jobApplicants: CompanyApplicant[];
  isFetchingApplicants: boolean;
  candidateSearch?: string;
  kanbanContainerRef?: React.RefObject<HTMLDivElement | null>;
  onKanbanScroll?: () => void;
  handleUpdateApplicantStatus: (appId: string, newStatus: string) => void;
  isRejectedView: boolean;
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant;
  setSelectedResumeApplicant: (applicant: CompanyApplicant | null) => void;
  handleRequestDiscTest: (applicant: CompanyApplicant) => void;
  handleRequestMbtiTest: (applicant: CompanyApplicant) => void;
  handleRequestTemperamentosTest: (applicant: CompanyApplicant) => void;
  handleRequestQuestions: (applicant: CompanyApplicant) => void;
  handleRequestCustomTest: (applicant: CompanyApplicant) => void;
  canDownloadResumes?: boolean;
  canUseDirectWhatsApp?: boolean;
  onPlanFeatureBlocked?: (feature: string) => void;
}

const matchesSearch = (app: CompanyApplicant, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return [
    app.candidate_name,
    app.name,
    app.candidate_email,
    app.email,
    app.city,
    app.state,
  ].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedQuery));
};

const getNormalizedStage = (app: CompanyApplication, stages: string[], defaultStage: string) => {
  const currentStatus = app.status;
  if (!currentStatus || currentStatus === 'Triagem' || !stages.includes(currentStatus)) return defaultStage;
  return currentStatus;
};

const getTestStatus = (testKey: string, parsedData: ReturnType<typeof parseCandidatePhoneData>) => {
  if (testKey === 'disc') return parsedData.disc;
  if (testKey === 'mbti') return parsedData.mbti;
  if (testKey === 'temperamentos') return parsedData.temperamentos;
  if (testKey === 'perguntas') return parsedData.questions;
  if (testKey === 'customizado') return parsedData.customTest;
  return '';
};

const getTestLabel = (testKey: string) => {
  if (testKey === 'temperamentos') return 'Temp.';
  if (testKey === 'perguntas') return 'Map.';
  if (testKey === 'customizado') return 'Quest.';
  return testKey.toUpperCase();
};
const getAiMatchToneClass = (score: number) => {
  if (score <= 30) return 'text-[#ff4b8c]';
  if (score <= 60) return 'text-[#ffa303]';
  return 'text-[#63e1a5]';
};

const buildWhatsappUrl = (phone: string) => {
  const cleanedPhone = (phone || '').replace(/\D/g, '');
  return `https://wa.me/${cleanedPhone.startsWith('55') ? cleanedPhone : `55${cleanedPhone}`}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Data não informada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data não informada';
  return date.toLocaleDateString('pt-BR');
};

const sanitizeFileName = (value: string) => (
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase() || 'CANDIDATO'
);

const downloadCandidateResumePdf = async (applicant: CompanyApplicant) => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const talent = applicant.talentMatched;
  const name = applicant.candidate_name || applicant.name || talent?.name || 'Candidato sem nome';
  const email = applicant.candidate_email || applicant.email || talent?.email || 'E-mail não informado';
  const phone = parseCandidatePhoneData(applicant.candidate_phone || applicant.phone || '').phone || talent?.phone || 'Telefone não informado';
  const location = [applicant.city || talent?.city, applicant.state || talent?.state].filter(Boolean).join(', ') || 'Local não informado';
  const summary = talent?.summary || applicant.summary || 'Resumo profissional não preenchido.';
  const skills = Array.isArray(talent?.skills) ? talent.skills.join(', ') : (talent?.skills || 'Habilidades não informadas.');

  let y = 18;
  const addLine = (label: string, value: string) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(label.toUpperCase(), 16, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(value || 'Não informado', 178);
    pdf.text(lines, 16, y);
    y += lines.length * 5 + 6;
  };

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text(name.toUpperCase(), 16, y);
  y += 9;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`${email} | ${phone} | ${location}`, 16, y);
  y += 12;

  addLine('Resumo profissional', summary);
  addLine('Habilidades', String(skills));

  const experiences = talent?.experiences || [];
  if (experiences.length > 0) {
    addLine('Experiências', experiences.map((exp) => (
      `${exp.role || 'Cargo não informado'} - ${exp.company || 'Empresa não informada'}\n${exp.description || ''}`
    )).join('\n\n'));
  }

  const educations = talent?.educations || [];
  if (educations.length > 0) {
    addLine('Formação acadêmica', educations.map((edu) => (
      `${edu.course || 'Curso não informado'} - ${edu.institution || 'Instituição não informada'}`
    )).join('\n'));
  }

  pdf.save(`Curriculo_${sanitizeFileName(name)}.pdf`);
};

const getRecruitmentRating = (rawNote = '') => {
  const match = rawNote.match(/^===RATING===(\d)\n?[\s\S]*$/);
  if (!match) return 0;
  return Math.min(5, Math.max(0, Number(match[1]) || 0));
};

const CandidateRatingStars = ({ rating }: { rating: number }) => (
  <div className="flex h-8 items-center justify-center gap-1 px-1" title={rating > 0 ? `${rating} estrela${rating > 1 ? 's' : ''}` : 'Sem avaliação'}>
    {[1, 2, 3, 4, 5].map((star) => {
      const isSelected = star <= rating;
      return (
        <Star
          key={star}
          size={14}
          className={isSelected ? 'text-[#ffc24b]' : 'text-slate-300'}
          fill={isSelected ? '#ffc24b' : 'none'}
        />
      );
    })}
  </div>
);
export const MyVacancyKanbanColumns: React.FC<MyVacancyKanbanColumnsProps> = ({
  selectedJob,
  stages,
  stageTests,
  jobApplicants,
  isFetchingApplicants,
  candidateSearch = '',
  handleUpdateApplicantStatus,
  isRejectedView,
  getFullApplicantInfo,
  setSelectedResumeApplicant,
  handleRequestDiscTest,
  handleRequestMbtiTest,
  handleRequestTemperamentosTest,
  handleRequestQuestions,
  handleRequestCustomTest,
  canDownloadResumes = true,
  canUseDirectWhatsApp = true,
  onPlanFeatureBlocked
}) => {
  const defaultStage = stages[0] || 'Triagem';
  const [activeStage, setActiveStage] = React.useState(defaultStage);
  const [selectedApplicantIds, setSelectedApplicantIds] = React.useState<string[]>([]);
  const [bulkStage, setBulkStage] = React.useState(defaultStage);
  const [bulkTest, setBulkTest] = React.useState('disc');
  const [isBulkDrawerOpen, setIsBulkDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (!stages.includes(activeStage)) {
      setActiveStage(defaultStage);
    }
  }, [activeStage, defaultStage, stages]);

  React.useEffect(() => {
    setBulkStage(defaultStage);
  }, [defaultStage]);

  const getApplicantMatchScore = React.useCallback((applicant: CompanyApplicant) => (
    calculateAiMatchScore(selectedJob, getFullApplicantInfo(applicant))
  ), [selectedJob, getFullApplicantInfo]);

  const sortApplicantsByMatch = React.useCallback((applicants: CompanyApplicant[]) => (
    [...applicants].sort((a, b) => getApplicantMatchScore(b) - getApplicantMatchScore(a))
  ), [getApplicantMatchScore]);

  const visibleApplicants = React.useMemo(
    () => sortApplicantsByMatch(jobApplicants.filter((app) => matchesSearch(app, candidateSearch))),
    [jobApplicants, candidateSearch, sortApplicantsByMatch],
  );

  const applicantsByStage = React.useMemo(() => {
    const grouped = new Map<string, CompanyApplicant[]>();
    stages.forEach((stage) => grouped.set(stage, []));

    visibleApplicants.forEach((app) => {
      const normalizedStatus = String(app.status || '').toLowerCase().trim();
      const isRejected = ['reprovado', 'desclassificado'].includes(normalizedStatus);
      if (isRejected) return;

      const stage = getNormalizedStage(app, stages, defaultStage);
      const current = grouped.get(stage) || [];
      grouped.set(stage, [...current, app]);
    });

    return grouped;
  }, [defaultStage, stages, visibleApplicants]);

  const rejectedApplicants = React.useMemo(
    () => visibleApplicants.filter((app) => ['reprovado', 'desclassificado'].includes(String(app.status || '').toLowerCase().trim())),
    [visibleApplicants],
  );
  const activeApplicants = React.useMemo(() => (
    sortApplicantsByMatch(isRejectedView ? rejectedApplicants : (applicantsByStage.get(activeStage) || []))
  ), [activeStage, applicantsByStage, isRejectedView, rejectedApplicants, sortApplicantsByMatch]);
  const requiredTests = (stageTests[activeStage] || []).filter((test) => (test.split(':')[1] || 'auto') === 'manual');
  const activeApplicantIds = activeApplicants.map((app) => app.id).filter(Boolean) as string[];
  const selectedApplicants = activeApplicants.filter((app) => app.id && selectedApplicantIds.includes(app.id));
  const selectedCount = selectedApplicants.length;
  const allVisibleSelected = activeApplicantIds.length > 0 && activeApplicantIds.every((id) => selectedApplicantIds.includes(id));
  const [mobileBulkActionsHost, setMobileBulkActionsHost] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setMobileBulkActionsHost(document.getElementById('kanban-mobile-bulk-actions-slot'));
  }, []);

  React.useEffect(() => {
    setSelectedApplicantIds((current) => current.filter((id) => activeApplicantIds.includes(id)));
  }, [activeApplicantIds.join('|')]);

  const toggleApplicantSelection = (appId?: string) => {
    if (!appId) return;
    setSelectedApplicantIds((current) => (
      current.includes(appId) ? current.filter((id) => id !== appId) : [...current, appId]
    ));
  };

  const toggleAllVisibleApplicants = () => {
    setSelectedApplicantIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !activeApplicantIds.includes(id));
      return Array.from(new Set([...current, ...activeApplicantIds]));
    });
  };

  const clearBulkSelection = () => setSelectedApplicantIds([]);

  const requestTest = (testKey: string, info: CompanyApplicant) => {
    if (testKey === 'disc') handleRequestDiscTest(info);
    else if (testKey === 'mbti') handleRequestMbtiTest(info);
    else if (testKey === 'temperamentos') handleRequestTemperamentosTest(info);
    else if (testKey === 'perguntas') handleRequestQuestions(info);
    else if (testKey === 'customizado') handleRequestCustomTest(info);
  };

  const handleBulkStageChange = () => {
    selectedApplicants.forEach((app) => handleUpdateApplicantStatus(app.id || '', bulkStage));
    setIsBulkDrawerOpen(false);
    clearBulkSelection();
  };

  const handleBulkRequestTest = () => {
    selectedApplicants.forEach((app) => requestTest(bulkTest, getFullApplicantInfo(app)));
  };

  const handleBulkDownloadResumes = async () => {
    if (!canDownloadResumes) {
      onPlanFeatureBlocked?.('Download de curr?culos dos candidatos');
      return;
    }

    for (const app of selectedApplicants) {
      await downloadCandidateResumePdf(getFullApplicantInfo(app));
    }
  };

  const handleBulkReject = () => {
    selectedApplicants.forEach((app) => handleUpdateApplicantStatus(app.id || '', 'Reprovado'));
    setIsBulkDrawerOpen(false);
    clearBulkSelection();
  };

  const closeBulkDrawer = () => setIsBulkDrawerOpen(false);

  if (isFetchingApplicants) {
    return (
      <div className="bg-white/85 backdrop-blur-md border border-white/70 p-12 rounded-2xl text-center shadow-[0_10px_30px_rgba(106,66,220,0.04)] select-none">
        <LoadingAnimation message="Carregando candidatos..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedCount > 0 && mobileBulkActionsHost && createPortal(
        <button
          type="button"
          onClick={() => setIsBulkDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#533af6] bg-[#533af6] text-white shadow-[0_10px_22px_rgba(83,58,246,0.18)] transition-all hover:bg-[#4630df] active:scale-95"
          title="Ações em massa"
          aria-label="Ações em massa"
        >
          <MoreHorizontal size={16} className="stroke-[2.5]" />
        </button>,
        mobileBulkActionsHost,
      )}
      {!isRejectedView && (
        <div className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {stages.map((stage) => {
            const isActive = activeStage === stage;
            const count = applicantsByStage.get(stage)?.length || 0;

            return (
              <button
                key={stage}
                type="button"
                onClick={() => setActiveStage(stage)}
                className={`relative flex h-[38px] min-w-[150px] shrink-0 cursor-pointer items-center justify-center gap-2 bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors sm:shrink ${
                  isActive
                    ? 'text-[#940dff]'
                    : 'text-slate-500 hover:text-[#940dff]'
                }`}
              >
                <span className="max-w-[120px] truncate">{stage}</span>
                <span className={`text-[11px] font-semibold ${isActive ? 'text-current' : 'text-slate-400'}`}>
                  {count}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="company-kanban-stage-tab-underline"
                    className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#940dff]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}


      {activeApplicants.length > 0 ? (
        <div className="w-full overflow-visible text-left">
          <div className="hidden 2xl:grid grid-cols-[24px_minmax(260px,1fr)_130px_130px_90px_95px_140px_130px_minmax(250px,auto)] relative items-center justify-items-center gap-2 px-4 py-3 min-h-[58px] text-[10px] font-bold uppercase tracking-wide text-slate-500">
            <span className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleAllVisibleApplicants}
                className="bulk-select-checkbox"
                aria-label="Selecionar todos os candidatos"
              />
            </span>
            <span className="justify-self-start">Candidato</span>
            <span className="inline-flex items-center justify-center gap-1.5 text-center"><MapPin size={12} /> Local</span>
            <span className="inline-flex items-center justify-center gap-1.5"><CalendarDays size={12} /> Inscrição</span>
            <span className="text-center">Idade</span>
            <span className="text-center">Match IA</span>
            <span className="text-center">{isRejectedView ? 'Retornar para' : 'Mover para'}</span>
            <span className="text-center">Avaliação</span>
            <span className="h-8 w-[132px] justify-self-end" />
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={() => setIsBulkDrawerOpen(true)}
                className="absolute right-4 top-1/2 h-8 -translate-y-1/2 rounded-xl border border-[#533af6] bg-[#533af6] px-4 text-[12px] font-semibold text-white transition-all hover:bg-[#4630df]"
              >
                Ações em massa
              </button>
            )}
          </div>

          <div className="overflow-visible rounded-2xl bg-white/75 border border-slate-200/70 shadow-[0_10px_28px_rgba(15,23,42,0.035)] divide-y divide-slate-200/70">
          {activeApplicants.map((app, index) => {
            const info = getFullApplicantInfo(app);
            const parsedData = parseCandidatePhoneData(app.candidate_phone || app.phone || '');
            const matchScore = calculateAiMatchScore(selectedJob, info);
            const matchToneClass = getAiMatchToneClass(matchScore);
            const age = info.talentMatched?.birth_date
              ? calculateAge(info.talentMatched.birth_date)
              : info.talentMatched?.age;
            const location = [info.city, info.state].filter(Boolean).join(', ') || 'Local não informado';
            const candidateName = info.candidate_name || info.name || 'Candidato sem nome';
            const candidateEmail = info.candidate_email || info.email || 'E-mail não informado';
            const recruitmentRating = getRecruitmentRating(parsedData.notes || info.notes || '');

            return (
              <div
                key={app.id || `${candidateName}-${index}`}
                className={`px-4 py-3 transition-all hover:bg-white ${index % 2 === 0 ? 'bg-white/95' : 'bg-slate-50/60'}`}
              >
                <div className="2xl:hidden">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={!!app.id && selectedApplicantIds.includes(app.id)}
                      onChange={() => toggleApplicantSelection(app.id)}
                      className="bulk-select-checkbox mt-3"
                      aria-label={"Selecionar " + candidateName}
                    />

                    <button
                      type="button"
                      onClick={() => setSelectedResumeApplicant(info)}
                      className="flex min-w-0 flex-1 items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer group"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#533af6]/15 bg-[#533af6]/10 text-[#533af6]">
                        {info.profile_pic ? (
                          <img src={info.profile_pic} alt="Foto" className="h-full w-full object-cover" />
                        ) : (
                          <User size={17} className="stroke-[2.4]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#343241] transition-colors group-hover:text-[#533af6]">{candidateName}</p>
                        <p className="mt-1 truncate text-[11px] font-medium text-slate-400">{candidateEmail}</p>
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-slate-100 bg-white/70 p-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Local</p>
                      <p className="mt-1 truncate text-[12px] font-medium text-slate-500">{location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Inscrição</p>
                      <p className="mt-1 text-[12px] font-medium text-slate-500">{formatDate(app.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Idade</p>
                      <p className="mt-1 text-[12px] font-medium text-slate-500">{age ? age + ' anos' : 'Não informada'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Match IA</p>
                      <p className={`mt-1 text-[12px] font-semibold ${matchToneClass}`}>{matchScore}%</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3">
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Mover para</p>
                      <div className="relative">
                        <select
                          value={isRejectedView ? (stages[0] || '') : activeStage}
                          onChange={(event) => handleUpdateApplicantStatus(app.id || '', event.target.value)}
                          className="h-8 w-full appearance-none rounded-xl border border-[#533af6]/15 bg-white pl-3 pr-8 text-[12px] font-medium text-slate-500 outline-none shadow-none focus:border-[#533af6]/30 focus:ring-0"
                        >
                          {stages.map((stage) => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Avaliação</p>
                      <CandidateRatingStars rating={recruitmentRating} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                    {requiredTests.map((test) => {
                      const [testKey, trigger = 'auto'] = test.split(':');
                      const testStatus = getTestStatus(testKey, parsedData);
                      const isCompleted = testStatus.startsWith('COMPLETED') || testStatus === 'COMPLETED' || (testStatus && testStatus !== 'PENDING');
                      const isPending = testStatus === 'PENDING';

                      if (isCompleted) return null;

                      return (
                        <button
                          key={testKey}
                          type="button"
                          onClick={() => requestTest(testKey, info)}
                          className={
                            'flex h-8 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-semibold transition-all cursor-pointer ' +
                            (isPending
                              ? 'border-[#ffc24b]/22 bg-[#ffc24b]/16 text-[#ffa303]'
                              : 'border-[#533af6]/15 bg-[#533af6]/10 text-[#533af6] hover:bg-[#533af6] hover:text-white')
                          }
                          title={"Solicitar teste " + testKey.toUpperCase() + " (" + (trigger === 'auto' ? 'Automático' : 'Manual') + ")"}
                        >
                          {isPending ? <Clock size={12} /> : <Brain size={12} />}
                          {isPending ? 'Pendente' : 'Enviar ' + getTestLabel(testKey)}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setSelectedResumeApplicant(info)}
                      className="flex h-8 flex-1 items-center justify-center rounded-full border border-[#940dff] bg-white px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:bg-[#f3e5ff] active:scale-[0.98] cursor-pointer"
                    >
                      Perfil
                    </button>
                    {!isRejectedView && (
                      <button
                        type="button"
                        onClick={() => handleUpdateApplicantStatus(app.id || '', 'Reprovado')}
                        className="flex h-8 flex-1 items-center justify-center rounded-full border border-[#ff4b8c] bg-white px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/10 active:scale-[0.98] cursor-pointer"
                      >
                        Reprovar
                      </button>
                    )}
                    <a
                      href={canUseDirectWhatsApp ? buildWhatsappUrl(parsedData.phone) : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        if (!canUseDirectWhatsApp) {
                          event.preventDefault();
                          onPlanFeatureBlocked?.('Contato direto por WhatsApp');
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#63e1a5]/35 bg-[#63e1a5]/14 text-[#40b87f] transition-all hover:border-[#63e1a5]/55 hover:bg-[#63e1a5] hover:text-white"
                      title="Chamar no WhatsApp"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 2C6.49 2 2 6.47 2 12.01c0 1.91.53 3.78 1.56 5.42L2 23l5.76-1.51c1.58.86 3.37 1.31 5.27 1.31 5.54 0 10.03-4.47 10.03-10.01C23.06 6.47 18.57 2 12.031 2zm5.73 14.1c-.24.68-1.24 1.25-1.9 1.34-.54.07-1.24.08-2 .17-1.24-.16-2.5-1.06-3.69-2.25-1.19-1.19-2.09-2.45-2.25-3.69.09-.76.1-1.46.17-2 .09-.66.66-1.66 1.34-1.9.18-.06.39-.08.57-.08.18 0 .37.01.52.33.21.46.72 1.77.79 1.91.07.15.12.32.02.5-.1.18-.15.3-.3.47-.15.17-.32.39-.46.52-.16.16-.33.33-.14.65.19.32.84 1.39 1.8 2.25.96.86 1.77 1.41 2.09 1.57.32.16.51.12.67-.06.17-.18.72-.84.92-1.12.19-.28.39-.23.65-.13.26.1 1.66.78 1.94.92.28.14.47.21.54.34.08.13.08.76-.16 1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="hidden 2xl:grid 2xl:grid-cols-[24px_minmax(260px,1fr)_130px_130px_90px_95px_140px_130px_minmax(250px,auto)] gap-2 2xl:items-center 2xl:justify-items-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={!!app.id && selectedApplicantIds.includes(app.id)}
                      onChange={() => toggleApplicantSelection(app.id)}
                      className="bulk-select-checkbox"
                      aria-label={`Selecionar ${candidateName}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedResumeApplicant(info)}
                    className="flex items-center gap-3 min-w-0 text-left bg-transparent border-0 p-0 cursor-pointer group justify-self-stretch"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#533af6]/10 text-[#533af6] border border-[#533af6]/15 overflow-hidden flex items-center justify-center shrink-0">
                      {info.profile_pic ? (
                        <img src={info.profile_pic} alt="Foto" className="w-full h-full object-cover" />
                      ) : (
                        <User size={17} className="stroke-[2.4]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#343241] group-hover:text-[#533af6] transition-colors truncate">{candidateName}</p>
                      <p className="text-[11px] font-medium text-slate-400 truncate mt-1">{candidateEmail}</p>
                    </div>
                  </button>

                  <span className="text-[12px] font-medium text-slate-500 truncate text-center max-w-full">{location}</span>

                  <span className="text-[12px] font-medium text-slate-500 text-center">{formatDate(app.created_at)}</span>

                  <span className="text-[12px] font-medium text-slate-500 text-center">{age ? `${age} anos` : 'Não informada'}</span>

                  <span className={`text-center text-[12px] font-semibold ${matchToneClass}`}>{matchScore}%</span>

                  <div className="flex justify-center min-w-0">
                    <div className="relative w-[140px]">
                      <select
                        value={isRejectedView ? (stages[0] || '') : activeStage}
                        onChange={(event) => handleUpdateApplicantStatus(app.id || '', event.target.value)}
                        className="h-8 w-full appearance-none rounded-xl border border-[#533af6]/15 bg-white pl-3 pr-8 text-[12px] font-medium text-slate-500 outline-none shadow-none focus:border-[#533af6]/30 focus:ring-0"
                      >
                        {stages.map((stage) => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>

                  <div className="flex justify-center min-w-0">
                    <CandidateRatingStars rating={recruitmentRating} />
                  </div>

                  <div className="flex flex-wrap 2xl:justify-end gap-2 justify-self-end">
                    {requiredTests.map((test) => {
                      const [testKey, trigger = 'auto'] = test.split(':');
                      const testStatus = getTestStatus(testKey, parsedData);
                      const isCompleted = testStatus.startsWith('COMPLETED') || testStatus === 'COMPLETED' || (testStatus && testStatus !== 'PENDING');
                      const isPending = testStatus === 'PENDING';

                      if (isCompleted) return null;

                      return (
                        <button
                          key={testKey}
                          type="button"
                          onClick={() => requestTest(testKey, info)}
                          className={`h-9 px-3 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isPending
                              ? 'bg-[#ffc24b]/16 text-[#ffa303] border-[#ffc24b]/22'
                              : 'bg-[#533af6]/10 text-[#533af6] border-[#533af6]/15 hover:bg-[#533af6] hover:text-white'
                          }`}
                          title={`Solicitar teste ${testKey.toUpperCase()} (${trigger === 'auto' ? 'Automático' : 'Manual'})`}
                        >
                          {isPending ? <Clock size={12} /> : <Brain size={12} />}
                          {isPending ? 'Pendente' : `Enviar ${getTestLabel(testKey)}`}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setSelectedResumeApplicant(info)}
                      className="flex h-8 items-center justify-center rounded-full border border-[#940dff] bg-white px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:bg-[#f3e5ff] active:scale-[0.98] cursor-pointer"
                    >
                      Perfil
                    </button>
                    {!isRejectedView && (
                    <button
                      type="button"
                      onClick={() => handleUpdateApplicantStatus(app.id || '', 'Reprovado')}
                      className="flex h-8 items-center justify-center rounded-full border border-[#ff4b8c] bg-white px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/10 active:scale-[0.98] cursor-pointer"
                    >
                      Reprovar
                    </button>
                    )}
                    <a
                      href={canUseDirectWhatsApp ? buildWhatsappUrl(parsedData.phone) : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        if (!canUseDirectWhatsApp) {
                          event.preventDefault();
                          onPlanFeatureBlocked?.('Contato direto por WhatsApp');
                        }
                      }}
                      className="h-8 w-8 rounded-full bg-[#63e1a5]/14 hover:bg-[#63e1a5] text-[#40b87f] hover:text-white flex items-center justify-center transition-all border border-[#63e1a5]/35 hover:border-[#63e1a5]/55"
                      title="Chamar no WhatsApp"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 2C6.49 2 2 6.47 2 12.01c0 1.91.53 3.78 1.56 5.42L2 23l5.76-1.51c1.58.86 3.37 1.31 5.27 1.31 5.54 0 10.03-4.47 10.03-10.01C23.06 6.47 18.57 2 12.031 2zm5.73 14.1c-.24.68-1.24 1.25-1.9 1.34-.54.07-1.24.08-2 .17-1.24-.16-2.5-1.06-3.69-2.25-1.19-1.19-2.09-2.45-2.25-3.69.09-.76.1-1.46.17-2 .09-.66.66-1.66 1.34-1.9.18-.06.39-.08.57-.08.18 0 .37.01.52.33.21.46.72 1.77.79 1.91.07.15.12.32.02.5-.1.18-.15.3-.3.47-.15.17-.32.39-.46.52-.16.16-.33.33-.14.65.19.32.84 1.39 1.8 2.25.96.86 1.77 1.41 2.09 1.57.32.16.51.12.67-.06.17-.18.72-.84.92-1.12.19-.28.39-.23.65-.13.26.1 1.66.78 1.94.92.28.14.47.21.54.34.08.13.08.76-.16 1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ) : (
        <div className="bg-white/85 backdrop-blur-md border border-white/70 p-16 rounded-2xl text-center shadow-[0_10px_30px_rgba(106,66,220,0.04)] select-none">
          <div className="w-14 h-14 bg-[#533af6]/10 text-[#533af6] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/50 shadow-sm">
            <Inbox size={24} className="stroke-[2]" />
          </div>
          <h3 className="text-lg font-semibold text-[#343241] tracking-tight mb-1">{isRejectedView ? 'Nenhum candidato reprovado' : 'Nenhum candidato nesta etapa'}</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium leading-relaxed">
            Altere a aba acima para visualizar outros candidatos ou mova candidatos para esta etapa quando avançarem no processo.
          </p>
        </div>
      )}
      {createPortal(
        <AnimatePresence>
          {isBulkDrawerOpen && (
            <div className="fixed inset-0 z-[9999] flex justify-end">
              <motion.div
                className="absolute inset-0 bg-slate-950/28 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeBulkDrawer}
              />
              <motion.aside
                className="company-dashboard-surface relative z-10 h-full w-full max-w-none overflow-y-auto bg-[#fbfaff] p-6 text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:max-w-[420px] sm:border-l sm:border-slate-200/70"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 310 }}
                onClick={(event) => event.stopPropagation()}
              >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="mt-1 text-xl font-semibold text-[#343241]">Ações em massa</h3>
                <p className="mt-1 text-[13px] font-medium text-slate-400">
                  {selectedCount} candidato{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={closeBulkDrawer}
                className="h-9 w-9 rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:text-[#ff4b8c] flex items-center justify-center"
                title="Fechar"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <section className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Mudar etapa</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={bulkStage}
                      onChange={(event) => setBulkStage(event.target.value)}
                      className="h-8 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-[12px] font-medium text-slate-500 outline-none"
                    >
                      {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                  <button type="button" onClick={handleBulkStageChange} className="h-8 rounded-xl border border-[#533af6] bg-[#533af6] px-4 text-[12px] font-semibold text-white transition-all hover:bg-[#4630df]">
                    Aplicar
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Solicitar teste</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={bulkTest}
                      onChange={(event) => setBulkTest(event.target.value)}
                      className="h-8 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-[12px] font-medium text-slate-500 outline-none"
                    >
                      <option value="disc">DISC</option>
                      <option value="mbti">MBTI</option>
                      <option value="temperamentos">Temperamentos</option>
                      <option value="perguntas">Mapeamento</option>
                      <option value="customizado">Questionário</option>
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                  <button type="button" onClick={handleBulkRequestTest} className="h-8 rounded-xl border border-[#940dff] bg-[#940dff] px-4 text-[12px] font-semibold text-white transition-all hover:bg-[#8200e6]">
                    Solicitar
                  </button>
                </div>
              </section>

              <button type="button" onClick={handleBulkDownloadResumes} className="flex h-8 w-full items-center justify-center gap-2 rounded-xl border border-[#63e1a5] bg-[#63e1a5] text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#50cf93]">
                <Download size={14} /> Baixar PDFs
              </button>

              {!isRejectedView && (
                <button type="button" onClick={handleBulkReject} className="h-8 w-full rounded-xl border border-[#ff4b8c] bg-[#ff4b8c] px-4 text-[12px] font-semibold text-white transition-all hover:bg-[#e83a78]">
                  Reprovar selecionados
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  clearBulkSelection();
                  closeBulkDrawer();
                }}
                className="h-8 w-full rounded-xl border border-slate-200 bg-transparent px-4 text-[12px] font-semibold text-slate-400 transition-all hover:text-[#ff4b8c]"
              >
                Limpar seleção
              </button>
            </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};
