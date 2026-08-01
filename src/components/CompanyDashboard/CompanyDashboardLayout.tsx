import { type LucideIcon } from 'lucide-react';
import { LoadingAnimation } from '../Loader';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarExpanded: boolean;
}

const sidebarLabelAliases = new Map<string, string>([
  ['Avaliações', 'Avaliações'],
  ['Configurações', 'Configurações'],
]);

const getSidebarLabel = (label: string) => sidebarLabelAliases.get(label) || label;
export const DashboardSectionFallback = () => (
  <div className="w-full min-h-[320px] flex items-center justify-center">
    <LoadingAnimation message="Carregando modulo..." compact />
  </div>
);

export const OverlayFallback = () => (
  <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-sm flex items-center justify-center">
    <LoadingAnimation message="" compact />
  </div>
);

export const SidebarItem = ({ icon: Icon, label, activeTab, setActiveTab, isSidebarExpanded }: SidebarItemProps) => {
  const displayLabel = getSidebarLabel(label);
  const isActive = activeTab === displayLabel || activeTab === label;

  return (
    <div className="relative group/item w-full flex justify-center">
      <button
        onClick={() => setActiveTab(displayLabel)}
        aria-label={displayLabel}
        className={`flex items-center transition-all duration-200 ease-in-out h-10 rounded-xl
          ${isSidebarExpanded ? 'w-full px-3 justify-start gap-3' : 'w-10 px-0 justify-center gap-0'}
          ${isActive
            ? 'bg-[#f3efff] text-[#6a42dc] shadow-sm font-semibold'
            : 'text-slate-400 hover:bg-[#f8f6ff] hover:text-[#6a42dc]'
          }
        `}
      >
        <Icon size={16} className={`shrink-0 transition-colors duration-200 ${
          isActive ? 'text-[#6a42dc]' : 'text-slate-400 group-hover/item:text-[#6a42dc]'
        }`} />

        <span className={`font-semibold text-[12px] whitespace-nowrap transition-all duration-300 ease-in-out
          ${isSidebarExpanded ? 'opacity-100 w-auto' : 'lg:w-0 lg:opacity-0 lg:overflow-hidden'}
          ${isActive ? 'text-[#6a42dc]' : 'text-slate-500'}
        `}>
          {displayLabel}
        </span>
      </button>

      {!isSidebarExpanded && (
        <div className="hidden lg:block absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white text-slate-600 border border-slate-100 text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity duration-150 shadow-xl z-[120]">
          {displayLabel}
        </div>
      )}
    </div>
  );
};
