import React from 'react';
import { motion } from 'motion/react';
import { BriefcaseBusiness, ChevronDown, MapPin } from 'lucide-react';
import { BRAZIL_STATES } from '../../../utils/companyDashboardUtils';
import type { VacancyFormData } from '../../../utils/vacancyPayload';
import { VacancyFieldLabel, vacancyInputClass, vacancySelectClass } from './createVacancyStyles';

interface CreateVacancyStepBasicsProps {
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
  cities: string[];
  isLoadingCities: boolean;
}

const SectionTitle = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="mb-5 flex items-center gap-3 text-left">
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">{icon}</div>
    <div>
      <h3 className="text-[18px] font-semibold text-[#343241]">{title}</h3>
      <p className="mt-1 text-[12px] font-medium text-slate-400">{description}</p>
    </div>
  </div>
);

const SelectChevron = ({ size = 14 }: { size?: number }) => (
  <ChevronDown size={size} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
);

export const CreateVacancyStepBasics: React.FC<CreateVacancyStepBasicsProps> = ({
  vacancyForm,
  setVacancyForm,
  cities,
  isLoadingCities,
}) => (
  <motion.div
    key="step1"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-5"
  >
    <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
      <SectionTitle icon={<BriefcaseBusiness size={18} />} title="Dados básicos" description="Identifique a oportunidade e o formato de trabalho." />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="text-left">
          <VacancyFieldLabel>Título da vaga <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
          <input
            type="text"
            value={vacancyForm.title}
            onChange={(event) => {
              const cleanValue = event.target.value.replace(/[^\p{L}\p{N} ]/gu, '');
              setVacancyForm((prev) => ({ ...prev, title: cleanValue.toUpperCase() }));
            }}
            placeholder="Ex: Desenvolvedor React Sênior"
            className={vacancyInputClass}
          />
          <p className="mt-2 text-[11px] font-medium leading-normal text-slate-400">Evite siglas, abreviações e separadores como "_", "-" e "/".</p>
        </div>

        <div className="text-left">
          <VacancyFieldLabel>Cargo <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
          <input
            type="text"
            value={vacancyForm.role}
            onChange={(event) => setVacancyForm((prev) => ({ ...prev, role: event.target.value }))}
            placeholder="Ex: Vendedor, Programador..."
            className={vacancyInputClass}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-6">
        <div className="text-left lg:col-span-2">
          <VacancyFieldLabel>Modalidade <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
          <div className="relative">
            <SelectChevron />
            <select
              value={vacancyForm.modality}
              onChange={(event) => setVacancyForm((prev) => ({ ...prev, modality: event.target.value, state: '', city: '' }))}
              className={vacancySelectClass}
            >
              <option value="Presencial">Presencial</option>
              <option value="Home Office">Home Office</option>
              <option value="Hibrido">Híbrido</option>
            </select>
          </div>
        </div>

        {(vacancyForm.modality === 'Presencial' || vacancyForm.modality === 'Hibrido') && (
          <>
            <div className="text-left lg:col-span-1">
              <VacancyFieldLabel>UF <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
              <div className="relative">
                <SelectChevron size={12} />
                <select
                  className={vacancySelectClass}
                  value={vacancyForm.state}
                  onChange={(event) => setVacancyForm((prev) => ({ ...prev, state: event.target.value, city: '' }))}
                >
                  <option value="">UF</option>
                  {BRAZIL_STATES.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>

            <div className="text-left lg:col-span-3">
              <VacancyFieldLabel>Cidade <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
              <div className="relative">
                <SelectChevron />
                <select
                  className={`${vacancySelectClass} disabled:cursor-not-allowed disabled:opacity-50`}
                  value={vacancyForm.city}
                  onChange={(event) => setVacancyForm((prev) => ({ ...prev, city: event.target.value }))}
                  disabled={isLoadingCities || !cities.length}
                >
                  <option value="">{isLoadingCities ? 'Buscando...' : 'Cidade'}</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="text-left">
          <VacancyFieldLabel>Contratação <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
          <div className="relative">
            <SelectChevron />
            <select
              value={vacancyForm.contractType}
              onChange={(event) => setVacancyForm((prev) => ({ ...prev, contractType: event.target.value }))}
              className={vacancySelectClass}
            >
              <option value="CLT">CLT</option>
              <option value="PJ">PJ</option>
              <option value="Estagio">Estágio</option>
              <option value="Autonomo">Autônomo</option>
              <option value="Meio Periodo">Meio Período</option>
              <option value="Temporario">Temporário</option>
            </select>
          </div>
        </div>

        <div className="text-left">
          <VacancyFieldLabel>Escala <span className="text-[#ff4b8c]">*</span></VacancyFieldLabel>
          <div className="relative">
            <SelectChevron />
            <select
              value={vacancyForm.workSchedule}
              onChange={(event) => setVacancyForm((prev) => ({ ...prev, workSchedule: event.target.value }))}
              className={vacancySelectClass}
            >
              <option value="5x2">5x2 (Seg. a Sex.)</option>
              <option value="6x1">6x1 (6 dias de trabalho e 1 folga)</option>
              <option value="12x36">12x36 (12h trabalho por 36h folga)</option>
              <option value="Outra">Outras escalas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#940dff]/10 bg-[#f3e5ff]/70 p-4 text-left">
        <MapPin size={16} className="mt-0.5 shrink-0 text-[#940dff]" />
        <p className="text-[12px] font-medium leading-relaxed text-slate-500">
          Use esta etapa para deixar claro onde e como a pessoa irá atuar. Salário e benefícios ficam no próximo passo.
        </p>
      </div>
    </section>
  </motion.div>
);
