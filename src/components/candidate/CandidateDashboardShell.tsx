import { Dispatch, ReactNode, RefObject, SetStateAction, useState } from 'react';
import { CandidateBackgroundDecor } from './CandidateBackgroundDecor';
import { CandidateFloatingError } from './CandidateFloatingError';
import { CandidateHeader } from './CandidateHeader';
import { CandidateNavigation } from './CandidateNavigation';

interface CandidateDashboardShellProps {
  activeTab: string;
  pendingTestsCount: number;
  errorMessage: string | null;
  resumeData: {
    fullName?: string;
    email?: string;
    profilePic?: string;
  };
  profileMenuRef: RefObject<HTMLDivElement>;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: Dispatch<SetStateAction<boolean>>;
  unreadChatCount: number;
  unreadNotificationsCount: number;
  onSelectTab: (tab: string) => void;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
  children: ReactNode;
}

export function CandidateDashboardShell({
  activeTab,
  pendingTestsCount,
  errorMessage,
  resumeData,
  profileMenuRef,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  unreadChatCount,
  unreadNotificationsCount,
  onSelectTab,
  onOpenChat,
  onOpenNotifications,
  onLogout,
  children,
}: CandidateDashboardShellProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="candidate-dashboard-surface company-dashboard-surface relative min-h-screen bg-white font-sans">
      <CandidateBackgroundDecor />
      <CandidateFloatingError message={errorMessage} />
      <CandidateNavigation
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        pendingTestsCount={pendingTestsCount}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        onLogout={onLogout}
      />

      <div className={`relative z-10 min-h-screen min-w-0 bg-transparent transition-[padding] duration-300 ${
        isSidebarExpanded ? 'lg:pl-52' : 'lg:pl-14'
      }`}>
        <CandidateHeader
          activeTab={activeTab}
          resumeData={resumeData}
          profileMenuRef={profileMenuRef}
          isProfileMenuOpen={isProfileMenuOpen}
          setIsProfileMenuOpen={setIsProfileMenuOpen}
          unreadChatCount={unreadChatCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenMenu={() => setIsMobileSidebarOpen(true)}
          onOpenChat={onOpenChat}
          onOpenNotifications={onOpenNotifications}
          onSelectSettings={() => onSelectTab('Configurações')}
          onLogout={onLogout}
        />

        {children}
      </div>
    </div>
  );
}