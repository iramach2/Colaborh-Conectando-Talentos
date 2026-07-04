import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import type { VacancyFormData } from '../../../utils/vacancyPayload';

interface CreateVacancyStepReviewProps {
  vacancyForm: VacancyFormData;
}

const getSalaryText = (vacancyForm: VacancyFormData) => {
  if (vacancyForm.remunerationType === 'Fixo') return vacancyForm.salary || 'Não informado';
  if (vacancyForm.remunerationType === 'Faixa Salarial') return `${vacancyForm.salaryMin || 'R$ 0,00'} até ${vacancyForm.salaryMax || 'R$ 0,00'}`;
  return 'A combinar';
};

const getBenefits = (vacancyForm: VacancyFormData) => {
  const benefits: string[] = [];
  if (vacancyForm.benefits.vt.selected) benefits.push(`VT: ${vacancyForm.benefits.vt.value || 'Sim'}`);
  if (vacancyForm.benefits.va.selected) benefits.push(`VA/VR: ${vacancyForm.benefits.va.value || 'Sim'}`);
  if (vacancyForm.benefits.healthInsurance) benefits.push('Plano de saúde');
  if (vacancyForm.benefits.dentalPlan) benefits.push('Plano dental');
  return [...benefits, ...vacancyForm.extraBenefits];
};

const ReviewBlock = ({ title, items }: { title: string; items: Array<[string, React.ReactNode]> }) => (
  <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
    <h3 className="mb-4 text-left text-[16px] font-semibold text-[#343241]">{title}</h3>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] px-4 py-3 text-left">
          <p className="text-[11px] font-semibold text-slate-400">{label}</p>
          <div className="mt-1 break-words text-[13px] font-semibold text-[#343241]">{value || 'Não informado'}</div>
        </div>
      ))}
    </div>
  </section>
);

export const CreateVacancyStepReview: React.FC<CreateVacancyStepReviewProps> = ({ vacancyForm }) => {
  const location = vacancyForm.modality === 'Home Office' ? 'Home Office' : `${vacancyForm.city || 'Cidade não informada'} - ${vacancyForm.state || 'UF'}`;
  const benefits = getBenefits(vacancyForm);

  return (
    <motion.div key="step6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/85 p-5 text-left shadow-[0_10px_28px_rgba(15,23,42,0.035)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#63e1a5]/14 text-[#2f9f6b]"><ClipboardList size={20} /></div>
          <div>
            <h3 className="text-[18px] font-semibold text-[#343241]">Revisão da vaga</h3>
            <p className="mt-1 text-[12px] font-medium text-slate-400">Confira os dados antes de publicar a oportunidade.</p>
          </div>
        </div>
        <div className="inline-flex h-8 items-center gap-2 rounded-xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 px-3 text-[12px] font-semibold text-[#2f9f6b]"><CheckCircle2 size={14} /> Pronta para publicação</div>
      </section>

      <ReviewBlock title="Dados básicos" items={[
        ['Título', vacancyForm.title],
        ['Cargo', vacancyForm.role],
        ['Modalidade', vacancyForm.modality],
        ['Localização', location],
        ['Contratação', vacancyForm.contractType],
        ['Escala', vacancyForm.workSchedule],
      ]} />

      <ReviewBlock title="Remuneração e benefícios" items={[
        ['Tipo de remuneração', vacancyForm.remunerationType],
        ['Salário', getSalaryText(vacancyForm)],
        ['Comissão/Premiação', vacancyForm.hasBonus ? `${vacancyForm.bonusType}: ${vacancyForm.bonusValue || 'A combinar'}` : 'Não possui'],
        ['Benefícios', benefits.length ? benefits.join(', ') : 'Não informado'],
      ]} />

      <ReviewBlock title="Perfil e processo" items={[
        ['Posições', vacancyForm.positions],
        ['Motivo', vacancyForm.requestReason],
        ['Idade mínima', `${vacancyForm.minAge} anos`],
        ['Primeiro emprego', vacancyForm.isFirstJob ? 'Sim' : 'Não'],
        ['Vaga PcD', vacancyForm.isPcd ? `Sim${vacancyForm.pcdDetails ? `: ${vacancyForm.pcdDetails}` : ''}` : 'Não'],
        ['Requisitos', vacancyForm.requirements.length ? vacancyForm.requirements.join(', ') : 'Não informado'],
        ['Etapas', vacancyForm.stages.join(' > ')],
      ]} />
    </motion.div>
  );
};
