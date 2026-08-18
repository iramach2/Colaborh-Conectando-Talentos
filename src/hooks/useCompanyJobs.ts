import { useEffect, useMemo, useState } from 'react';
import { fetchApplicationsForJob } from '../services/applicationService';
import { fetchJobsForCompany } from '../services/jobService';
import { hydrateJobsWithWorkflow } from '../services/jobWorkflowService';
import type { CompanyApplication, CompanyJob, CompanyLike } from '../types/companyDashboard';

export const useCompanyJobs = (
  selectedCompany: CompanyLike | null | undefined,
  selectedCompanyId: string,
  activeTab: string,
  hydrateApplicationsWithNotes: (applications: CompanyApplication[]) => Promise<CompanyApplication[]>
) => {
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [isFetchingJobs, setIsFetchingJobs] = useState(false);
  const [companyApplications, setCompanyApplications] = useState<CompanyApplication[]>([]);
  const [isFetchingCompanyApps, setIsFetchingCompanyApps] = useState(false);

  const companyJobs = useMemo(() => jobs.filter((job) => {
    if (selectedCompany?.id && selectedCompany.id !== 'new' && job.company_id === selectedCompany.id) {
      return true;
    }

    const jobCompanyName = (job.company_name || '').trim().toLowerCase();
    const selectedCompanyName = (selectedCompany?.nomeFantasia || '').trim().toLowerCase();
    return jobCompanyName === selectedCompanyName;
  }), [jobs, selectedCompany?.id, selectedCompany?.nomeFantasia]);

  useEffect(() => {
    let cancelled = false;

    async function loadCompanyData() {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setJobs([]);
        setCompanyApplications([]);
        return;
      }

      if (!selectedCompany?.nomeFantasia && !selectedCompany?.id) {
        setJobs([]);
        setCompanyApplications([]);
        return;
      }

      setIsFetchingJobs(true);
      setIsFetchingCompanyApps(true);
      try {
        const jobsData = await fetchJobsForCompany(selectedCompany);
        const jobIds = (jobsData || []).map((job: CompanyJob) => job.id).filter(Boolean);
        let hydratedApplications: CompanyApplication[] = [];

        if (jobIds.length > 0) {
          const applicationResults = await Promise.allSettled(
            jobIds.map((jobId: string) => fetchApplicationsForJob(jobId))
          );
          const failedResults = applicationResults.filter((result) => result.status === 'rejected');

          applicationResults.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.warn('Erro ao carregar candidaturas da vaga:', jobIds[index], result.reason);
            }
          });

          if (failedResults.length === applicationResults.length) {
            throw failedResults[0].reason;
          }

          const applications = applicationResults.reduce<CompanyApplication[]>((collected, result) => {
            if (result.status === 'fulfilled') {
              collected.push(...(result.value as CompanyApplication[]));
            }
            return collected;
          }, []);
          hydratedApplications = await hydrateApplicationsWithNotes(applications);
        }

        const hydratedJobs = await hydrateJobsWithWorkflow(jobsData || []);
        if (cancelled) return;

        setCompanyApplications(hydratedApplications);
        setJobs(hydratedJobs.map((job: CompanyJob) => ({
          ...job,
          candidates_count: hydratedApplications.filter((application) => application.job_id === job.id).length,
        })));
      } catch (err) {
        if (!cancelled) {
          console.error('Erro ao buscar vagas e candidaturas do Supabase:', err);
        }
      } finally {
        if (!cancelled) {
          setIsFetchingJobs(false);
          setIsFetchingCompanyApps(false);
        }
      }
    }

    loadCompanyData();

    return () => {
      cancelled = true;
    };
  }, [activeTab, selectedCompanyId, selectedCompany?.id, selectedCompany?.nomeFantasia, hydrateApplicationsWithNotes]);

  return {
    jobs,
    setJobs,
    companyJobs,
    isFetchingJobs,
    companyApplications,
    isFetchingCompanyApps,
  };
};
