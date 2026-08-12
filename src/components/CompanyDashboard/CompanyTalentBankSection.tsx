import { type Dispatch, type SetStateAction } from 'react';
import { motion } from 'motion/react';
import { Bookmark, User } from 'lucide-react';
import { TalentBankTab } from './tabs/TalentBankTab';
import { filterTalentProfiles, type TalentFilters, type TalentProfile } from '../../hooks/useCompanyTalentBank';
import type { CompanyRecord } from '../../services/companyService';
import type { CompanyApplicant } from '../../types/companyDashboard';

interface CompanyTalentBankSectionProps {
  companies: CompanyRecord[];
  selectedCompanyId: string;
  talents: TalentProfile[];
  talentFilters: TalentFilters;
  talentSearch: string;
  talentSubTab: 'all' | 'saved';
  setTalentSubTab: Dispatch<SetStateAction<'all' | 'saved'>>;
  isAiSearching: boolean;
  aiPrompt: string;
  setAiPrompt: Dispatch<SetStateAction<string>>;
  handleAiSearch: () => void;
  isFiltersVisible: boolean;
  setIsFiltersVisible: Dispatch<SetStateAction<boolean>>;
  setTalentFilters: Dispatch<SetStateAction<TalentFilters>>;
  isTalentLoadingCities: boolean;
  talentCities: string[];
  setTalentSearch: Dispatch<SetStateAction<string>>;
  setIsFilterSidebarOpen: Dispatch<SetStateAction<boolean>>;
  filteredTalents: TalentProfile[];
  isFetchingTalents: boolean;
  talentPage: number;
  talentTotalPages: number;
  talentTotalCount: number;
  setSelectedResumeApplicant: Dispatch<SetStateAction<CompanyApplicant | null>>;
  handleToggleSaveTalent: (talentId: string) => void;
  handleTalentPageChange: (page: number) => void;
  canUseDirectWhatsApp: boolean;
  onPlanFeatureBlocked: (feature: string) => void;
}

export const CompanyTalentBankSection = ({
  companies,
  selectedCompanyId,
  talents,
  talentFilters,
  talentSearch,
  talentSubTab,
  setTalentSubTab,
  isAiSearching,
  aiPrompt,
  setAiPrompt,
  handleAiSearch,
  isFiltersVisible,
  setIsFiltersVisible,
  setTalentFilters,
  isTalentLoadingCities,
  talentCities,
  setTalentSearch,
  setIsFilterSidebarOpen,
  filteredTalents,
  isFetchingTalents,
  talentPage,
  talentTotalPages,
  talentTotalCount,
  setSelectedResumeApplicant,
  handleToggleSaveTalent,
  handleTalentPageChange,
  canUseDirectWhatsApp,
  onPlanFeatureBlocked
}: CompanyTalentBankSectionProps) => {  const selectedCompany = companies.find(company => company.id === selectedCompanyId);
  const savedTalentIds = selectedCompany?.savedTalents || [];
  const allCount = filterTalentProfiles(talents, {
    talentSubTab: 'all',
    savedTalentIds,
    talentSearch,
    talentFilters,
  }).length;
  const savedCount = filterTalentProfiles(talents, {
    talentSubTab: 'saved',
    savedTalentIds,
    talentSearch,
    talentFilters,
  }).length;

  const tabs = [
    { id: 'all' as const, label: 'Todos os talentos', count: allCount, icon: User },
    { id: 'saved' as const, label: 'Salvos', count: savedCount, icon: Bookmark }
  ];

  return (
    <div className="company-dashboard-surface w-full space-y-5 text-left">
      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((tab) => {
          const isActive = talentSubTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTalentSubTab(tab.id)}
              className={`relative flex h-[38px] min-w-[150px] items-center justify-center gap-2 bg-transparent px-4 py-2 text-[12px] font-semibold transition-colors ${
                isActive
                  ? 'text-[#940dff]'
                  : 'text-slate-500 hover:text-[#940dff]'
              }`}
            >
              <Icon size={14} className="stroke-[2.4]" />
              <span>{tab.label}</span>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-current' : 'text-slate-400'}`}>
                {tab.count}
              </span>
              {isActive && (
                <motion.span
                  layoutId="company-talent-bank-tab-underline"
                  className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#940dff]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <TalentBankTab
        filteredTalents={filteredTalents}
        isFetchingTalents={isFetchingTalents}
        talentPage={talentPage}
        talentTotalPages={talentTotalPages}
        talentTotalCount={talentTotalCount}
        setSelectedResumeApplicant={setSelectedResumeApplicant}
        selectedCompany={selectedCompany}
        handleToggleSaveTalent={handleToggleSaveTalent}
        onTalentPageChange={handleTalentPageChange}
        talentSubTab={talentSubTab}
        canUseDirectWhatsApp={canUseDirectWhatsApp}
        onPlanFeatureBlocked={onPlanFeatureBlocked}
      />
    </div>
  );
};

