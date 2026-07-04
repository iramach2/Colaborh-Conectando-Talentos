import { type Dispatch, type SetStateAction, useState } from 'react';
import { supabase } from '../lib/supabase';
import { saveJobStages, saveJobStageTests } from '../services/jobWorkflowService';
import type { CompanyApplicant, CompanyJob } from '../types/companyDashboard';
import { getCurrentJobStages } from '../utils/companyDashboardUtils';

type UseCompanyJobWorkflowParams = {
  jobs: CompanyJob[];
  setJobs: Dispatch<SetStateAction<CompanyJob[]>>;
  selectedJob: CompanyJob | null;
  setSelectedJob: Dispatch<SetStateAction<CompanyJob | null>>;
  jobApplicants: CompanyApplicant[];
  showCustomAlert: (message: string, title?: string) => void;
  showCustomConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string,
  ) => void;
};

const stripJobWorkflowMarkers = (description = '') =>
  description
    .replace(/===ETAPAS_JSON===[\s\S]*?===FIM_ETAPAS===/g, '')
    .replace(/===STAGE_TESTS_JSON===[\s\S]*?===FIM_STAGE_TESTS===/g, '')
    .trim();

export const useCompanyJobWorkflow = ({
  jobs,
  setJobs,
  selectedJob,
  setSelectedJob,
  jobApplicants,
  showCustomAlert,
  showCustomConfirm,
}: UseCompanyJobWorkflowParams) => {
  const [activeStageTab, setActiveStageTab] = useState<string>('');

  const handleUpdateJobStages = async (jobId: string, newStages: string[]) => {
    try {
      const jobToUpdate = jobs.find((job) => job.id === jobId) || selectedJob;
      if (!jobToUpdate) {
        console.error('Vaga nao encontrada para atualizacao de etapas.');
        return;
      }

      const cleanDesc = stripJobWorkflowMarkers(jobToUpdate.description || '');
      const stagesSynced = await saveJobStages(jobId, newStages);
      const updatedDescription = stagesSynced
        ? cleanDesc
        : `${cleanDesc}\n\n===ETAPAS_JSON===${JSON.stringify(newStages)}===FIM_ETAPAS===`.trim();

      const { error } = await supabase
        .from('jobs')
        .update({
          stages: newStages,
          description: updatedDescription,
        })
        .eq('id', jobId);

      if (error) throw error;

      const updatedJob = {
        ...jobToUpdate,
        stages: newStages,
        description: updatedDescription,
      };

      setSelectedJob(updatedJob);
      setJobs((previousJobs) => {
        if (!previousJobs || previousJobs.length === 0) return [updatedJob];
        return previousJobs.map((job) => job.id === jobId ? updatedJob : job);
      });

      return updatedJob;
    } catch (err) {
      console.error('Erro ao atualizar etapas do processo:', err);
      alert('Erro ao atualizar etapas do processo seletivo.');
    }
  };

  const handleUpdateJobStageTests = async (jobId: string, newStageTests: Record<string, string[]>) => {
    try {
      const jobToUpdate = jobs.find((job) => job.id === jobId) || selectedJob;
      if (!jobToUpdate) {
        console.error('Vaga nao encontrada para atualizacao de testes das etapas.');
        return;
      }

      const cleanDesc = stripJobWorkflowMarkers(jobToUpdate.description || '');
      await saveJobStageTests(jobId, newStageTests);
      const updatedDescription = `${cleanDesc}\n\n===STAGE_TESTS_JSON===${JSON.stringify(newStageTests)}===FIM_STAGE_TESTS===`.trim();

      const { error } = await supabase
        .from('jobs')
        .update({ description: updatedDescription })
        .eq('id', jobId);

      if (error) throw error;

      const updatedJob = {
        ...jobToUpdate,
        description: updatedDescription,
        stageTests: newStageTests,
      };

      setSelectedJob(updatedJob);
      setJobs((previousJobs) => {
        if (!previousJobs || previousJobs.length === 0) return [updatedJob];
        return previousJobs.map((job) => job.id === jobId ? updatedJob : job);
      });

      return updatedJob;
    } catch (err) {
      console.error('Erro ao atualizar testes das etapas:', err);
      alert('Erro ao atualizar configuracoes de testes do processo.');
    }
  };

  const handleAddNewStage = async (stageName: string) => {
    if (!selectedJob) return;
    const trimmed = stageName.trim();
    if (!trimmed) return;

    const currentStages = getCurrentJobStages(selectedJob);
    if (currentStages.map((stage) => stage.toLowerCase()).includes(trimmed.toLowerCase())) {
      alert('Ja existe uma etapa com este nome.');
      return;
    }

    const newStages = [...currentStages, trimmed];
    const updated = await handleUpdateJobStages(selectedJob.id, newStages);
    if (updated) {
      setActiveStageTab(trimmed);
    }
  };

  const handleDeleteStage = async (stageName: string) => {
    if (!selectedJob) return;
    const currentStages = getCurrentJobStages(selectedJob);
    const stageIndex = currentStages.indexOf(stageName);
    if (stageIndex === -1) return;

    if (currentStages.length <= 1) {
      showCustomAlert('O processo seletivo deve ter pelo menos uma etapa.', 'Aviso');
      return;
    }

    const defaultStage = currentStages[0] || 'Triagem';
    const candidatesInStage = jobApplicants.filter((applicant) => {
      const currentStatus = applicant.status;
      const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !currentStages.includes(currentStatus))
        ? defaultStage
        : currentStatus;
      return normalizedStatus === stageName;
    });

    if (candidatesInStage.length > 0) {
      showCustomAlert(`Nao e possivel excluir a etapa "${stageName}" pois ela possui ${candidatesInStage.length} candidato(s) ativo(s). Mova os candidatos para outras etapas antes de excluir.`, 'Aviso');
      return;
    }

    showCustomConfirm(
      `Tem certeza de que deseja excluir permanentemente a etapa "${stageName}"?`,
      async () => {
        const newStages = currentStages.filter((stage) => stage !== stageName);
        const updated = await handleUpdateJobStages(selectedJob.id, newStages);
        if (updated) {
          setActiveStageTab(newStages[0] || 'Triagem');
        }
      },
      undefined,
      'Excluir Etapa',
    );
  };

  return {
    activeStageTab,
    setActiveStageTab,
    handleUpdateJobStages,
    handleUpdateJobStageTests,
    handleAddNewStage,
    handleDeleteStage,
  };
};
