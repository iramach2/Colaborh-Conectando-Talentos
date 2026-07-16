import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Brain,
  Briefcase,
  Check,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap
} from 'lucide-react';
import { isSupabaseConfigured, saveCompany, type CompanyRecord } from '../../../services/companyService';
import type { CompanyJob } from '../../../types/companyDashboard';
import { getDefaultCreditsForPlan } from '../../../utils/companyPlans';

interface BillingTabProps {
  company: CompanyRecord | null;
  companies: CompanyRecord[];
  setCompanies: React.Dispatch<React.SetStateAction<CompanyRecord[]>>;
  jobs: CompanyJob[];
}

type PlanKey = 'starter' | 'growth' | 'enterprise';

const planLabels: Record<PlanKey, string> = {
  starter: 'Gratuito',
  growth: 'Profissional',
  enterprise: 'Ilimitado'
};

const planBonusCredits: Record<PlanKey, number> = {
  starter: 0,
  growth: 15,
  enterprise: 999999
};

const planPrices: Record<PlanKey, string> = {
  starter: 'R$ 0',
  growth: 'R$ 119,90',
  enterprise: 'R$ 249,90'
};

const planDescriptions: Record<PlanKey, string> = {
  starter: 'Para publicar vagas sem recursos avançados de seleção.',
  growth: 'Para empresas que precisam testar, conversar e entrevistar candidatos.',
  enterprise: 'Para operações que querem todos os recursos sem limites.'
};

const planFeatures: Record<PlanKey, string[]> = {
  starter: [
    'Vagas ilimitadas',
    'Sem envio de testes comportamentais',
    'Sem criação de testes personalizados',
    'Sem entrevistas, mensagens diretas, WhatsApp e download de currículos'
  ],
  growth: [
    'Vagas ilimitadas',
    'Até 3 testes personalizados',
    '15 envios de testes por mês',
    'Entrevistas, mensagens diretas, WhatsApp e download de currículos liberados'
  ],
  enterprise: [
    'Vagas ilimitadas',
    'Testes personalizados ilimitados',
    'Envios de testes ilimitados',
    'Todos os recursos liberados sem travas'
  ]
};

const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const BillingTab: React.FC<BillingTabProps> = ({
  company,
  companies,
  setCompanies,
  jobs
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradingTo, setUpgradingTo] = useState<PlanKey | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const [creditAmount, setCreditAmount] = useState(10);
  const [isBuyingCredits, setIsBuyingCredits] = useState(false);
  const [isProcessingCredits, setIsProcessingCredits] = useState(false);
  const [creditsSuccess, setCreditsSuccess] = useState(false);

  const plan = (company?.plan || 'starter') as PlanKey;
  const credits = plan === 'enterprise' ? Infinity : (company?.credits !== undefined ? company.credits : getDefaultCreditsForPlan(plan));

  const activeJobsCount = useMemo(() => jobs.filter(job =>
    job.company_name === company?.nomeFantasia &&
    (job.status === 'active' || job.status === 'ativa' || !job.status)
  ).length, [company?.nomeFantasia, jobs]);

  const jobLimit = Infinity;
  const jobUsagePercent = 0;

  const getCreditUnitPrice = (amount: number) => {
    if (amount >= 50) return 9;
    if (amount >= 15) return 12;
    return 15;
  };

  const unitPrice = getCreditUnitPrice(creditAmount);
  const totalPrice = creditAmount * unitPrice;
  const standardPrice = creditAmount * 15;
  const savings = standardPrice - totalPrice;

  const handleStartUpgrade = (planName: PlanKey) => {
    setUpgradingTo(planName);
    setIsUpgrading(true);
    setUpgradeSuccess(false);
  };

  const persistCompaniesFallback = (updatedCompanies: CompanyRecord[]) => {
    if (!isSupabaseConfigured()) {
      localStorage.setItem('colaborh_companies', JSON.stringify(updatedCompanies));
    }
  };

  const handleConfirmUpgrade = async () => {
    if (!company || !upgradingTo) return;

    setIsProcessingUpgrade(true);

    try {
      const companyWithNewPlan: CompanyRecord = {
        ...company,
        plan: upgradingTo,
        credits: getDefaultCreditsForPlan(upgradingTo)
      };

      const savedCompany = await saveCompany(companyWithNewPlan);
      const updated = companies.map(c => (c.id === company.id ? savedCompany : c));
      setCompanies(updated);
      persistCompaniesFallback(updated);
      setUpgradeSuccess(true);

      setTimeout(() => {
        setIsUpgrading(false);
        setUpgradeSuccess(false);
        setUpgradingTo(null);
      }, 2500);
    } catch (error) {
      console.error('Erro ao alterar plano:', error);
      alert('Nao foi possivel alterar o plano. Tente novamente em alguns instantes.');
    } finally {
      setIsProcessingUpgrade(false);
    }
  };

  const handleStartBuyCredits = () => {
    setIsBuyingCredits(true);
    setCreditsSuccess(false);
  };

  const handleConfirmBuyCredits = async () => {
    if (!company) return;

    setIsProcessingCredits(true);

    try {
      const companyWithCredits: CompanyRecord = {
        ...company,
        credits: (company.credits !== undefined ? company.credits : getDefaultCreditsForPlan(company.plan || 'starter')) + creditAmount
      };

      const savedCompany = await saveCompany(companyWithCredits);
      const updated = companies.map(c => (c.id === company.id ? savedCompany : c));
      setCompanies(updated);
      persistCompaniesFallback(updated);
      setCreditsSuccess(true);

      setTimeout(() => {
        setIsBuyingCredits(false);
        setCreditsSuccess(false);
      }, 2500);
    } catch (error) {
      console.error('Erro ao comprar creditos:', error);
      alert('Nao foi possivel adicionar os creditos. Tente novamente em alguns instantes.');
    } finally {
      setIsProcessingCredits(false);
    }
  };

  const renderPlanButtonLabel = (planName: PlanKey) => {
    if (plan === planName) return 'Plano atual';
    return `Migrar para ${planLabels[planName]}`;
  };

  return (
    <div className="company-dashboard-surface space-y-6 pb-10 text-left">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-2xl border border-[#940dff]/18 bg-[#940dff] p-5 text-white shadow-[0_12px_26px_rgba(148,13,255,0.2)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-white/70">Plano atual</p>
              <h3 className="mt-1 truncate text-[20px] font-semibold tracking-tight text-white">{company?.nomeFantasia || 'Empresa Colaborh'}</h3>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/14 text-white">
              <WalletCards size={20} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="text-[11px] font-semibold text-white/70">Assinatura</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{planLabels[plan]}</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4">
              <p className="text-[11px] font-semibold text-white/70">Créditos</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{credits === Infinity ? 'Ilimitado' : credits}</p>
            </div>
          </div>

          <p className="mt-5 text-[12px] font-medium leading-relaxed text-white/72">
            Créditos são usados para solicitar testes comportamentais e acompanhar avaliações no processo seletivo.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-[18px] font-semibold text-[#343241]">Uso do plano</h3>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Acompanhe limites e recursos disponíveis para a empresa ativa.</p>
            </div>
            <span className="inline-flex h-8 items-center rounded-xl border border-[#f3e5ff] bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff]">
              {jobUsagePercent.toFixed(0)}% usado
            </span>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-4 text-[12px] font-semibold text-[#343241]">
                <span className="flex items-center gap-2"><Briefcase size={15} className="text-[#940dff]" /> Vagas ativas</span>
                <span>{activeJobsCount} / Ilimitado</span>
              </div>
              <div className="h-3 rounded-full border border-slate-200/70 bg-[#fbf9ff] p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${jobUsagePercent}%` }}
                  className={`h-full rounded-full ${jobUsagePercent >= 100 ? 'bg-[#ff4b8c]' : jobUsagePercent >= 75 ? 'bg-[#ffc24b]' : 'bg-[#940dff]'}`}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                />
              </div>
              {jobUsagePercent >= 100 && (
                <p className="mt-2 text-[12px] font-semibold text-[#ff4b8c]">Limite atingido. Faça upgrade para publicar mais vagas.</p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]"><Brain size={18} /></span>
                  <div>
                    <p className="text-[12px] font-semibold text-[#343241]">Testes disponíveis</p>
                    <p className="mt-1 text-[12px] font-medium text-slate-400">{credits === Infinity ? 'Ilimitadas' : `${credits} solicitações`}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#533af6]/10 text-[#533af6]"><Search size={18} /></span>
                  <div>
                    <p className="text-[12px] font-semibold text-[#343241]">Banco de talentos</p>
                    <p className="mt-1 text-[12px] font-medium text-slate-400">{plan === 'starter' ? 'Recursos avançados bloqueados' : 'Recursos avançados liberados'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Planos</h3>
          <p className="mt-2 text-[12px] font-medium text-slate-400">Escolha o plano que combina melhor com o volume de recrutamento da empresa.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {(['starter', 'growth', 'enterprise'] as PlanKey[]).map((planName) => {
            const isCurrent = plan === planName;
            const isFeatured = planName === 'growth';

            return (
              <article
                key={planName}
                className={`relative flex min-h-[430px] flex-col rounded-2xl border bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] transition-all hover:border-[#940dff]/20 ${
                  isCurrent ? 'border-[#940dff]/24 ring-2 ring-[#f3e5ff]' : 'border-slate-200/70'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-[18px] font-semibold text-[#343241]">{planLabels[planName]}</h4>
                    <p className="mt-2 text-[12px] font-medium leading-relaxed text-slate-400">{planDescriptions[planName]}</p>
                  </div>
                  {isCurrent ? (
                    <span className="inline-flex h-8 shrink-0 items-center rounded-xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 px-3 text-[12px] font-semibold text-[#2f9f6b]">Ativo</span>
                  ) : isFeatured ? (
                    <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-xl border border-[#ffc24b]/24 bg-[#ffc24b]/16 px-3 text-[12px] font-semibold text-[#ffa303]"><Zap size={13} /> Popular</span>
                  ) : null}
                </div>

                <div className="mt-5 flex items-end gap-1">
                  <span className="text-[24px] font-semibold tracking-tight text-[#343241]">{planPrices[planName]}</span>
                  {planName !== 'enterprise' && <span className="pb-1 text-[12px] font-medium text-slate-400">/ mês</span>}
                </div>

                <div className="my-5 h-px bg-slate-100" />

                <ul className="space-y-3">
                  {planFeatures[planName].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[12px] font-medium leading-relaxed text-slate-500">
                      <Check size={14} className="mt-0.5 shrink-0 text-[#63e1a5]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={isCurrent || !company}
                  onClick={() => handleStartUpgrade(planName)}
                  className={`mt-auto h-8 rounded-xl px-4 text-[12px] font-semibold transition-all active:scale-95 disabled:cursor-default ${
                    isCurrent
                      ? 'border border-slate-200/70 bg-white text-slate-400'
                      : isFeatured
                        ? 'bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] hover:bg-[#8200e6]'
                        : 'border border-[#940dff]/16 bg-[#f3e5ff] text-[#940dff] hover:border-[#940dff]/28 hover:bg-[#940dff]/12'
                  }`}
                >
                  {renderPlanButtonLabel(planName)}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {false && <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Comprar créditos</h3>
                <p className="mt-2 max-w-2xl text-[12px] font-medium leading-relaxed text-slate-400">
                  Adquira créditos avulsos para solicitar testes comportamentais sob demanda. Lotes maiores aplicam desconto automaticamente.
                </p>
              </div>
              <span className="hidden h-8 items-center gap-1.5 rounded-xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 px-3 text-[12px] font-semibold text-[#2f9f6b] sm:inline-flex">
                <Sparkles size={13} /> Add-on
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[12px] font-semibold text-[#343241]">Quantidade de créditos</p>
                  <p className="mt-1 text-[12px] font-medium text-slate-400">Mínimo de 5 e máximo de 100 créditos por compra.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCreditAmount(prev => Math.max(5, prev - 5))}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-500 transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
                    aria-label="Diminuir créditos"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-14 text-center text-[20px] font-semibold text-[#343241]">{creditAmount}</span>
                  <button
                    type="button"
                    onClick={() => setCreditAmount(prev => Math.min(100, prev + 5))}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-500 transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
                    aria-label="Aumentar créditos"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {savings > 0 ? (
              <div className="mt-4 rounded-2xl border border-[#63e1a5]/25 bg-[#63e1a5]/14 px-4 py-3 text-[12px] font-semibold text-[#2f9f6b]">
                Você está economizando {currency(savings)} com desconto progressivo.
              </div>
            ) : (
              <p className="mt-4 text-[12px] font-medium text-slate-400">Dica: compre 15 ou mais créditos para ativar desconto progressivo.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-5">
            <h4 className="text-[16px] font-semibold text-[#343241]">Resumo</h4>
            <div className="mt-4 space-y-3 text-[12px] font-medium text-slate-500">
              <div className="flex justify-between gap-4">
                <span>{creditAmount} créditos</span>
                <span>{currency(standardPrice)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Valor por crédito</span>
                <span>{currency(unitPrice)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between gap-4 text-[#2f9f6b]">
                  <span>Desconto</span>
                  <span>- {currency(savings)}</span>
                </div>
              )}
              <div className="h-px bg-slate-200/70" />
              <div className="flex items-baseline justify-between gap-4 text-[#343241]">
                <span className="font-semibold">Total</span>
                <span className="text-[22px] font-semibold">{currency(totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartBuyCredits}
              disabled={!company}
              className="mt-5 flex h-8 w-full items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Comprar créditos <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>}

      <AnimatePresence>
        {isUpgrading && (
          <div className="company-dashboard-surface fixed inset-0 z-[2147483647] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessingUpgrade && !upgradeSuccess && setIsUpgrading(false)}
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              className="relative w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-6 text-center shadow-2xl"
            >
              {upgradeSuccess ? (
                <div className="py-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63e1a5]/14 text-[#2f9f6b]">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold tracking-tight text-[#343241]">Assinatura ativada</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[12px] font-medium leading-relaxed text-slate-400">
                    Seu plano foi alterado para {upgradingTo ? planLabels[upgradingTo] : 'o novo plano'} e os limites do plano já foram aplicados.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
                    <CreditCard size={22} />
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold tracking-tight text-[#343241]">Confirmar assinatura</h3>
                  <p className="mt-2 text-[12px] font-medium text-slate-400">
                    Você está ativando o plano {upgradingTo ? planLabels[upgradingTo] : ''}.
                  </p>

                  <div className="mt-5 rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4 text-left">
                    <div className="flex justify-between text-[12px] font-medium text-slate-500">
                      <span>Valor mensal</span>
                      <span>{upgradingTo ? planPrices[upgradingTo] : '-'}</span>
                    </div>
                    <div className="mt-3 flex justify-between text-[12px] font-medium text-slate-500">
                      <span>Testes mensais</span>
                      <span>{upgradingTo ? (upgradingTo === 'enterprise' ? 'Ilimitados' : `${getDefaultCreditsForPlan(upgradingTo)} envios`) : '-'}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-[12px] font-medium text-slate-400">Simulação: não haverá cobrança real no cartão.</p>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      disabled={isProcessingUpgrade}
                      onClick={() => setIsUpgrading(false)}
                      className="h-8 flex-1 rounded-xl border border-slate-200/70 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingUpgrade}
                      onClick={handleConfirmUpgrade}
                      className="flex h-8 flex-1 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:opacity-50"
                    >
                      {isProcessingUpgrade ? <><Loader2 size={14} className="animate-spin" /> Processando</> : 'Confirmar'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {isBuyingCredits && (
          <div className="company-dashboard-surface fixed inset-0 z-[2147483647] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessingCredits && !creditsSuccess && setIsBuyingCredits(false)}
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              className="relative w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-6 text-center shadow-2xl"
            >
              {creditsSuccess ? (
                <div className="py-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63e1a5]/14 text-[#2f9f6b]">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold tracking-tight text-[#343241]">Compra concluída</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[12px] font-medium leading-relaxed text-slate-400">
                    {creditAmount} créditos foram adicionados ao saldo da empresa {company?.nomeFantasia}.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
                    <Brain size={22} />
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold tracking-tight text-[#343241]">Confirmar créditos</h3>
                  <p className="mt-2 text-[12px] font-medium text-slate-400">Adquirir pacote de créditos adicionais.</p>

                  <div className="mt-5 rounded-2xl border border-slate-200/70 bg-[#fbf9ff] p-4 text-left">
                    <div className="flex justify-between text-[12px] font-medium text-slate-500">
                      <span>Quantidade</span>
                      <span>{creditAmount} créditos</span>
                    </div>
                    <div className="mt-3 flex justify-between text-[12px] font-medium text-slate-500">
                      <span>Valor unitário</span>
                      <span>{currency(unitPrice)}</span>
                    </div>
                    <div className="my-3 h-px bg-slate-200/70" />
                    <div className="flex justify-between text-[13px] font-semibold text-[#343241]">
                      <span>Total</span>
                      <span>{currency(totalPrice)}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-[12px] font-medium text-slate-400">Simulação: não haverá cobrança real no cartão.</p>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      disabled={isProcessingCredits}
                      onClick={() => setIsBuyingCredits(false)}
                      className="h-8 flex-1 rounded-xl border border-slate-200/70 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingCredits}
                      onClick={handleConfirmBuyCredits}
                      className="flex h-8 flex-1 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:opacity-50"
                    >
                      {isProcessingCredits ? <><Loader2 size={14} className="animate-spin" /> Processando</> : 'Confirmar'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};




