import { ChangeEvent, RefObject } from 'react';
import { Accessibility, Camera, ChevronDown, Loader2, MapPin, Phone, User } from 'lucide-react';
import { ResumeFieldLabel, ResumeSectionCard, resumeInputClass, resumeSelectClass } from './CandidateResumeEditorPrimitives';
import { findMatchingBrazilianCityName } from '../../utils/companyDashboardUtils';
import { formatBrazilianPhone } from '../../utils/phoneFormat';

interface PersonalResumeData {
  profilePic: string;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  birthDate: string;
  state: string;
  city: string;
  salary: string;
  isPcd: boolean;
  cid: string;
}

interface CandidateResumePersonalInfoEditorProps {
  resumeData: PersonalResumeData;
  brazilStates: string[];
  genderOptions: string[];
  cities: string[];
  isLoadingCities: boolean;
  profilePicRef: RefObject<HTMLInputElement>;
  onProfilePicSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (patch: Partial<PersonalResumeData>) => void;
}

export function CandidateResumePersonalInfoEditor({
  resumeData,
  brazilStates,
  genderOptions,
  cities,
  isLoadingCities,
  profilePicRef,
  onProfilePicSelect,
  onChange,
}: CandidateResumePersonalInfoEditorProps) {
  const selectedCity = resumeData.city ? findMatchingBrazilianCityName(resumeData.city, cities) : '';

  return (
    <div className="space-y-4">
      <ResumeSectionCard className="!border-transparent !bg-white !p-0">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
            {resumeData.profilePic ? (
              <img src={resumeData.profilePic} alt="Perfil" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User size={28} />
              </div>
            )}
            <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-[#940dff]/82 text-white opacity-0 transition-all hover:opacity-100">
              <Camera size={16} />
              <span className="mt-1 text-[10px] font-semibold">Alterar</span>
              <input
                type="file"
                ref={profilePicRef}
                className="hidden"
                accept="image/*"
                onChange={onProfilePicSelect}
              />
            </label>
          </div>

          <div className="w-full min-w-0">
            <ResumeFieldLabel>Nome completo</ResumeFieldLabel>
            <input
              type="text"
              value={resumeData.fullName}
              onChange={(event) => onChange({ fullName: event.target.value.toUpperCase() })}
              className={resumeInputClass}
              placeholder="Nome completo"
            />
          </div>
        </div>
      </ResumeSectionCard>

      <ResumeSectionCard className="!border-transparent !bg-white !p-0">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <ResumeFieldLabel>E-mail</ResumeFieldLabel>
            <input
              type="email"
              value={resumeData.email}
              onChange={(event) => onChange({ email: event.target.value })}
              className={resumeInputClass}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <ResumeFieldLabel>Gênero</ResumeFieldLabel>
            <div className="relative">
              <select
                value={resumeData.gender}
                onChange={(event) => onChange({ gender: event.target.value })}
                className={resumeSelectClass}
              >
                <option value="">Selecione seu gênero</option>
                {genderOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
            </div>
          </div>

          <div>
            <ResumeFieldLabel>WhatsApp / telefone</ResumeFieldLabel>
            <div className="relative">
              <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
              <input
                type="tel"
                value={formatBrazilianPhone(resumeData.phone)}
                onChange={(event) => onChange({ phone: formatBrazilianPhone(event.target.value) })}
                className={`${resumeInputClass} pl-9`}
                placeholder="(99)99999-9999"
                inputMode="numeric"
                maxLength={14}
              />
            </div>
          </div>

          <div>
            <ResumeFieldLabel>Data de nascimento</ResumeFieldLabel>
            <input
              type="date"
              value={resumeData.birthDate}
              onChange={(event) => onChange({ birthDate: event.target.value })}
              className={resumeInputClass}
            />
          </div>

          <div>
            <ResumeFieldLabel>Estado</ResumeFieldLabel>
            <div className="relative">
              <select
                value={resumeData.state}
                onChange={(event) => onChange({ state: event.target.value, city: '' })}
                className={resumeSelectClass}
              >
                <option value="">UF</option>
                {brazilStates.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
            </div>
          </div>

          {resumeData.state && (
            <div>
              <ResumeFieldLabel>Cidade</ResumeFieldLabel>
              <div className="relative">
                {isLoadingCities ? (
                  <Loader2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 animate-spin text-[#940dff]" />
                ) : (
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
                )}
                <select
                  value={selectedCity}
                  onChange={(event) => onChange({ city: event.target.value })}
                  disabled={isLoadingCities || !cities.length}
                  className={`${resumeSelectClass} pl-9`}
                >
                  <option value="">{isLoadingCities ? 'Carregando...' : 'Selecione a cidade'}</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
              </div>
            </div>
          )}

          <div>
            <ResumeFieldLabel>Pretensão salarial</ResumeFieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-slate-400">R$</span>
              <input
                type="text"
                value={resumeData.salary}
                onChange={(event) => onChange({ salary: event.target.value })}
                className={`${resumeInputClass} pl-9`}
                placeholder="Ex: 2.500,00"
              />
            </div>
          </div>

          <div>
            <ResumeFieldLabel>Acessibilidade</ResumeFieldLabel>
            <label className="flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/20 hover:text-[#940dff]">
              <span className="flex items-center gap-2">
                <Accessibility size={14} /> Pessoa PCD
              </span>
              <span className={`relative h-5 w-10 rounded-full transition-colors ${resumeData.isPcd ? 'bg-[#63e1a5]' : 'bg-slate-200'}`}>
                <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${resumeData.isPcd ? 'translate-x-5' : ''}`} />
                <input
                  type="checkbox"
                  className="hidden"
                  checked={resumeData.isPcd}
                  onChange={(event) => onChange({ isPcd: event.target.checked })}
                />
              </span>
            </label>
          </div>
        </div>
      </ResumeSectionCard>
    </div>
  );
}