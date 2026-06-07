import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Building, 
  Briefcase, 
  Search, 
  Brain, 
  Plus, 
  Minus, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface BillingTabProps {
  company: any;
  companies: any[];
  setCompanies: React.Dispatch<React.SetStateAction<any[]>>;
  jobs: any[];
}

export const BillingTab: React.FC<BillingTabProps> = ({
  company,
  companies,
  setCompanies,
  jobs
}) => {
  // Estados para simulação de checkout do plano
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradingTo, setUpgradingTo] = useState<string | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Estados para simulação de compra de créditos avulsos
  const [creditAmount, setCreditAmount] = useState(10);
  const [isBuyingCredits, setIsBuyingCredits] = useState(false);
  const [isProcessingCredits, setIsProcessingCredits] = useState(false);
  const [creditsSuccess, setCreditsSuccess] = useState(false);

  // Informações da empresa ativa
  const plan = company?.plan || 'starter';
  const credits = company?.credits !== undefined ? company?.credits : 5;

  // Calcular vagas ativas da empresa no Supabase
  const activeJobsCount = jobs.filter(job => 
    job.company_name === company?.nomeFantasia && 
    (job.status === 'active' || job.status === 'ativa' || !job.status)
  ).length;

  // Definir limites de vagas com base no plano
  const getJobLimit = () => {
    if (plan === 'growth') return 8;
    if (plan === 'enterprise') return Infinity;
    return 2; // starter
  };
  const jobLimit = getJobLimit();
  const jobUsagePercent = jobLimit === Infinity ? 0 : Math.min(100, (activeJobsCount / jobLimit) * 100);

  // Calcular valor dinâmico dos créditos com descontos progressivos
  const getCreditUnitPrice = (amount: number) => {
    if (amount >= 50) return 9.00; // Desconto em lote grande
    if (amount >= 15) return 12.00; // Desconto em lote médio
    return 15.00; // Preço padrão
  };
  const unitPrice = getCreditUnitPrice(creditAmount);
  const totalPrice = creditAmount * unitPrice;
  const standardPrice = creditAmount * 15.00;
  const savings = standardPrice - totalPrice;

  // Processar o upgrade simulado de plano
  const handleStartUpgrade = (planName: string) => {
    setUpgradingTo(planName);
    setIsUpgrading(true);
    setUpgradeSuccess(false);
  };

  const handleConfirmUpgrade = () => {
    setIsProcessingUpgrade(true);
    setTimeout(() => {
      setIsProcessingUpgrade(false);
      setUpgradeSuccess(true);
      
      // Atualizar no localStorage e no estado das empresas
      const updated = companies.map(c => {
        if (c.id === company.id) {
          return {
            ...c,
            plan: upgradingTo,
            credits: c.credits + (upgradingTo === 'growth' ? 30 : 100) // Adiciona créditos bônus da assinatura
          };
        }
        return c;
      });
      setCompanies(updated);

      setTimeout(() => {
        setIsUpgrading(false);
        setUpgradeSuccess(false);
        setUpgradingTo(null);
      }, 2500);
    }, 2000);
  };

  // Processar a compra simulada de créditos
  const handleStartBuyCredits = () => {
    setIsBuyingCredits(true);
    setCreditsSuccess(false);
  };

  const handleConfirmBuyCredits = () => {
    setIsProcessingCredits(true);
    setTimeout(() => {
      setIsProcessingCredits(false);
      setCreditsSuccess(true);

      // Atualizar saldo de créditos no localStorage e no estado das empresas
      const updated = companies.map(c => {
        if (c.id === company.id) {
          return {
            ...c,
            credits: (c.credits !== undefined ? c.credits : 5) + creditAmount
          };
        }
        return c;
      });
      setCompanies(updated);

      setTimeout(() => {
        setIsBuyingCredits(false);
        setCreditsSuccess(false);
      }, 2500);
    }, 2000);
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto pb-10">
      
      {/* Banner Principal com Cartão de Crédito 3D */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Card de Créditos e Faturamento */}
        <div className="lg:col-span-1 bg-gradient-to-br from-primary-600 via-primary-700 to-highlight-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-64 border border-white/10 group hover:shadow-2xl transition-all duration-300">
          {/* Decorações do Cartão */}
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-[40px] pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-[-15%] left-[-15%] w-32 h-32 bg-highlight-500/30 rounded-full blur-[30px] pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black uppercase tracking-widest text-primary-200">Faturamento Colaborh</p>
              <h3 className="text-base font-black truncate max-w-[180px]">{company?.nomeFantasia}</h3>
            </div>
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <CreditCard size={18} className="text-white" />
            </div>
          </div>

          <div className="relative z-10 space-y-1 my-4">
            <p className="text-[10px] font-extrabold text-primary-100 uppercase tracking-wider">SALDO DE CRÉDITOS</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black tracking-tight">{credits}</span>
              <span className="text-[11px] font-black text-primary-200 uppercase tracking-widest">Crédito{credits !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-[9px] text-primary-200/80 font-bold mt-1">Utilizados para disparar testes comportamentais</p>
          </div>

          <div className="flex justify-between items-center relative z-10 pt-2 border-t border-white/10">
            <div>
              <p className="text-[8px] font-black text-primary-200 uppercase tracking-widest leading-none">PLANO ATUAL</p>
              <span className="text-xs font-black uppercase tracking-wider text-white bg-white/20 px-2.5 py-0.5 rounded-full inline-block mt-1">
                {plan === 'starter' ? 'Starter' : plan === 'growth' ? 'Growth' : 'Enterprise'}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary-200 leading-none">100% SEGURO</span>
          </div>
        </div>

        {/* Consumo de Recursos */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sleek flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Utilização dos Recursos</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acompanhe seus limites de acordo com o plano ativo</p>
          </div>

          <div className="space-y-5">
            {/* Vagas Ativas */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-400" /> Vagas Ativas</span>
                <span>{activeJobsCount} / {jobLimit === Infinity ? 'Ilimitado' : jobLimit}</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${jobUsagePercent}%` }}
                  className={`h-full rounded-full ${jobUsagePercent >= 100 ? 'bg-rose-500' : jobUsagePercent >= 75 ? 'bg-amber-500' : 'bg-primary-600'}`}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{jobUsagePercent.toFixed(0)}% do limite utilizado</span>
                {jobUsagePercent >= 100 && (
                  <span className="text-rose-500 font-extrabold flex items-center gap-1">Limite Atingido! Faça Upgrade.</span>
                )}
              </div>
            </div>

            {/* Testes comportamentais e buscas com IA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                  <Brain size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Testes Disponíveis</h4>
                  <p className="text-sm font-extrabold text-slate-800">{credits} solicitações</p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Search size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buscas por IA no Banco</h4>
                  <p className="text-sm font-extrabold text-slate-800">
                    {plan === 'starter' ? '5 buscas / mês' : 'Ilimitadas'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planos de Assinatura */}
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Planos de Recorrência Mensal</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Assine o melhor plano para escalar seu recrutamento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Plano Starter */}
          <div className={`bg-white border rounded-[2.5rem] p-7 flex flex-col justify-between relative hover:shadow-lg transition-all duration-300 ${
            plan === 'starter' ? 'border-[#533af6] ring-2 ring-[#533af6]/10' : 'border-slate-200/80 shadow-xs'
          }`}>
            {plan === 'starter' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#533af6] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-md">
                Plano Ativo
              </span>
            )}
            <div>
              <div className="text-left mb-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Starter</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">R$ 189</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ mês</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Ideal para pequenas empresas avaliarem processos pontuais</p>
              </div>

              <div className="w-full h-[1px] bg-slate-100 mb-6" />

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Até <strong>2 vagas</strong> ativas simultâneas</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Triagem Kanban básica</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>5 buscas por IA no Banco / mês</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>5 créditos de testes inclusos / mês</span>
                </li>
              </ul>
            </div>

            <button 
              disabled={plan === 'starter'}
              onClick={() => handleStartUpgrade('starter')}
              className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border outline-none ${
                plan === 'starter' 
                  ? 'bg-slate-100 text-slate-450 border-transparent cursor-default' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer active:scale-95'
              }`}
            >
              {plan === 'starter' ? 'Seu Plano Atual' : 'Migrar para Starter'}
            </button>
          </div>

          {/* Plano Growth */}
          <div className={`bg-white border rounded-[2.5rem] p-7 flex flex-col justify-between relative hover:shadow-lg transition-all duration-300 ${
            plan === 'growth' ? 'border-[#533af6] ring-2 ring-[#533af6]/10' : 'border-slate-200/80 shadow-md shadow-slate-100/50'
          }`}>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-primary-600 to-highlight-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-md flex items-center gap-1.5">
              <Zap size={10} className="fill-current" /> O Mais Popular
            </span>
            {plan === 'growth' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#533af6] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-md">
                Plano Ativo
              </span>
            )}
            <div>
              <div className="text-left mb-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Growth</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">R$ 449</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ mês</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Perfeito para empresas em crescimento com processos frequentes</p>
              </div>

              <div className="w-full h-[1px] bg-slate-100 mb-6" />

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Até <strong>8 vagas</strong> ativas simultâneas</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Customização total de etapas no Kanban</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span><strong>Buscas Ilimitadas</strong> com IA no Banco</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span><strong>30 créditos</strong> de testes inclusos / mês</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Suporte prioritário via WhatsApp</span>
                </li>
              </ul>
            </div>

            <button 
              disabled={plan === 'growth'}
              onClick={() => handleStartUpgrade('growth')}
              className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all outline-none border shadow-md ${
                plan === 'growth' 
                  ? 'bg-slate-100 text-slate-450 border-transparent shadow-none cursor-default' 
                  : 'bg-[#533af6] text-white border-transparent hover:bg-[#4326e5] cursor-pointer hover:shadow-lg hover:shadow-primary-600/15 active:scale-95'
              }`}
            >
              {plan === 'growth' ? 'Seu Plano Atual' : 'Upgrade para Growth'}
            </button>
          </div>

          {/* Plano Enterprise */}
          <div className={`bg-white border rounded-[2.5rem] p-7 flex flex-col justify-between relative hover:shadow-lg transition-all duration-300 ${
            plan === 'enterprise' ? 'border-[#533af6] ring-2 ring-[#533af6]/10' : 'border-slate-200/80 shadow-xs'
          }`}>
            {plan === 'enterprise' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#533af6] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-md">
                Plano Ativo
              </span>
            )}
            <div>
              <div className="text-left mb-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Enterprise</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">Sob Consulta</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Para grandes corporações que necessitam de volume massivo</p>
              </div>

              <div className="w-full h-[1px] bg-slate-100 mb-6" />

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span><strong>Vagas Ativas Ilimitadas</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Todos os recursos liberados sem travas</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Faturamento flexível e relatórios customizados</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span><strong>100 créditos</strong> de testes inclusos / mês</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>Gerente de contas e SLA de suporte de 4h</span>
                </li>
              </ul>
            </div>

            <button 
              disabled={plan === 'enterprise'}
              onClick={() => handleStartUpgrade('enterprise')}
              className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border outline-none ${
                plan === 'enterprise' 
                  ? 'bg-slate-100 text-slate-450 border-transparent cursor-default' 
                  : 'bg-slate-900 text-white border-transparent hover:bg-slate-800 cursor-pointer active:scale-95'
              }`}
            >
              {plan === 'enterprise' ? 'Seu Plano Atual' : 'Falar com Consultor'}
            </button>
          </div>

        </div>
      </div>

      {/* Compra de Créditos Avulsos */}
      <div className="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sleek grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div>
            <span className="text-[8px] bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">Add-on Corporativo</span>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mt-3">Comprar Créditos de Testes Avulsos</h3>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
              Precisa avaliar mais candidatos? Adquira créditos sob demanda. Quanto maior o lote de créditos comportamentais que você adquire, menor é o valor unitário.
            </p>
          </div>

          {/* Slider/Contador Interativo */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">QUANTIDADE DE CRÉDITOS</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCreditAmount(prev => Math.max(5, prev - 5))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer outline-none active:scale-95"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xl font-black text-slate-800 w-12 text-center">{creditAmount}</span>
                <button 
                  onClick={() => setCreditAmount(prev => Math.min(100, prev + 5))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer outline-none active:scale-95"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">VALOR POR CRÉDITO</span>
              <span className="text-lg font-black text-[#533af6]">R$ {unitPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Benefício do desconto */}
          {savings > 0 ? (
            <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black uppercase tracking-wider bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100/30">
              <Sparkles size={12} className="fill-current" />
              <span>Desconto em Lote! Você está economizando R$ {savings.toFixed(2)} ({((savings/standardPrice)*100).toFixed(0)}% Off)</span>
            </div>
          ) : (
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1">
              Dica: Adicione 15 ou mais créditos para receber desconto progressivo!
            </div>
          )}
        </div>

        {/* Resumo Financeiro & Ação */}
        <div className="bg-slate-50/60 border border-slate-100 rounded-[2rem] p-6 flex flex-col justify-between h-full min-h-[200px]">
          <div>
            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest mb-3">Resumo da Aquisição</h4>
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wide">
                <span>{creditAmount}x Créditos Psicométricos</span>
                <span>R$ {(creditAmount * 15.00).toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-extrabold uppercase tracking-wide">
                  <span>Desconto Progressivo</span>
                  <span>- R$ {savings.toFixed(2)}</span>
                </div>
              )}
              <div className="w-full h-[1px] bg-slate-200/60 my-2" />
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">TOTAL A PAGAR</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStartBuyCredits}
            className="w-full mt-6 py-4 bg-[#533af6] hover:bg-[#4326e5] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-md hover:shadow-lg hover:shadow-primary-600/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border-0"
          >
            <span>Adquirir Créditos</span>
            <ArrowUpRight size={14} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Modal / Overlay de Checkout Simulado */}
      <AnimatePresence>
        {/* Checkout de Plano */}
        {isUpgrading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessingUpgrade && !upgradeSuccess && setIsUpgrading(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-7 overflow-hidden border border-slate-100 flex flex-col text-center"
            >
              {upgradeSuccess ? (
                <div className="py-6 space-y-4">
                  <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 ring-8 ring-emerald-50">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Assinatura Ativada!</h3>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-xs mx-auto uppercase tracking-wide">
                    Seu plano foi alterado para **{upgradingTo?.toUpperCase()}** e os créditos bônus foram adicionados ao seu saldo. Boas contratações!
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <CreditCard size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">Confirmar Assinatura</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Você está ativando o plano **{upgradingTo?.toUpperCase()}**
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Valor Mensal:</span>
                      <span>R$ {upgradingTo === 'growth' ? '449,00' : '189,00'}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                      <span>Créditos Inclusos:</span>
                      <span>{upgradingTo === 'growth' ? '30 créditos bônus' : '5 créditos bônus'}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">
                    Simulação: Não haverá cobrança real no seu cartão.
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isProcessingUpgrade}
                      onClick={() => setIsUpgrading(false)}
                      className="flex-1 py-3.5 bg-white hover:bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-slate-200 cursor-pointer disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingUpgrade}
                      onClick={handleConfirmUpgrade}
                      className="flex-1 py-3.5 bg-[#533af6] hover:bg-[#4326e5] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingUpgrade ? (
                        <><Loader2 size={12} className="animate-spin" /> Processando...</>
                      ) : (
                        'Confirmar'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Checkout de Créditos Avulsos */}
        {isBuyingCredits && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessingCredits && !creditsSuccess && setIsBuyingCredits(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-7 overflow-hidden border border-slate-100 flex flex-col text-center"
            >
              {creditsSuccess ? (
                <div className="py-6 space-y-4">
                  <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 ring-8 ring-emerald-50">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Compra Concluída!</h3>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-xs mx-auto uppercase tracking-wide">
                    **{creditAmount} créditos** foram adicionados com sucesso ao saldo da empresa **{company?.nomeFantasia}**.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <Brain size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">Confirmar Créditos</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Adquirir pacote de créditos adicionais
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Quantidade:</span>
                      <span>{creditAmount} créditos</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Valor Unitário:</span>
                      <span>R$ {unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-[1px] bg-slate-200/60 my-1" />
                    <div className="flex justify-between text-xs font-black text-slate-800">
                      <span>Valor Total:</span>
                      <span>R$ {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">
                    Simulação: Não haverá cobrança real no seu cartão.
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isProcessingCredits}
                      onClick={() => setIsBuyingCredits(false)}
                      className="flex-1 py-3.5 bg-white hover:bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-slate-200 cursor-pointer disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingCredits}
                      onClick={handleConfirmBuyCredits}
                      className="flex-1 py-3.5 bg-[#533af6] hover:bg-[#4326e5] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border-0 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingCredits ? (
                        <><Loader2 size={12} className="animate-spin" /> Processando...</>
                      ) : (
                        'Confirmar'
                      )}
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
