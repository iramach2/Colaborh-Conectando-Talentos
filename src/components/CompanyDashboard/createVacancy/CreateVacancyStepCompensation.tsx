import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Gift, Plus, Wallet, X as CloseIconComponent } from 'lucide-react';
import type { VacancyFormData } from '../../../utils/vacancyPayload';
import { VacancyFieldLabel, vacancyInputClass, vacancySelectClass } from './createVacancyStyles';

type BenefitWithValueId = 'vt' | 'va';
type BooleanBenefitId = 'healthInsurance' | 'dentalPlan';
type BenefitOption =
  | { id: BenefitWithValueId; label: string; description: string; hasValue: true }
  | { id: BooleanBenefitId; label: string; description: string; hasValue: false };

const benefitOptions: BenefitOption[] = [
  { id: 'vt', label: 'VT', description: 'Vale transporte', hasValue: true },
  { id: 'va', label: 'VA/VR', description: 'Alimentação ou refeição', hasValue: true },
  { id: 'healthInsurance', label: 'Saúde', description: 'Plano médico', hasValue: false },
  { id: 'dentalPlan', label: 'Dental', description: 'Plano odontológico', hasValue: false },
];

interface CreateVacancyStepCompensationProps {
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
  newBenefit: string;
  setNewBenefit: React.Dispatch<React.SetStateAction<string>>;
  onSalaryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSalaryMinChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSalaryMaxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectChevron = ({ size = 14 }: { size?: number }) => (
  <ChevronDown size={size} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
);

const SectionTitle = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="mb-5 flex items-center gap-3 text-left">
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffc24b]/16 text-[#ffa303]">{icon}</div>
    <div>
      <h3 className="text-[18px] font-semibold text-[#343241]">{title}</h3>
      <p className="mt-1 text-[12px] font-medium text-slate-400">{description}</p>
    </div>
  </div>
);

export const CreateVacancyStepCompensation: React.FC<CreateVacancyStepCompensationProps> = ({
  vacancyForm,
  setVacancyForm,
  newBenefit,
  setNewBenefit,
  onSalaryChange,
  onSalaryMinChange,
  onSalaryMaxChange,
}) => (
  <motion.div
    key="step2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-5"
  >
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <SectionTitle icon={<Wallet size={18} />} title="Remuneração" description="Defina salário fixo, faixa ou valor a combinar." />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="text-left">
              <VacancyFieldLabel>Remuneração <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
              <div className="relative">
                <SelectChevron />
                <select
                  value={vacancyForm.remunerationType}
                  onChange={(event) => setVacancyForm((prev) => ({ ...prev, remunerationType: event.target.value }))}
                  className={vacancySelectClass}
                >
                  <option value="Fixo">Salário Fixo</option>
                  <option value="Faixa Salarial">Faixa Salarial</option>
                  <option value="A combinar">A combinar</option>
                </select>
              </div>
            </div>

            {vacancyForm.remunerationType === 'Fixo' && (
              <div className="text-left">
                <VacancyFieldLabel>Salário proposto <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
                <input type="text" value={vacancyForm.salary} onChange={onSalaryChange} placeholder="R$ 0,00" className={vacancyInputClass} />
              </div>
            )}

            {vacancyForm.remunerationType === 'Faixa Salarial' && (
              <div className="grid grid-cols-2 gap-3 md:col-span-1">
                <div className="text-left">
                  <VacancyFieldLabel>Mínimo <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
                  <input type="text" value={vacancyForm.salaryMin} onChange={onSalaryMinChange} placeholder="R$ 0,00" className={vacancyInputClass} />
                </div>
                <div className="text-left">
                  <VacancyFieldLabel>Máximo <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
                  <input type="text" value={vacancyForm.salaryMax} onChange={onSalaryMaxChange} placeholder="R$ 0,00" className={vacancyInputClass} />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <label className="flex cursor-pointer select-none items-center gap-3 text-left">
            <input
              type="checkbox"
              checked={vacancyForm.hasBonus}
              onChange={(event) => setVacancyForm((prev) => ({ ...prev, hasBonus: event.target.checked }))}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#ffc24b] focus:ring-[#ffc24b]"
            />
            <span className="text-[13px] font-semibold text-[#343241]">Esta vaga possui comissão ou premiação extra?</span>
          </label>

          {vacancyForm.hasBonus && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 md:grid-cols-2">
              <div className="relative">
                <SelectChevron size={12} />
                <select
                  value={vacancyForm.bonusType}
                  onChange={(event) => setVacancyForm((prev) => ({ ...prev, bonusType: event.target.value }))}
                  className={vacancySelectClass}
                >
                  <option value="Comissao">Comissão</option>
                  <option value="Premiacao">Premiação</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Ex: R$ 500,00 ou 2%"
                value={vacancyForm.bonusValue}
                onChange={(event) => setVacancyForm((prev) => ({ ...prev, bonusValue: event.target.value }))}
                className={vacancyInputClass}
              />
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <SectionTitle icon={<Gift size={18} />} title="Benefícios" description="Selecione benefícios e informe valores quando necessário." />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {benefitOptions.map((benefit) => {
            const isSelected = benefit.hasValue ? vacancyForm.benefits[benefit.id].selected : vacancyForm.benefits[benefit.id];

            return (
              <div key={benefit.id} className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-3">
                <button
                  type="button"
                  onClick={() => {
                    if (benefit.hasValue) {
                      setVacancyForm((prev) => ({
                        ...prev,
                        benefits: { ...prev.benefits, [benefit.id]: { ...prev.benefits[benefit.id], selected: !prev.benefits[benefit.id].selected } },
                      }));
                    } else {
                      setVacancyForm((prev) => ({ ...prev, benefits: { ...prev.benefits, [benefit.id]: !prev.benefits[benefit.id] } }));
                    }
                  }}
                  className={`h-[46px] w-full rounded-xl border px-3 text-left transition-all ${
                    isSelected
                      ? 'border-[#ffc24b]/28 bg-[#ffc24b]/16 text-[#ffa303]'
                      : 'border-white/70 bg-white text-slate-500 hover:border-[#ffc24b]/24 hover:bg-[#ffc24b]/10 hover:text-[#ffa303]'
                  }`}
                >
                  <span className="block text-[12px] font-semibold">{benefit.label}</span>
                  <span className="mt-0.5 block text-[10px] font-medium opacity-70">{benefit.description}</span>
                </button>

                {benefit.hasValue && isSelected && (
                  <input
                    type="text"
                    placeholder="Valor do benefício"
                    value={vacancyForm.benefits[benefit.id].value}
                    onChange={(event) => setVacancyForm((prev) => ({
                      ...prev,
                      benefits: { ...prev.benefits, [benefit.id]: { ...prev.benefits[benefit.id], value: event.target.value } },
                    }))}
                    className={`${vacancyInputClass} mt-2 h-9`}
                  />
                )}

                {!benefit.hasValue && isSelected && benefit.id === 'healthInsurance' && (
                  <div className="mt-3 flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-[11px] font-medium text-slate-500">
                      <input type="checkbox" checked={vacancyForm.benefits.healthInsuranceCopay} onChange={(event) => setVacancyForm((prev) => ({ ...prev, benefits: { ...prev.benefits, healthInsuranceCopay: event.target.checked } }))} className="h-3.5 w-3.5 border-slate-300 text-[#ffc24b] focus:ring-[#ffc24b]" />
                      Coparticipativo
                    </label>
                    <label className="flex cursor-pointer select-none items-center gap-2 text-[11px] font-medium text-slate-500">
                      <input type="checkbox" checked={vacancyForm.benefits.healthInsuranceFamily} onChange={(event) => setVacancyForm((prev) => ({ ...prev, benefits: { ...prev.benefits, healthInsuranceFamily: event.target.checked } }))} className="h-3.5 w-3.5 border-slate-300 text-[#ffc24b] focus:ring-[#ffc24b]" />
                      Estendido familiar
                    </label>
                  </div>
                )}

                {!benefit.hasValue && isSelected && benefit.id === 'dentalPlan' && (
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-[11px] font-medium text-slate-500">
                      <input type="checkbox" checked={vacancyForm.benefits.dentalPlanFamily} onChange={(event) => setVacancyForm((prev) => ({ ...prev, benefits: { ...prev.benefits, dentalPlanFamily: event.target.checked } }))} className="h-3.5 w-3.5 border-slate-300 text-[#ffc24b] focus:ring-[#ffc24b]" />
                      Estendido familiar
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {vacancyForm.extraBenefits.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {vacancyForm.extraBenefits.map((extra, index) => (
              <div key={index} className="group/btn relative">
                <span className="inline-flex h-8 items-center rounded-xl border border-[#ffc24b]/24 bg-[#ffc24b]/16 px-3 text-[11px] font-semibold text-[#ffa303]">{extra}</span>
                <button type="button" onClick={() => setVacancyForm((prev) => ({ ...prev, extraBenefits: prev.extraBenefits.filter((_, benefitIndex) => benefitIndex !== index) }))} className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff4b8c] text-white opacity-0 shadow-sm transition-opacity group-hover/btn:opacity-100">
                  <CloseIconComponent size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Outro benefício (ex: Gympass)..."
            value={newBenefit}
            onChange={(event) => setNewBenefit(event.target.value.toUpperCase())}
            className={`${vacancyInputClass} flex-1`}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                if (newBenefit.trim()) {
                  setVacancyForm((prev) => ({ ...prev, extraBenefits: [...prev.extraBenefits, newBenefit.trim()] }));
                  setNewBenefit('');
                }
              }
            }}
          />
          {newBenefit && (
            <button type="button" onClick={() => { setVacancyForm((prev) => ({ ...prev, extraBenefits: [...prev.extraBenefits, newBenefit.trim()] })); setNewBenefit(''); }} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffc24b] text-white shadow-[0_10px_22px_rgba(255,194,75,0.18)] transition-all hover:bg-[#e5a72e] active:scale-95">
              <Plus size={14} />
            </button>
          )}
        </div>
      </section>
    </div>
  </motion.div>
);
