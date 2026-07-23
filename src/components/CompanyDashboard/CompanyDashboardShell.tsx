import { useState } from 'react';
import { CompanyDashboardContent, type CompanyDashboardContentProps } from './CompanyDashboardContent';
import { CompanyDashboardHeader, type CompanyDashboardHeaderProps } from './CompanyDashboardHeader';
import { CompanyDashboardOverlays, type CompanyDashboardOverlaysProps } from './CompanyDashboardOverlays';
import { CompanyDashboardSidebar, type CompanyDashboardSidebarProps } from './CompanyDashboardSidebar';

type CompanyDashboardShellProps = {
  sidebarProps: CompanyDashboardSidebarProps;
  headerProps: CompanyDashboardHeaderProps;
  contentProps: CompanyDashboardContentProps;
  overlayProps: CompanyDashboardOverlaysProps;
};

export const CompanyDashboardShell = ({
  sidebarProps,
  headerProps,
  contentProps,
  overlayProps,
}: CompanyDashboardShellProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="company-dashboard-surface min-h-screen relative font-sans" style={{ backgroundColor: '#fbfaff' }}>
      <div className="fixed top-[-12%] right-[-8%] w-[42%] h-[42%] bg-[#ede7ff] rounded-full blur-[130px] opacity-35 pointer-events-none" />
      <div className="fixed bottom-[-14%] left-[18%] w-[34%] h-[34%] bg-[#f4f0ff] rounded-full blur-[120px] opacity-45 pointer-events-none" />

      <CompanyDashboardSidebar
        {...sidebarProps}
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
      />

      <div className={`relative z-10 min-h-screen min-w-0 max-w-full bg-transparent transition-[padding] duration-300 ${
        isSidebarExpanded ? 'lg:pl-52' : 'lg:pl-14'
      }`}>
        <div className="relative z-20">
          <CompanyDashboardHeader {...headerProps} />
        </div>
        <div className="min-w-0 max-w-full">
          <CompanyDashboardContent {...contentProps} />
        </div>
      </div>

      <CompanyDashboardOverlays {...overlayProps} />
    </div>
  );
};
