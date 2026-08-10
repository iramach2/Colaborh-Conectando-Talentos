import { ElementType, ReactNode, useEffect, useRef, useState } from 'react';
import { BadgeDollarSign, Brain, Briefcase, Calendar, Check, CheckCheck, ChevronDown, Download, FileText, GraduationCap, Loader2, Mail, MapPin, MessageSquare, Phone, Send, Sparkles, Star, UserRound, X as CloseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CompanyCandidateResumeTestsTab } from './CompanyCandidateResumeTestsTab';
import { parseRecruitmentNote } from '../../hooks/useCompanyApplicantNotes';
import { calculateAge, parseCandidatePhoneData } from '../../utils/companyDashboardUtils';
import { formatExperienceDurationWithPeriod } from '../../utils/candidateResumeCalculations';
import type { ChatMessage } from '../../services/messageService';
import type { CompanyApplicant, DiscReportResult, MbtiReportResult, TemperamentosReportResult } from '../../types/companyDashboard';

type CandidateProfileTab = 'curriculo' | 'anotacoes' | 'mensagens' | 'testes' | 'entrevistas';

interface CompanyCandidateProfileDrawerProps {
  applicant: CompanyApplicant | null;
  activeTab: CandidateProfileTab;
  setActiveTab: (tab: CandidateProfileTab) => void;
  isExportingResume: boolean;
  onDownloadResume: () => void;
  onClose: () => void;
  notesText: string;
  setNotesText: (text: string) => void;
  notesRating: number;
  setNotesRating: (rating: number) => void;
  isSavingNotes: boolean;
  onSaveNotes: () => void | Promise<void>;
  chatMessages: ChatMessage[];
  newMessageText: string;
  setNewMessageText: (text: string) => void;
  isSendingMessage: boolean;
  isFetchingChat: boolean;
  onOpenMessages: (applicant: CompanyApplicant) => void | Promise<void>;
  onSendMessage: () => void | Promise<void>;
  interviewsContent: ReactNode;
  onViewDisc: (result: DiscReportResult) => void;
  onViewMbti: (result: MbtiReportResult) => void;
  onViewQuestions: (result: CompanyApplicant) => void;
  onViewTemperamentos: (result: TemperamentosReportResult) => void;
  onViewCustom: (result: CompanyApplicant) => void;
  onRequestDisc: (applicant: CompanyApplicant) => void | Promise<void>;
  onRequestMbti: (applicant: CompanyApplicant) => void | Promise<void>;
  onRequestQuestions: (applicant: CompanyApplicant) => void | Promise<void>;
  onRequestTemperamentos: (applicant: CompanyApplicant) => void | Promise<void>;
  onRequestCustom: (applicant: CompanyApplicant) => void | Promise<void>;
  stageOptions: string[];
  onUpdateApplicantStatus: (applicationId: string, status: string) => void | Promise<void>;
  profileMode?: 'process' | 'talentBank';
}

type InfoItem = { label: string; value: ReactNode; icon?: ElementType };
type InfoGroup = { id: string; items: InfoItem[] };

type DrawerTab = { id: CandidateProfileTab; label: string; icon: ElementType; activeClass: string; underlineClass: string; hoverClass: string };

const drawerTabs: DrawerTab[] = [
  { id: 'curriculo', label: 'Perfil do candidato', icon: UserRound, activeClass: 'text-[#940dff]', underlineClass: 'bg-[#940dff]', hoverClass: 'hover:text-[#940dff]' },
  { id: 'anotacoes', label: 'Anotações', icon: FileText, activeClass: 'text-[#ffa303]', underlineClass: 'bg-[#ffc24b]', hoverClass: 'hover:text-[#ffa303]' },
  { id: 'mensagens', label: 'Mensagens', icon: MessageSquare, activeClass: 'text-[#533af6]', underlineClass: 'bg-[#533af6]', hoverClass: 'hover:text-[#533af6]' },
  { id: 'testes', label: 'Testes realizados', icon: Brain, activeClass: 'text-[#2f9f6b]', underlineClass: 'bg-[#63e1a5]', hoverClass: 'hover:text-[#2f9f6b]' },
  { id: 'entrevistas', label: 'Entrevistas', icon: Calendar, activeClass: 'text-[#940dff]', underlineClass: 'bg-[#940dff]', hoverClass: 'hover:text-[#940dff]' },
];

const getApplicantName = (applicant: CompanyApplicant) => applicant.candidate_name || applicant.name || applicant.talentMatched?.name || 'Candidato sem nome';
const getApplicantInitials = (applicant: CompanyApplicant) => {
  const words = getApplicantName(applicant).trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return getApplicantName(applicant).slice(0, 2).toUpperCase();
};
const getLocation = (applicant: CompanyApplicant) => [applicant.city || applicant.talentMatched?.city, applicant.state || applicant.talentMatched?.state].filter(Boolean).join(', ') || 'Local não informado';
const getEducationHeadline = (applicant: CompanyApplicant) => {
  const education = applicant.talentMatched?.educations?.[0];
  if (education?.course && education?.institution) return `${education.course} - ${education.institution}`;
  if (education?.course) return education.course;
  if (education?.institution) return education.institution;
  return applicant.talentMatched?.education || 'Formação não informada';
};

type ProfileExperience = { duration?: string; startDate?: string; endDate?: string | null; current?: boolean };
const formatExperienceDuration = (experience: ProfileExperience) => {
  const durationWithPeriod = formatExperienceDurationWithPeriod(experience.startDate, experience.endDate, Boolean(experience.current));
  if (durationWithPeriod) return durationWithPeriod;
  if (experience.duration?.trim()) return experience.duration;
  if (!experience.startDate) return 'Período não informado';
  const startDate = new Date(experience.startDate);
  const endDate = experience.current ? new Date() : new Date(experience.endDate || '');
  if (Number.isNaN(startDate.getTime()) || (!experience.current && Number.isNaN(endDate.getTime()))) return 'Período não informado';
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  if (months < 0) { years -= 1; months += 12; }
  const parts = [years > 0 ? `${years} ano${years > 1 ? 's' : ''}` : '', months > 0 ? `${months} mês${months > 1 ? 'es' : ''}` : ''].filter(Boolean);
  return parts.length === 0 ? 'Menos de 1 mês' : `${parts.join(' e ')}${experience.current ? ' - atual' : ''}`;
};

const EmptyState = ({ text }: { text: string }) => <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-8 text-center text-[12px] font-medium text-slate-400">{text}</div>;
const Section = ({ title, children }: { title: string; icon?: ElementType; children: ReactNode }) => <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)]"><div className="mb-4 flex items-center"><h4 className="text-sm font-semibold tracking-tight text-[#343241]">{title}</h4></div>{children}</section>;
const InfoGrid = ({ groups }: { groups: InfoGroup[] }) => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-5 xl:grid-cols-4">
    {groups.map((group) => (
      <div key={group.id} className="min-w-0 space-y-4">
        {group.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {Icon && <Icon size={12} className="stroke-[2.4]" />}
                {item.label}
              </span>
              <div className="mt-0.5 break-words text-[12px] font-medium text-slate-500">{item.value || 'Não informado'}</div>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

const TagList = ({ values }: { values?: string[] }) => {
  if (!values || values.length === 0) return <EmptyState text="Nenhuma habilidade cadastrada." />;
  return <div className="flex flex-wrap gap-2">{values.map((value, index) => <span key={`${value}-${index}`} className="rounded-xl border border-[#63e1a5]/20 bg-[#63e1a5]/14 px-3 py-2 text-[12px] font-medium text-[#2f9f6b]">{value}</span>)}</div>;
};

export function CompanyCandidateProfileDrawer({
  applicant,
  activeTab,
  setActiveTab,
  isExportingResume,
  onDownloadResume,
  onClose,
  notesText,
  setNotesText,
  notesRating,
  setNotesRating,
  isSavingNotes,
  onSaveNotes,
  chatMessages,
  newMessageText,
  setNewMessageText,
  isSendingMessage,
  isFetchingChat,
  onOpenMessages,
  onSendMessage,
  interviewsContent,
  onViewDisc,
  onViewMbti,
  onViewQuestions,
  onViewTemperamentos,
  onViewCustom,
  onRequestDisc,
  onRequestMbti,
  onRequestQuestions,
  onRequestTemperamentos,
  onRequestCustom,
  stageOptions,
  onUpdateApplicantStatus,
  profileMode = 'process',
}: CompanyCandidateProfileDrawerProps) {
  const parsedPhone = applicant ? parseCandidatePhoneData(applicant.candidate_phone || applicant.phone || applicant.talentMatched?.phone || '') : null;
  const displayPhone = parsedPhone?.phone || applicant?.phone || applicant?.talentMatched?.phone || '';
  const talent = applicant?.talentMatched;
  const birthDate = talent?.birth_date;
  const age = birthDate ? calculateAge(birthDate) : talent?.age;
  const profilePicture = applicant?.profile_pic || talent?.profile_pic;
  const pcdValue = (talent as { is_pcd?: boolean | null } | undefined)?.is_pcd ?? (applicant as { is_pcd?: boolean | null } | null)?.is_pcd;
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const isTalentBankProfile = profileMode === 'talentBank';
  const visibleActiveTab: CandidateProfileTab = isTalentBankProfile ? 'curriculo' : activeTab;
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const shouldRestoreMessageFocusRef = useRef(false);

  const focusMessageInput = () => {
    window.setTimeout(() => messageInputRef.current?.focus(), 0);
  };

  const handleSendMessage = () => {
    if (isSendingMessage || !newMessageText.trim()) return;

    shouldRestoreMessageFocusRef.current = true;
    void onSendMessage();
    focusMessageInput();
  };
  const visibleDrawerTabs = isTalentBankProfile ? drawerTabs.filter((tab) => tab.id === 'curriculo') : drawerTabs;

  useEffect(() => {
    if (!applicant) return;
    const parsedData = parseCandidatePhoneData(applicant.candidate_phone || applicant.phone || applicant.talentMatched?.phone || '');
    const parsedNote = parseRecruitmentNote(parsedData.notes || '');
    setNotesText(parsedNote.text);
    setNotesRating(parsedNote.rating);
  }, [applicant?.id, applicant?.candidate_phone, applicant?.phone, applicant?.talentMatched?.phone, setNotesRating, setNotesText]);

  useEffect(() => {
    if (!applicant || !isTalentBankProfile || activeTab === 'curriculo') return;
    setActiveTab('curriculo');
  }, [activeTab, applicant, isTalentBankProfile, setActiveTab]);

  useEffect(() => {
    if (!applicant || isTalentBankProfile || activeTab !== 'mensagens') return;
    onOpenMessages(applicant);
  }, [activeTab, applicant, isTalentBankProfile, onOpenMessages]);

  useEffect(() => {
    if (isSendingMessage || !shouldRestoreMessageFocusRef.current) return;

    shouldRestoreMessageFocusRef.current = false;
    focusMessageInput();
  }, [isSendingMessage]);

  const personalGroups: InfoGroup[] = applicant ? [
    { id: 'identificacao', items: [{ label: 'E-mail', value: applicant.candidate_email || applicant.email || talent?.email, icon: Mail }, { label: 'Telefone', value: displayPhone, icon: Phone }] },
    { id: 'localizacao', items: [{ label: 'Local', value: getLocation(applicant), icon: MapPin }, { label: 'Gênero', value: talent?.gender, icon: UserRound }] },
    { id: 'nascimento', items: [{ label: 'PCD', value: pcdValue === true ? 'Sim' : 'Não', icon: UserRound }, { label: 'Idade', value: age ? `${age} anos` : '', icon: Calendar }] },
    { id: 'trabalho', items: [{ label: 'Pretensão salarial', value: talent?.salary, icon: BadgeDollarSign }, { label: 'Primeiro emprego', value: talent?.first_job ? 'Sim' : talent?.first_job === false ? 'Não' : '', icon: Briefcase }] },
  ] : [];

  return (
    <AnimatePresence>
      {applicant && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/25 backdrop-blur-sm" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="relative z-10 flex h-full w-full max-w-6xl flex-col overflow-hidden border-l border-white/80 bg-[#fbf9ff] shadow-[0_24px_80px_rgba(57,39,96,0.20)]">
            <header className="shrink-0 px-6 pb-4 pt-5 text-left">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="order-2 flex min-w-0 items-center gap-4 lg:order-1">
                  <button type="button" onClick={() => profilePicture && setIsPhotoOpen(true)} disabled={!profilePicture} className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#940dff]/10 bg-[#940dff]/10 text-sm font-semibold text-[#940dff] transition-all ${profilePicture ? 'cursor-zoom-in hover:ring-4 hover:ring-[#940dff]/10' : 'cursor-default'}`} title={profilePicture ? 'Ver foto ampliada' : 'Foto não cadastrada'}>
                    {profilePicture ? <img src={profilePicture} alt="Foto do candidato" className="h-full w-full object-cover" /> : getApplicantInitials(applicant)}
                  </button>
                  <div className="min-w-0">
                    <h3 className="truncate text-[20px] font-semibold tracking-tight text-[#343241]">{getApplicantName(applicant)}</h3>
                    <p className="mt-0 truncate text-[12px] font-medium leading-tight text-slate-400">{getEducationHeadline(applicant)}</p>
                  </div>
                </div>
                <div className="order-1 flex w-full min-w-0 flex-nowrap items-center justify-end gap-2 lg:order-2 lg:w-auto">
                  {!isTalentBankProfile && stageOptions.length > 0 && applicant.id && (
                    <div className="relative min-w-0 flex-1 lg:flex-none">
                      <select value={applicant.status || ''} onChange={(event) => onUpdateApplicantStatus(applicant.id || '', event.target.value)} className="h-8 w-full appearance-none rounded-xl border border-[#940dff]/15 bg-white px-3 pr-8 text-[12px] font-semibold text-slate-500 shadow-sm outline-none transition-all hover:border-[#940dff]/25 focus:border-[#940dff]/40 focus:ring-2 focus:ring-[#940dff]/10 lg:min-w-[160px]" title="Mover candidato de etapa">
                        {stageOptions.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  )}
                  <button type="button" onClick={onDownloadResume} disabled={isExportingResume} className="flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-[#940dff] bg-white px-3 text-[12px] font-semibold text-[#940dff] transition-all hover:bg-[#f3e5ff] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-4">{isExportingResume ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}Baixar PDF</button>
                  {!isTalentBankProfile && applicant.id && <button type="button" onClick={() => onUpdateApplicantStatus(applicant.id || '', 'Reprovado')} className="h-8 shrink-0 rounded-full border border-[#ff4b8c] bg-white px-3 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/10 active:scale-[0.98] sm:px-4">Reprovar</button>}
                  <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95 sm:h-[34px] sm:w-[34px]" title="Fechar perfil"><CloseIcon size={17} className="stroke-[2.4]" /></button>
                </div>
              </div>
              <div className="mt-5 -mx-6 flex items-center gap-3 overflow-x-auto px-6 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {visibleDrawerTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = visibleActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex h-[38px] min-w-[150px] shrink-0 items-center justify-center gap-2 bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors sm:shrink ${isActive ? tab.activeClass : `text-slate-500 ${tab.hoverClass}`}`}
                    >
                      <Icon size={14} className="stroke-[2.4]" />
                      <span className="truncate">{tab.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="candidate-profile-tab-underline"
                          className={`absolute inset-x-3 bottom-0 h-[3px] rounded-full ${tab.underlineClass}`}
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </header>
            {visibleActiveTab === 'curriculo' && (
              <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
                <div className="space-y-4">
                  <Section title="Dados pessoais" icon={UserRound}><InfoGrid groups={personalGroups} /></Section>
                  <Section title="Resumo profissional" icon={FileText}><p className="whitespace-pre-line text-[13px] font-medium leading-relaxed text-slate-500">{talent?.summary || applicant.summary || 'Resumo profissional não preenchido.'}</p></Section>
                  <Section title="Experiências" icon={Briefcase}>
                    {talent?.experiences && talent.experiences.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {talent.experiences.map((experience, index) => (
                          <div key={`${experience.role || 'cargo'}-${index}`} className="rounded-2xl border border-slate-200/80 bg-white/70 p-4">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                              <div><h5 className="text-sm font-semibold text-[#343241]">{experience.role || 'Cargo não informado'}</h5><p className="text-[12px] font-medium text-slate-500">{experience.company || 'Empresa não informada'}</p></div>
                              <span className="text-[11px] font-semibold text-[#533af6]">{formatExperienceDuration(experience)}</span>
                            </div>
                            {experience.description && <p className="mt-3 whitespace-pre-line text-[12px] font-medium leading-relaxed text-slate-500">{experience.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : <EmptyState text={talent?.first_job ? 'Candidato informou estar em busca do primeiro emprego.' : 'Nenhuma experiência cadastrada.'} />}
                  </Section>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Section title="Habilidades" icon={Sparkles}><TagList values={talent?.skills} /></Section>
                    <Section title="Formação acadêmica" icon={GraduationCap}>
                      {talent?.educations && talent.educations.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
                          {talent.educations.map((education, index) => (
                            <div key={`${education.course || 'curso'}-${index}`} className="rounded-2xl border border-slate-200/80 bg-white/70 p-4">
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                <div><h5 className="text-sm font-semibold text-[#343241]">{education.course || 'Curso não informado'}</h5><p className="text-[12px] font-medium text-slate-500">{education.institution || 'Instituição não informada'}</p></div>
                                <span className="text-[11px] font-semibold text-[#533af6]">{education.gradYear || 'Ano não informado'}</span>
                              </div>
                              {education.status && <p className="mt-2 text-[12px] font-medium text-slate-500">{education.status}</p>}
                            </div>
                          ))}
                        </div>
                      ) : <EmptyState text="Nenhuma formação cadastrada." />}
                    </Section>
                  </div>
                </div>
              </div>
            )}

            {visibleActiveTab === 'anotacoes' && (
              <div className="flex-1 overflow-y-auto px-6 pb-6 text-left no-scrollbar">
                <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div><h4 className="text-sm font-semibold tracking-tight text-[#343241]">Anotações da empresa</h4><p className="mt-1 text-[12px] font-medium text-slate-400">Registre observações internas e classifique o candidato para acompanhamento do processo.</p></div>
                    <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Classificação</span><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((star) => { const isSelected = star <= notesRating; return <button key={star} type="button" onClick={() => setNotesRating(notesRating === star ? 0 : star)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#ffc24b] transition-all hover:bg-[#ffc24b]/16" title={`${star} estrela${star > 1 ? 's' : ''}`}><Star size={16} className="stroke-[2.3]" fill={isSelected ? '#ffc24b' : 'none'} /></button>; })}</div></div>
                  </div>
                  <div className="mt-5">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400" htmlFor="candidate-company-notes">Anotações</label>
                    <textarea id="candidate-company-notes" value={notesText} onChange={(event) => setNotesText(event.target.value)} maxLength={1500} placeholder="Escreva observações sobre postura, aderência à vaga, próximos passos ou pontos de atenção..." className="mt-2 min-h-[240px] w-full resize-none rounded-2xl border border-[#ffc24b]/22 bg-white/90 px-4 py-3 text-[13px] font-medium leading-relaxed text-slate-500 outline-none transition-all placeholder:text-slate-300 focus:border-[#ffc24b]/45 focus:ring-4 focus:ring-[#ffc24b]/24" />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-[11px] font-medium text-slate-400">{notesText.length}/1500 caracteres</span><button type="button" onClick={onSaveNotes} disabled={isSavingNotes} className="flex h-[34px] items-center gap-2 rounded-xl border border-[#ffc24b] bg-[#ffc24b] px-5 text-[12px] font-semibold text-white shadow-md shadow-[#ffc24b]/20 transition-all hover:bg-[#e5a72e] disabled:cursor-not-allowed disabled:opacity-50">{isSavingNotes ? <Loader2 size={14} className="animate-spin" /> : null}{isSavingNotes ? 'Salvando...' : 'Salvar anotações'}</button></div>
                  </div>
                </section>
              </div>
            )}

            {visibleActiveTab === 'mensagens' && (
              <div className="flex-1 overflow-y-auto px-6 pb-6 text-left no-scrollbar">
                <section className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="border-b border-slate-200/70 px-5 py-4"><h4 className="text-sm font-semibold tracking-tight text-[#343241]">Conversa com o candidato</h4><p className="mt-1 text-[12px] font-medium text-slate-400">Envie mensagens sobre a vaga e acompanhe o histórico de contato.</p></div>
                  <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-5">
                    {isFetchingChat ? <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-slate-400"><Loader2 className="mb-3 animate-spin text-[#533af6]" size={22} /><span className="text-[11px] font-semibold uppercase tracking-wide">Carregando conversa...</span></div> : chatMessages.length === 0 ? <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#533af6]/10 text-[#533af6]"><MessageSquare size={22} /></div><p className="text-sm font-semibold text-[#343241]">Nenhuma mensagem ainda</p><p className="mt-1 max-w-sm text-[12px] font-medium leading-relaxed text-slate-400">Escreva a primeira mensagem abaixo para iniciar o contato com o candidato.</p></div> : (
                      <div className="flex flex-col gap-3">{chatMessages.map((message, index) => { const isCompany = message.sender_type === 'company'; return <div key={message.id || index} className={`flex max-w-[82%] flex-col ${isCompany ? 'self-end items-end' : 'self-start items-start'}`}><div className={`flex min-h-8 items-center rounded-xl px-4 py-1.5 text-[12px] font-medium leading-relaxed shadow-sm ${isCompany ? 'rounded-br-md bg-[#533af6] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-500'}`}><p className="whitespace-pre-wrap break-words">{message.content || message.message}</p></div><span className="mt-1 flex items-center gap-1 px-1 text-[10px] font-medium text-slate-400">{message.created_at ? new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}{isCompany ? (message.read ? <CheckCheck size={13} className="text-[#63e1a5]" aria-label="Mensagem lida" /> : <Check size={13} className="text-slate-300" aria-label="Mensagem enviada" />) : null}</span></div>; })}</div>
                    )}
                  </div>
                  <div className="border-t border-slate-200/70 bg-white/90 p-4"><div className="flex items-center gap-2"><input ref={messageInputRef} type="text" value={newMessageText} onChange={(event) => setNewMessageText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !isSendingMessage && newMessageText.trim()) handleSendMessage(); }} placeholder="Digite sua mensagem..." disabled={isSendingMessage} className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-medium text-slate-500 outline-none transition-all placeholder:text-slate-300 focus:border-[#533af6]/50 focus:ring-4 focus:ring-[#533af6]/10" /><button type="button" onClick={handleSendMessage} disabled={isSendingMessage || !newMessageText.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#533af6] bg-[#533af6] text-white shadow-md shadow-[#533af6]/15 transition-all hover:bg-[#4326e5] disabled:cursor-not-allowed disabled:opacity-50" aria-label={isSendingMessage ? 'Enviando mensagem' : 'Enviar mensagem'} title={isSendingMessage ? 'Enviando...' : 'Enviar'}><span className="sr-only">{isSendingMessage ? 'Enviando...' : 'Enviar'}</span>{isSendingMessage ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} className="stroke-[2.4]" />}</button></div></div>
                </section>
              </div>
            )}
            {visibleActiveTab === 'testes' && (
              <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
                <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <CompanyCandidateResumeTestsTab applicant={applicant} onViewDisc={onViewDisc} onViewMbti={onViewMbti} onViewQuestions={onViewQuestions} onViewTemperamentos={onViewTemperamentos} onViewCustom={onViewCustom} onRequestDisc={onRequestDisc} onRequestMbti={onRequestMbti} onRequestQuestions={onRequestQuestions} onRequestTemperamentos={onRequestTemperamentos} onRequestCustom={onRequestCustom} />
                </div>
              </div>
            )}

            {visibleActiveTab === 'entrevistas' && (
              <div className="flex-1 overflow-y-auto px-6 pb-6 text-left no-scrollbar">
                {interviewsContent}
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {isPhotoOpen && profilePicture && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-6 backdrop-blur-sm" onClick={() => setIsPhotoOpen(false)}>
                <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }} transition={{ type: 'spring', damping: 24, stiffness: 260 }} className="relative max-h-[86vh] max-w-[86vw] rounded-3xl shadow-[0_28px_90px_rgba(15,23,42,0.30)]" onClick={(event) => event.stopPropagation()}>
                  <button type="button" onClick={() => setIsPhotoOpen(false)} className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-lg transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95" title="Fechar foto"><CloseIcon size={17} className="stroke-[2.4]" /></button>
                  <img src={profilePicture} alt={`Foto de ${getApplicantName(applicant)}`} className="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
