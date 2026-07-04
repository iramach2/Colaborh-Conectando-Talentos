import { ChangeEvent, Dispatch, FormEvent, ReactNode, SetStateAction } from 'react';
import { CalendarDays, Camera, Lock, Loader2, Mail, Phone, User, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { CandidateResumeData } from '../../types/candidate';

interface CandidateSettingsResumeData {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  profilePic?: string;
}

interface CandidateSettingsTabProps {
  resumeData: CandidateSettingsResumeData;
  setResumeData: Dispatch<SetStateAction<CandidateResumeData>>;
  calculateAge: (birthDate: string) => number;
  handleProfilePicSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSaveToSupabase: () => void;
  isSaving: boolean;
  handleUpdatePassword: (event: FormEvent<HTMLFormElement>) => void;
  newPassword: string;
  setNewPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  isUpdatingPassword: boolean;
}


const settingsInputClass = 'h-10 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-[12px] font-semibold text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/30 focus:ring-4 focus:ring-[#940dff]/10';

export function CandidateSettingsTab({
  resumeData,
  setResumeData,
  calculateAge,
  handleProfilePicSelect,
  handleSaveToSupabase,
  isSaving,
  handleUpdatePassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isUpdatingPassword,
}: CandidateSettingsTabProps) {
  const candidateAge = calculateAge(resumeData.birthDate);

  return (
    <motion.section
      key="configuracoes"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="w-full space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="flex flex-col items-center text-center">
            <div className="group relative h-24 w-24 overflow-hidden rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] shadow-sm">
              {resumeData.profilePic ? (
                <img src={resumeData.profilePic} alt="Foto do candidato" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#940dff]">
                  <User size={34} />
                </div>
              )}
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-[#940dff]/86 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={16} />
                <span className="mt-1 text-[11px] font-semibold">Alterar</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicSelect} />
              </label>
            </div>

            <h2 className="mt-4 max-w-full truncate text-[18px] font-semibold text-[#343241]" title={resumeData.fullName || 'Seu nome'}>
              {resumeData.fullName || 'Seu nome'}
            </h2>
            <p className="mt-1 text-[12px] font-medium text-slate-400">Candidato</p>
          </div>

          <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200/70 bg-[#fbfaff]">
            <ProfileSummaryItem label="E-mail" value={resumeData.email || 'Não informado'} icon={Mail} />
            <ProfileSummaryItem label="Telefone" value={resumeData.phone || 'Não informado'} icon={Phone} />
            <ProfileSummaryItem label="Idade" value={candidateAge ? `${candidateAge} anos` : 'Não informada'} icon={CalendarDays} />
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#343241]">Dados do perfil</h3>
                  <p className="mt-1 text-[12px] font-medium text-slate-400">Mantenha suas informações principais atualizadas.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveToSupabase}
                disabled={isSaving}
                className="flex h-8 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isSaving && <Loader2 size={13} className="animate-spin" />}
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nome completo">
                <input
                  type="text"
                  value={resumeData.fullName}
                  onChange={(event) => setResumeData({ ...resumeData, fullName: event.target.value.toUpperCase() })}
                  placeholder="Seu nome"
                  className={settingsInputClass}
                />
              </Field>

              <Field label="E-mail">
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(event) => setResumeData({ ...resumeData, email: event.target.value })}
                  placeholder="seu@email.com"
                  className={settingsInputClass}
                />
              </Field>

              <Field label="WhatsApp / telefone">
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#940dff]" />
                  <input
                    type="tel"
                    value={resumeData.phone}
                    onChange={(event) => setResumeData({ ...resumeData, phone: event.target.value })}
                    placeholder="(00) 00000-0000"
                    className={`${settingsInputClass} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Data de nascimento">
                <input
                  type="date"
                  value={resumeData.birthDate}
                  onChange={(event) => setResumeData({ ...resumeData, birthDate: event.target.value })}
                  className={settingsInputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c]">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#343241]">Alterar senha</h3>
                <p className="mt-1 text-[12px] font-medium text-slate-400">Use uma senha forte para manter sua conta protegida.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nova senha">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={settingsInputClass}
                />
              </Field>

              <Field label="Confirmar nova senha">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirme a senha"
                  className={settingsInputClass}
                />
              </Field>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex h-8 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isUpdatingPassword && <Loader2 size={13} className="animate-spin" />}
                  {isUpdatingPassword ? 'Atualizando...' : 'Atualizar senha'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-[12px] font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function ProfileSummaryItem({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Icon size={15} className="mt-0.5 shrink-0 text-[#940dff]" />
      <div className="min-w-0 text-left">
        <p className="text-[11px] font-semibold text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-[12px] font-medium text-slate-600" title={value}>{value}</p>
      </div>
    </div>
  );
}