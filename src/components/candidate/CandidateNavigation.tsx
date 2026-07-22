import {
  Brain,
  FileText,
  LogOut,
  Settings,
  Star,
  Video,
  X as CloseIcon,
  type LucideIcon,
} from 'lucide-react';
import { navigateToCandidateTab } from '../../utils/appRoutes';

interface CandidateSidebarItemProps {
  icon: LucideIcon;
  label: string;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isSidebarExpanded: boolean;
  badgeCount?: number;
}

const CandidateSidebarItem = ({ icon: Icon, label, activeTab, onSelectTab, isSidebarExpanded, badgeCount = 0 }: CandidateSidebarItemProps) => {
  const isActive = activeTab === label;

  return (
    <div className="relative flex w-full justify-center group/item">
      <button
        type="button"
        onClick={() => onSelectTab(label)}
        className={`flex h-10 items-center rounded-xl transition-all duration-200 ease-in-out ${
          isSidebarExpanded ? 'w-full justify-start gap-3 px-3' : 'w-10 justify-center px-0'
        } ${
          isActive
            ? 'bg-[#f3e5ff] text-[#940dff] shadow-sm'
            : 'text-slate-400 hover:bg-[#f8f6ff] hover:text-[#940dff]'
        }`}
        title={label}
      >
        <span className="relative flex shrink-0 items-center justify-center">
          <Icon size={16} className={isActive ? 'text-[#940dff]' : 'text-slate-400 group-hover/item:text-[#940dff]'} />
          {badgeCount > 0 && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-[#ff4b8c]" />
          )}
        </span>

        <span className={`whitespace-nowrap text-[12px] font-semibold transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'w-auto opacity-100' : 'lg:w-0 lg:overflow-hidden lg:opacity-0'
        } ${isActive ? 'text-[#940dff]' : 'text-slate-500'}`}>
          {label}
        </span>
      </button>

      {!isSidebarExpanded && (
        <div className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-[120] hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-100 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 opacity-0 shadow-xl transition-opacity duration-150 group-hover/item:opacity-100 lg:block">
          {label}
        </div>
      )}
    </div>
  );
};

interface CandidateNavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingTestsCount: number;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isExpanded: boolean) => void;
  onLogout: () => void;
}

const navigationItems = [
  { label: 'Meu Currículo', icon: FileText },
  { label: 'Vagas', icon: Star },
  { label: 'Testes', icon: Brain },
  { label: 'Entrevistas', icon: Video },
];

const settingsItem = { label: 'Configurações', icon: Settings };

export function CandidateNavigation({
  activeTab,
  onSelectTab,
  pendingTestsCount,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isSidebarExpanded,
  setIsSidebarExpanded,
  onLogout,
}: CandidateNavigationProps) {
  const selectTab = (tab: string) => {
    onSelectTab(tab);
    navigateToCandidateTab(tab);
  };

  const selectMobileTab = (tab: string) => {
    selectTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`hidden lg:fixed lg:left-0 lg:top-0 lg:z-[100] lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-slate-100 lg:bg-white/95 lg:shadow-[4px_0_24px_rgba(106,66,220,0.04)] lg:backdrop-blur-xl lg:transition-[width] lg:duration-300 ${
        isSidebarExpanded ? 'lg:w-52' : 'lg:w-14'
      }`}>
        <div className="relative flex h-[65px] items-center justify-center border-b border-slate-100/70 px-2">
          {isSidebarExpanded ? (
            <img src="/logo.png" alt="Colaborh" className="h-9 w-auto max-w-[130px] object-contain" />
          ) : (
            <img src="/logo-icon.png" alt="Colaborh" className="h-8 w-8 object-contain" />
          )}
        </div>

        <nav className={`flex flex-1 flex-col gap-2 py-5 ${isSidebarExpanded ? 'px-3' : 'px-2'}`}>
          {navigationItems.map((item) => (
            <div key={item.label} className="w-full">
              <CandidateSidebarItem
                icon={item.icon}
                label={item.label}
                activeTab={activeTab}
                onSelectTab={onSelectTab}
                isSidebarExpanded={isSidebarExpanded}
                badgeCount={item.label === 'Testes' ? pendingTestsCount : 0}
              />
            </div>
          ))}
        </nav>

        <div className={`flex flex-col gap-2 border-t border-slate-100/70 ${isSidebarExpanded ? 'p-3' : 'items-center p-2'}`}>
          <CandidateSidebarItem
            icon={settingsItem.icon}
            label={settingsItem.label}
            activeTab={activeTab}
            onSelectTab={onSelectTab}
            isSidebarExpanded={isSidebarExpanded}
          />
          <button
            type="button"
            onClick={onLogout}
            className={`flex h-10 cursor-pointer items-center gap-3 rounded-xl text-slate-400 transition-all hover:bg-[#ff4b8c]/10 hover:text-[#ff4b8c] ${
              isSidebarExpanded ? 'w-full justify-start px-3' : 'w-10 justify-center'
            }`}
            title="Sair"
          >
            <LogOut size={16} />
            {isSidebarExpanded && <span className="text-[12px] font-semibold">Sair</span>}
          </button>
        </div>
      </aside>

      <aside className={`fixed z-[100] flex h-full w-64 flex-col border-r border-slate-200 bg-white p-6 shadow-2xl transition-all duration-300 lg:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mb-8 flex w-full items-center justify-between">
          <img src="/logo.png" alt="Colaborh" className="h-9 w-auto" />
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1 text-slate-400 transition-all hover:text-[#940dff]"
            aria-label="Fechar menu"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex w-full flex-1 flex-col gap-2">
          {navigationItems.map((item) => (
            <div key={item.label} className="w-full">
              <CandidateSidebarItem
                icon={item.icon}
                label={item.label}
                activeTab={activeTab}
                onSelectTab={selectMobileTab}
                isSidebarExpanded={true}
                badgeCount={item.label === 'Testes' ? pendingTestsCount : 0}
              />
            </div>
          ))}
        </nav>

        <div className="mt-auto flex w-full flex-col gap-2 border-t border-slate-100 pt-6">
          <CandidateSidebarItem
            icon={settingsItem.icon}
            label={settingsItem.label}
            activeTab={activeTab}
            onSelectTab={selectMobileTab}
            isSidebarExpanded={true}
          />
          <button
            type="button"
            onClick={() => {
              setIsMobileSidebarOpen(false);
              onLogout();
            }}
            className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/10"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="fixed bottom-6 left-1/2 z-50 flex h-14 w-[92%] max-w-[420px] -translate-x-1/2 items-center justify-between rounded-full border border-white/15 p-1.5 shadow-[0_10px_30px_rgba(83,58,246,0.25)] backdrop-blur-md lg:hidden" style={{ background: 'linear-gradient(to bottom, rgba(144, 18, 252, 0.75), rgba(87, 58, 247, 0.75))' }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => selectTab(item.label)}
              className={`relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent transition-all duration-300 ${
                isActive ? 'scale-105 bg-white text-[#940dff] shadow-md' : 'text-white/70 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon size={20} className="stroke-[2.2]" />
              {item.label === 'Testes' && pendingTestsCount > 0 && (
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border border-white bg-[#ff4b8c]" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
