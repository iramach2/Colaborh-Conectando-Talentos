import React from 'react';
import { Bell, Check, Filter, Menu, MessageSquare, Plus, Search } from 'lucide-react';
import type { CompanyRecord } from '../../services/companyService';
import type { CustomQuestionnaire } from '../../services/customQuestionnaireService';
import type { CompanyApplication, CompanyJob } from '../../types/companyDashboard';
import type { ColaborhNotification } from '../../utils/notificationUtils';

export interface CompanyDashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  setIsNotificationsDrawerOpen: (isOpen: boolean) => void;
  openMessagesDrawer: () => void;
  notifications: ColaborhNotification[];
  companyDropdownRef: React.RefObject<HTMLDivElement>;
  profileMenuRef: React.RefObject<HTMLDivElement>;
  isCompanyDropdownOpen: boolean;
  setIsCompanyDropdownOpen: (isOpen: boolean) => void;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (isOpen: boolean) => void;
  selectedCompany: CompanyRecord | null;
  companies: CompanyRecord[];
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  companySearchQuery: string;
  setCompanySearchQuery: (query: string) => void;
  resetCompanyForm: () => void;
  setIsRegisteringCompany: (isOpen: boolean) => void;
  onLogout: () => void;
  companyApplications: CompanyApplication[];
  customTemplates: CustomQuestionnaire[];
  resultsSubTab: 'relatorios' | 'guia' | 'criar';
  setResultsSubTab: (tab: 'relatorios' | 'guia' | 'criar') => void;
  onStartNewTemplate: () => void;
  selectedJob: CompanyJob | null;
  jobSearch: string;
  setJobSearch: (value: string) => void;
  isJobSearchFocused: boolean;
  setIsJobSearchFocused: (isFocused: boolean) => void;
  talentSearch: string;
  setTalentSearch: (value: string) => void;
  setIsFilterSidebarOpen: (isOpen: boolean) => void;
}

export const CompanyDashboardHeader = ({
  activeTab,
  setActiveTab,
  setIsMobileSidebarOpen,
  setIsNotificationsDrawerOpen,
  openMessagesDrawer,
  notifications,
  companyDropdownRef,
  isCompanyDropdownOpen,
  setIsCompanyDropdownOpen,
  selectedCompany,
  companies,
  selectedCompanyId,
  setSelectedCompanyId,
  companySearchQuery,
  setCompanySearchQuery,
  resetCompanyForm,
  setIsRegisteringCompany,
  companyApplications,
  customTemplates,
  resultsSubTab,
  setResultsSubTab,
  onStartNewTemplate,
  selectedJob,
  jobSearch,
  setJobSearch,
  isJobSearchFocused,
  setIsJobSearchFocused,
  talentSearch,
  setTalentSearch,
  setIsFilterSidebarOpen
}: CompanyDashboardHeaderProps) => {
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const filteredCompanies = companies.filter(company =>
    company.nomeFantasia.toLowerCase().includes(companySearchQuery.toLowerCase())
  );
  const showJobSearch = activeTab === 'Minhas Vagas';
  const showTalentSearch = activeTab === 'Banco de Talentos';

  return (
    <header data-company-dashboard-header className="sticky top-0 z-40 w-full rounded-none bg-white px-4 py-3 transition-all duration-300 lg:px-10">
      <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border-0 bg-transparent p-0 text-slate-400 transition-all hover:bg-[#f8f6ff] hover:text-[#940dff] lg:hidden"
              title="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="truncate text-[20px] font-semibold tracking-tight text-[#343241] lg:hidden">{activeTab}</h1>
          </div>
          <div className="hidden min-w-0 items-center gap-3 text-left lg:flex">
            <h1 className="truncate text-xl font-semibold tracking-tight text-[#343241]">{activeTab}</h1>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-4">
          {showJobSearch && (
            <div className="hidden lg:block relative min-w-0">
              <input
                type="text"
                value={jobSearch}
                onChange={(event) => setJobSearch(event.target.value)}
                onFocus={() => setIsJobSearchFocused(true)}
                onBlur={() => setIsJobSearchFocused(false)}
                placeholder={selectedJob ? "Pesquisar candidatos..." : "Pesquisar vagas..."}
                className={`h-9 w-80 rounded-[999px] pl-5 pr-12 bg-white/90 border text-[12px] font-semibold text-slate-600 placeholder:text-slate-400 outline-none shadow-sm transition-all ${
                  isJobSearchFocused || jobSearch
                    ? 'border-[#940dff]/25 bg-white'
                    : 'border-slate-100 hover:bg-white'
                }`}
              />
              <Search size={15} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#940dff]" />
            </div>
          )}

          {showTalentSearch && (
            <>
              <div className="hidden lg:block relative min-w-0">
                <input
                  type="text"
                  value={talentSearch}
                  onChange={(event) => setTalentSearch(event.target.value)}
                  placeholder="Pesquisar talentos..."
                  className={`h-9 w-80 rounded-[999px] pl-5 pr-12 bg-white/90 border text-[12px] font-semibold text-slate-600 placeholder:text-slate-400 outline-none shadow-sm transition-all ${
                    talentSearch
                      ? 'border-[#940dff]/25 bg-white'
                      : 'border-slate-100 hover:bg-white'
                  }`}
                />
                <Search size={15} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#940dff]" />
              </div>

              <button
                type="button"
                onClick={() => setIsFilterSidebarOpen(true)}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-sm shadow-[#940dff]/15 transition-all hover:scale-105 hover:bg-[#8200e6] active:scale-95 lg:h-9 lg:w-9"
                title="Filtros"
              >
                <Filter size={15} />
              </button>
            </>
          )}

          <button
            onClick={openMessagesDrawer}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-sm shadow-[#940dff]/15 transition-all hover:scale-105 hover:bg-[#8200e6] active:scale-95 lg:h-9 lg:w-9"
            title="Mensagens"
          >
            <MessageSquare size={15} />
          </button>

          <button
            onClick={() => setIsNotificationsDrawerOpen(true)}
            className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-sm shadow-[#940dff]/15 transition-all hover:scale-105 hover:bg-[#8200e6] active:scale-95 lg:h-9 lg:w-9"
            title={'Notificações'}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#ff4b8c] text-white text-[8px] font-semibold rounded-full flex items-center justify-center border border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="hidden h-6 w-[1px] bg-slate-200 lg:block" />

          <div className="relative hidden lg:block" ref={companyDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-white p-0 shadow-sm ring-2 ring-white transition-transform hover:scale-105 focus:outline-none active:scale-95 lg:h-9 lg:w-9"
              title="Trocar empresa"
            >
              {selectedCompany?.logo ? (
                <img src={selectedCompany.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-600 font-semibold text-xs">
                  {selectedCompany?.nomeFantasia ? selectedCompany.nomeFantasia.substring(0, 2).toUpperCase() : 'CO'}
                </span>
              )}
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-[0_18px_50px_rgba(106,66,220,0.10)] z-[200] overflow-hidden py-3 text-left">
                <div className="px-4 pb-3">
                  <p className="text-[10px] font-semibold text-[#6a42dc] leading-none mb-1">Trocar empresa</p>
                  <p className="text-xs font-semibold text-slate-700 truncate">{selectedCompany?.nomeFantasia || 'Empresa ativa'}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{selectedCompany?.razaoSocial}</p>
                </div>

                <div className="px-3 pb-3">
                  <div className="flex items-center gap-2 bg-slate-100/60 rounded-full px-3.5 py-2 w-full">
                    <Search size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={companySearchQuery}
                      onChange={(event) => setCompanySearchQuery(event.target.value)}
                      placeholder="Nome da empresa"
                      className="bg-transparent border border-transparent outline-none font-semibold text-xs text-slate-700 p-0 w-full focus:ring-0 placeholder:text-slate-400 placeholder:font-normal"
                      onClick={(event) => event.stopPropagation()}
                    />
                  </div>
                </div>

                <div className="border-b border-slate-100" />

                <div className="max-h-60 overflow-y-auto pt-2">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      onClick={() => {
                        setSelectedCompanyId(company.id);
                        setIsCompanyDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[#f8f6ff] cursor-pointer ${
                        selectedCompanyId === company.id ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block font-semibold text-xs text-slate-700 truncate">{company.nomeFantasia}</span>
                        <span className="block text-[10px] text-slate-400 truncate">{company.razaoSocial}</span>
                      </div>
                      {selectedCompanyId === company.id && <Check size={12} className="text-[#6a42dc] shrink-0" />}
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCompanyId('new');
                      resetCompanyForm();
                      setIsRegisteringCompany(true);
                      setActiveTab('Empresas');
                      setIsCompanyDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#6a42dc] hover:bg-[#5933c8] text-white rounded-xl text-[11px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95 border-0"
                  >
                    <Plus size={12} className="stroke-[2.5]" /> Cadastrar Empresa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </header>
  );
};





