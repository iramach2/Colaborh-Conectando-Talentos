import { useState } from 'react';
import type {
  CompanyApplicant,
  DiscReportResult,
  MbtiReportResult,
  TemperamentosReportResult,
} from '../types/companyDashboard';

export const useCompanyAssessmentReportModals = () => {
  const [selectedDiscResult, setSelectedDiscResult] = useState<DiscReportResult | null>(null);

  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [selectedApplicantForQuestions, setSelectedApplicantForQuestions] = useState<CompanyApplicant | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState('EXPERIENCE');

  const [selectedMbtiResult, setSelectedMbtiResult] = useState<MbtiReportResult | null>(null);
  const [isMbtiModalOpen, setIsMbtiModalOpen] = useState(false);
  const [activeMbtiTab, setActiveMbtiTab] = useState<'PERFIL' | 'DIMENSOES' | 'AUDITORIA'>('PERFIL');

  const [selectedTemperamentosResult, setSelectedTemperamentosResult] = useState<TemperamentosReportResult | null>(null);
  const [isTemperamentosModalOpen, setIsTemperamentosModalOpen] = useState(false);
  const [activeTemperamentosTab, setActiveTemperamentosTab] = useState<'PERFIL' | 'DISTRIBUICAO' | 'AUDITORIA'>('PERFIL');

  return {
    selectedDiscResult,
    setSelectedDiscResult,
    isQuestionsModalOpen,
    setIsQuestionsModalOpen,
    selectedApplicantForQuestions,
    setSelectedApplicantForQuestions,
    activeCategoryTab,
    setActiveCategoryTab,
    selectedMbtiResult,
    setSelectedMbtiResult,
    isMbtiModalOpen,
    setIsMbtiModalOpen,
    activeMbtiTab,
    setActiveMbtiTab,
    selectedTemperamentosResult,
    setSelectedTemperamentosResult,
    isTemperamentosModalOpen,
    setIsTemperamentosModalOpen,
    activeTemperamentosTab,
    setActiveTemperamentosTab,
  };
};
