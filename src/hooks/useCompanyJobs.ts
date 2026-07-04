import { useEffect, useMemo, useRef, useState } from 'react';
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
  const loadedCompanyAppsKeyRef = useRef('');

  const companyJobs = useMemo(() => jobs.filter((job) => {
    if (selectedCompany?.id && selectedCompany.id !== 'new' && job.company_id === selectedCompany.id) {
      return true;
    }

    const jobCompanyName = (job.company_name || '').trim().toLowerCase();
    const selectedCompanyName = (selectedCompany?.nomeFantasia || '').trim().toLowerCase();
    return jobCompanyName === selectedCompanyName;
  }), [jobs, selectedCompany?.id, selectedCompany?.nomeFantasia]);

  useEffect(() => {
    async function loadCompanyApplications() {
      if (
        (activeTab !== 'Avaliações' && activeTab !== 'Dashboard') ||
        !import.meta.env.VITE_SUPABASE_URL ||
        companyJobs.length === 0
      ) {
        setCompanyApplications([]);
        return;
      }

      const jobIds = companyJobs.map((job) => job.id).filter(Boolean);
      const applicationsKey = `${selectedCompanyId}:${jobIds.join('|')}`;
      if (loadedCompanyAppsKeyRef.current === applicationsKey) return;

      setIsFetchingCompanyApps(true);
      try {
        const appsByJob = await Promise.all(
          jobIds.map((jobId) => fetchApplicationsForJob(jobId as string).catch((error) => {
            console.warn('Erro ao carregar candidaturas da empresa:', jobId, error);
            return [];
          }))
        );

        const hydratedApplications = await hydrateApplicationsWithNotes(appsByJob.flat());
        setCompanyApplications(hydratedApplications);
        loadedCompanyAppsKeyRef.current = applicationsKey;
      } catch (err) {
        console.error('Erro ao buscar candidaturas da empresa:', err);
      } finally {
        setIsFetchingCompanyApps(false);
      }
    }

    loadCompanyApplications();
  }, [activeTab, selectedCompanyId, jobs]);

  useEffect(() => {
    async function loadJobs() {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      if (!selectedCompany?.nomeFantasia && !selectedCompany?.id) {
        setJobs([]);
        return;
      }

      setIsFetchingJobs(true);
      try {
        const jobsData = await fetchJobsForCompany(selectedCompany);
        const jobIds = (jobsData || []).map((job: CompanyJob) => job.id).filter(Boolean);
        let hydratedApplications: CompanyApplication[] = [];

        if (jobIds.length > 0) {
          const appsByJob = await Promise.all(
            jobIds.map((jobId: string) => fetchApplicationsForJob(jobId).catch((error) => {
              console.warn('Erro ao carregar candidaturas da vaga:', jobId, error);
              return [];
            }))
          );

          hydratedApplications = await hydrateApplicationsWithNotes(appsByJob.flat());
        }

        const hydratedJobs = await hydrateJobsWithWorkflow(jobsData || []);
        if (activeTab === 'Avaliações' || activeTab === 'Dashboard') {
          setCompanyApplications(hydratedApplications);
          loadedCompanyAppsKeyRef.current = `${selectedCompanyId}:${jobIds.join('|')}`;
        }
        setJobs(hydratedJobs.map((job: CompanyJob) => ({
          ...job,
          candidates_count: hydratedApplications.filter((application) => application.job_id === job.id).length,
        })));
      } catch (err) {
        console.error('Erro ao buscar vagas do Supabase:', err);
      } finally {
        setIsFetchingJobs(false);
      }
    }

    loadJobs();
  }, [activeTab, selectedCompanyId, selectedCompany?.id, selectedCompany?.nomeFantasia]);

  return {
    jobs,
    setJobs,
    companyJobs,
    isFetchingJobs,
    companyApplications,
    isFetchingCompanyApps,
  };
};
