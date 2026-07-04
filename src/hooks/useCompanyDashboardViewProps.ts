import type { CompanyDashboardContentProps } from '../components/CompanyDashboard/CompanyDashboardContent';
import type { CompanyDashboardHeaderProps } from '../components/CompanyDashboard/CompanyDashboardHeader';
import type { CompanyDashboardOverlaysProps } from '../components/CompanyDashboard/CompanyDashboardOverlays';
import type { CompanyDashboardSidebarProps } from '../components/CompanyDashboard/CompanyDashboardSidebar';
import {
  buildCompanyContentProps,
  buildCompanyHeaderProps,
  buildCompanyOverlayProps,
  buildCompanySidebarProps,
  type CompanyDashboardViewContext,
} from './companyDashboardViewPropsBuilders';

type CompanyDashboardViewProps = {
  sidebarProps: CompanyDashboardSidebarProps;
  headerProps: CompanyDashboardHeaderProps;
  contentProps: CompanyDashboardContentProps;
  overlayProps: CompanyDashboardOverlaysProps;
};

export const useCompanyDashboardViewProps = (context: CompanyDashboardViewContext): CompanyDashboardViewProps => ({
  sidebarProps: buildCompanySidebarProps(context),
  headerProps: buildCompanyHeaderProps(context),
  contentProps: buildCompanyContentProps(context),
  overlayProps: buildCompanyOverlayProps(context),
});
