import React from 'react';
import { Brain, Check, Clock, Eye, MapPin, MessageSquare, User } from 'lucide-react';
import {
  calculateAge,
  calculateAiMatchScore,
  parseCandidatePhoneData,
} from '../../../utils/companyDashboardUtils';
import type { CompanyApplicant, CompanyApplication, CompanyJob } from '../../../types/companyDashboard';

interface MyVacancyApplicantCardProps {
  app: CompanyApplication;
  selectedJob: CompanyJob;
  testsRequired: string[];
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant;
  setSelectedResumeApplicant: (applicant: CompanyApplicant | null) => void;
  handleRequestDiscTest: (applicant: CompanyApplicant) => void;
  handleRequestMbtiTest: (applicant: CompanyApplicant) => void;
  handleRequestTemperamentosTest: (applicant: CompanyApplicant) => void;
  handleRequestQuestions: (applicant: CompanyApplicant) => void;
  handleRequestCustomTest: (applicant: CompanyApplicant) => void;
}

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

const buildWhatsappUrl = (phone: string) => {
  const cleanedPhone = (phone || '').replace(/\D/g, '');
  return `https://wa.me/${cleanedPhone.startsWith('55') ? cleanedPhone : `55${cleanedPhone}`}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Data não informada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data não informada';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
};

export const MyVacancyApplicantCard: React.FC<MyVacancyApplicantCardProps> = ({
  app,
  selectedJob,
  testsRequired,
  getFullApplicantInfo,
  setSelectedResumeApplicant,
  handleRequestDiscTest,
  handleRequestMbtiTest,
  handleRequestTemperamentosTest,
  handleRequestQuestions,
  handleRequestCustomTest
}) => {
  const info = getFullApplicantInfo(app);
  const parsedData = parseCandidatePhoneData(app.candidate_phone || app.phone || '');
  const matchScore = calculateAiMatchScore(selectedJob, info);
  const age = info.talentMatched?.birth_date
    ? calculateAge(info.talentMatched.birth_date)
    : info.talentMatched?.age;
  const gender = info.talentMatched?.gender;
  const location = [info.city, info.state].filter(Boolean).join(', ') || 'Local não informado';

  const requestTest = (testKey: string) => {
    if (testKey === 'disc') handleRequestDiscTest(info);
    else if (testKey === 'mbti') handleRequestMbtiTest(info);
    else if (testKey === 'temperamentos') handleRequestTemperamentosTest(info);
    else if (testKey === 'perguntas') handleRequestQuestions(info);
    else if (testKey === 'customizado') handleRequestCustomTest(info);
  };

  return (
    <div
      draggable={true}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', app.id || '');
      }}
      onClick={() => setSelectedResumeApplicant(info)}
      className="group relative overflow-hidden rounded-2xl bg-white/85 ring-1 ring-white/90 p-4 text-left shadow-[0_10px_28px_rgba(106,66,220,0.055)] hover:shadow-[0_16px_34px_rgba(106,66,220,0.12)] hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing space-y-3"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[#940dff] opacity-80" />

      <div className="flex items-start gap-3 pr-12">
        <div className="w-11 h-11 rounded-2xl bg-[#f8f6ff] border border-white/90 overflow-hidden flex items-center justify-center shrink-0">
          {info.profile_pic ? (
            <img src={info.profile_pic} alt="Foto" className="w-full h-full object-cover" />
          ) : (
            <User size={18} className="text-[#940dff]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="text-sm font-semibold text-[#343241] truncate leading-tight">{info.candidate_name || info.name || 'Candidato sem nome'}</h5>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-400 truncate">
            <MapPin size={11} /> {location}
          </p>
          {(age || gender) && (
            <p className="mt-1 text-[10px] font-semibold text-[#940dff]">
              {age ? `${age} anos` : ''}{age && gender ? ' · ' : ''}{gender || ''}
            </p>
          )}
        </div>
      </div>

      <div
        className={`absolute top-4 right-4 w-10 h-10 rounded-2xl flex flex-col items-center justify-center text-[10px] font-semibold select-none border ${
          matchScore >= 80
            ? 'bg-[#63e1a5]/14 text-[#2f9f6b] border-[#63e1a5]/20'
            : matchScore >= 50
              ? 'bg-[#ffc24b]/16 text-[#ffa303] border-[#ffc24b]/22'
              : 'bg-[#ff4b8c]/10 text-[#ff4b8c] border-[#ff4b8c]/15'
        }`}
        title={`Compatibilidade IA: ${matchScore}%`}
        onClick={(event) => event.stopPropagation()}
      >
        <span>{matchScore}%</span>
        <span className="text-[8px] opacity-70">match</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#f8f6ff] px-3 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Inscrição</p>
          <p className="mt-0.5 text-xs font-semibold text-[#343241]">{formatDate(app.created_at)}</p>
        </div>
        <div className="rounded-xl bg-[#f8f6ff] px-3 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Testes</p>
          <p className="mt-0.5 text-xs font-semibold text-[#343241]">{testsRequired.length || 'Nenhum'}</p>
        </div>
      </div>

      {testsRequired.filter((test) => (test.split(':')[1] || 'auto') === 'manual').length > 0 ? (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5" onClick={(event) => event.stopPropagation()}>
          {testsRequired.filter((test) => (test.split(':')[1] || 'auto') === 'manual').map((test) => {
            const [testKey, trigger = 'auto'] = test.split(':');
            const testStatus = getTestStatus(testKey, parsedData);
            const isCompleted = testStatus.startsWith('COMPLETED') || testStatus === 'COMPLETED' || (testStatus && testStatus !== 'PENDING');
            const isPending = testStatus === 'PENDING';

            return (
              <div key={testKey} className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => requestTest(testKey)}
                  className="px-2.5 py-1 rounded-full bg-[#940dff] hover:bg-[#8200e6] text-white text-[9px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95 select-none shrink-0"
                  title={`Solicitar teste ${testKey.toUpperCase()} (${trigger === 'auto' ? 'Automático' : 'Manual'})`}
                >
                  <Brain size={10} className="stroke-[2.5]" />
                  {isCompleted || isPending ? 'Reenviar' : 'Enviar'} {getTestLabel(testKey)}
                </button>

                {isCompleted && (
                  <span className="px-2 py-1 rounded-full bg-[#63e1a5]/14 text-[#2f9f6b] text-[9px] font-semibold flex items-center gap-1 select-none shrink-0" title="Teste já respondido pelo candidato">
                    <Check size={9} className="text-[#40b87f] stroke-[3]" /> Feito
                  </span>
                )}
                {isPending && (
                  <span className="px-2 py-1 rounded-full bg-[#ffc24b]/16 text-[#ffa303] text-[9px] font-semibold flex items-center gap-1 select-none shrink-0" title="Aguardando resposta do candidato">
                    <Clock size={9} className="text-[#ffc24b]" /> Pend.
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="pt-3 border-t border-slate-100 flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={() => setSelectedResumeApplicant(info)}
          className="flex-1 h-9 px-3 bg-[#940dff] hover:bg-[#8200e6] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm border border-transparent"
          title="Visualizar perfil"
        >
          <Eye size={13} className="stroke-[2.5]" /> Perfil
        </button>

        <a
          href={buildWhatsappUrl(parsedData.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-[#63e1a5] hover:bg-[#4fc98f] text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-sm"
          title="Chamar no WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2C6.49 2 2 6.47 2 12.01c0 1.91.53 3.78 1.56 5.42L2 23l5.76-1.51c1.58.86 3.37 1.31 5.27 1.31 5.54 0 10.03-4.47 10.03-10.01C23.06 6.47 18.57 2 12.031 2zm5.73 14.1c-.24.68-1.24 1.25-1.9 1.34-.54.07-1.24.08-2 .17-1.24-.16-2.5-1.06-3.69-2.25-1.19-1.19-2.09-2.45-2.25-3.69.09-.76.1-1.46.17-2 .09-.66.66-1.66 1.34-1.9.18-.06.39-.08.57-.08.18 0 .37.01.52.33.21.46.72 1.77.79 1.91.07.15.12.32.02.5-.1.18-.15.3-.3.47-.15.17-.32.39-.46.52-.16.16-.33.33-.14.65.19.32.84 1.39 1.8 2.25.96.86 1.77 1.41 2.09 1.57.32.16.51.12.67-.06.17-.18.72-.84.92-1.12.19-.28.39-.23.65-.13.26.1 1.66.78 1.94.92.28.14.47.21.54.34.08.13.08.76-.16 1.44z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
