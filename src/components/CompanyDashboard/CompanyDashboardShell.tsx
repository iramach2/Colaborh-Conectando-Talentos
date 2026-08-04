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
    <div data-company-dashboard-shell className="company-dashboard-surface min-h-screen relative bg-white font-sans">
      <CompanyDashboardSidebar
        {...sidebarProps}
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
      />

      <div className={`relative z-10 min-h-screen min-w-0 max-w-full bg-white transition-[padding] duration-300 ${
        isSidebarExpanded ? 'lg:pl-52' : 'lg:pl-14'
      }`}>
        <div data-company-dashboard-header-frame className="relative z-20 bg-white">
          <CompanyDashboardHeader {...headerProps} />
        </div>
        <div data-company-dashboard-content-frame className="min-w-0 max-w-full bg-white">
          <CompanyDashboardContent {...contentProps} />
        </div>
      </div>

      <CompanyDashboardOverlays {...overlayProps} />
    </div>
  );
};
