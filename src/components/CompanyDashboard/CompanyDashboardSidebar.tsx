import { useEffect, useState } from 'react';
import {
  Award,
  BarChart3,
  Briefcase,
  Building,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LogOut,
  PlusCircle,
  Search,
  Settings,
  Video,
  X as CloseIcon,
} from 'lucide-react';
import type { CompanyRecord } from '../../services/companyService';
import { SidebarItem } from './CompanyDashboardLayout';
import { navigateToCompanyTab } from '../../utils/appRoutes';

export interface CompanyDashboardSidebarProps {
  activeTab: string;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  isSidebarExpanded?: boolean;
  setIsSidebarExpanded?: (isExpanded: boolean) => void;
  selectedCompany?: CompanyRecord | null;
  companies?: CompanyRecord[];
  selectedCompanyId?: string;
  setSelectedCompanyId?: (id: string) => void;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { icon: BarChart3, label: 'Dashboard' },
  { icon: PlusCircle, label: 'Cadastrar Vaga' },
  { icon: Briefcase, label: 'Minhas Vagas' },
  { icon: Search, label: 'Banco de Talentos' },
  { icon: Building, label: 'Empresas' },
  { icon: Award, label: 'Avaliações' },
  { icon: Video, label: 'Entrevistas' },
  { icon: CreditCard, label: 'Faturamento' },
];

const settingsItem = { icon: Settings, label: 'Configurações' };

export const CompanyDashboardSidebar = ({
  activeTab,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isSidebarExpanded = false,
  setIsSidebarExpanded,
  selectedCompany,
  companies = [],
  selectedCompanyId,
  setSelectedCompanyId,
  onSelectTab,
  onLogout,
}: CompanyDashboardSidebarProps) => {
  const [isMobileCompanySelectorOpen, setIsMobileCompanySelectorOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [isMobileSidebarOpen]);

  const selectMobileTab = (tab: string) => {
    onSelectTab(tab);
    setIsMobileSidebarOpen(false);
  };

  const selectMobileCompany = (companyId: string) => {
    setSelectedCompanyId?.(companyId);
    setIsMobileCompanySelectorOpen(false);
  };

  const companyName = selectedCompany?.nomeFantasia || selectedCompany?.razaoSocial || 'Colaborh';
  const companyInitials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'CO';
  const mobileItems = [...menuItems, settingsItem];

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/35 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:z-[100] lg:h-screen lg:bg-white/95 lg:backdrop-blur-xl lg:border-r lg:border-slate-100 lg:shadow-[4px_0_24px_rgba(106,66,220,0.04)] lg:transition-[width] lg:duration-300 lg:shrink-0 ${
        isSidebarExpanded ? 'lg:w-52' : 'lg:w-14'
      }`}>
        <div className="h-[65px] px-2 flex items-center justify-center border-b border-slate-100/70 relative">
          {isSidebarExpanded ? (
            <img src="/logo.png" alt="Colaborh" className="h-9 w-auto max-w-[130px] object-contain" />
          ) : (
            <img src="/logo-icon.png" alt="Colaborh" className="h-8 w-8 object-contain" />
          )}

        </div>

        <nav className={`flex-1 w-full flex flex-col gap-2 py-5 ${isSidebarExpanded ? 'px-3' : 'px-2'}`}>
          {menuItems.map((item) => (
            <div key={item.label}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                activeTab={activeTab}
                setActiveTab={onSelectTab}
                isSidebarExpanded={isSidebarExpanded}
              />
            </div>
          ))}
        </nav>

        <div className={`border-t border-slate-100/70 flex flex-col gap-2 ${isSidebarExpanded ? 'p-3' : 'p-2 items-center'}`}>
          <button
            type="button"
            onClick={() => setIsSidebarExpanded?.(!isSidebarExpanded)}
            className={`h-10 rounded-xl text-slate-400 hover:bg-[#f3e5ff] hover:text-[#940dff] transition-all flex items-center gap-3 cursor-pointer ${
              isSidebarExpanded ? 'w-full px-3 justify-start' : 'w-10 justify-center'
            }`}
            title={isSidebarExpanded ? 'Recolher menu' : 'Expandir menu'}
            aria-label={isSidebarExpanded ? 'Recolher menu' : 'Expandir menu'}
          >
            {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            {isSidebarExpanded && (
              <span className="text-[10px] font-black uppercase tracking-widest">Recolher</span>
            )}
          </button>
          <SidebarItem
            icon={settingsItem.icon}
            label={settingsItem.label}
            activeTab={activeTab}
            setActiveTab={onSelectTab}
            isSidebarExpanded={isSidebarExpanded}
          />
          <button
            type="button"
            onClick={onLogout}
            className={`h-10 rounded-xl text-slate-400 hover:bg-[#ff4b8c]/10 hover:text-[#ff4b8c] transition-all flex items-center gap-3 cursor-pointer ${
              isSidebarExpanded ? 'w-full px-3 justify-start' : 'w-10 justify-center'
            }`}
            title="Sair"
          >
            <LogOut size={16} />
            {isSidebarExpanded && (
              <span className="text-[10px] font-black uppercase tracking-widest">Sair</span>
            )}
          </button>
        </div>
      </aside>

      <aside className={`company-mobile-sidebar fixed inset-0 z-[100] flex h-dvh w-full touch-auto flex-col overflow-y-auto overscroll-contain rounded-none bg-[#940dff] px-3 py-3 text-white shadow-2xl transition-transform duration-300 lg:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="absolute right-3 top-3 z-30 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-sm transition-all active:scale-95"
            title="Fechar menu"
          >
            <CloseIcon size={23} />
          </button>
        </div>

        <div className="mt-2 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/18 text-[20px] font-semibold text-white shadow-[0_14px_36px_rgba(62,0,135,0.18)]">
            {selectedCompany?.logo ? (
              <img src={selectedCompany.logo} alt={companyName} className="h-full w-full object-cover" />
            ) : (
              companyInitials
            )}
          </div>
          <p className="mt-3 max-w-[260px] truncate text-[17px] font-semibold leading-tight text-white">{companyName}</p>
          <p className="mt-1 text-[12px] font-medium text-white/70">Empresa</p>
        </div>

        <div className="relative z-20 mt-5">
          <button
            type="button"
            onClick={() => setIsMobileCompanySelectorOpen((isOpen) => !isOpen)}
            className="flex min-h-[42px] w-full items-center justify-between rounded-[22px] border border-white/20 bg-white/15 px-4 py-2 text-left text-white shadow-sm transition-all active:scale-[0.99]"
          >
            <span className="flex min-w-0 items-center gap-3">
              <BarChart3 size={18} className="shrink-0 text-white" />
              <span className="truncate text-[12px] font-semibold uppercase tracking-wide">{companyName}</span>
            </span>
            <ChevronDown size={18} className={`shrink-0 text-white/70 transition-transform ${isMobileCompanySelectorOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMobileCompanySelectorOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] max-h-56 overflow-y-auto rounded-2xl border border-[#940dff]/12 bg-white shadow-[0_18px_40px_rgba(25,18,45,0.14)] divide-y divide-slate-100">
              {companies.length > 0 ? (
                companies.map((company) => {
                  const isSelected = selectedCompanyId === company.id;

                  return (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => selectMobileCompany(company.id)}
                      className={`flex min-h-[42px] w-full items-center justify-between px-4 text-left transition-all ${
                        isSelected ? 'text-[#940dff]' : 'text-slate-500 hover:bg-[#f3e5ff]/60 hover:text-[#940dff]'
                      }`}
                    >
                      <span className="min-w-0 truncate text-[12px] font-semibold">{company.nomeFantasia}</span>
                      {isSelected && <span className="h-2 w-2 rounded-full bg-[#63e1a5]" />}
                    </button>
                  );
                })
              ) : (
                <p className="px-4 py-3 text-[12px] font-medium text-slate-400">Nenhuma empresa cadastrada</p>
              )}
            </div>
          )}
        </div>

        <nav className="mt-6 grid grid-cols-3 gap-3 pb-6">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => selectMobileTab(item.label)}
                className={`flex aspect-square min-h-[104px] flex-col items-center justify-center gap-2 rounded-lg border text-center shadow-sm transition-all active:scale-95 ${
                  isActive ? 'border-white bg-white text-[#940dff] shadow-[0_12px_28px_rgba(255,255,255,0.18)]' : 'border-white/20 bg-white/12 text-white shadow-sm hover:border-white/35 hover:bg-white/18'
                }`}
              >
                <Icon size={24} className="stroke-[1.8]" />
                <span className="max-w-[86px] text-[11px] font-semibold uppercase leading-tight tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setIsMobileSidebarOpen(false);
              onLogout();
            }}
            className="flex aspect-square min-h-[104px] flex-col items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/12 text-center text-white shadow-sm transition-all hover:border-white/35 hover:bg-white/18 active:scale-95"
          >
            <LogOut size={24} className="stroke-[1.8]" />
            <span className="text-[11px] font-semibold uppercase leading-tight tracking-tight">Sair</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

