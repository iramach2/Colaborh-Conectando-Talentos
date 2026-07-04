import type { CandidateResumeData } from '../types/candidate';

interface UseCandidateTabNavigationParams {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isResumeDirty: boolean;
  originalResumeData: CandidateResumeData | null;
  setResumeData: (resumeData: CandidateResumeData) => void;
  showCustomConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string
  ) => void;
}

export const useCandidateTabNavigation = ({
  activeTab,
  setActiveTab,
  isResumeDirty,
  originalResumeData,
  setResumeData,
  showCustomConfirm
}: UseCandidateTabNavigationParams) => {
  const handleSelectTab = (tab: string) => {
    if (activeTab === 'Meu Currículo' && isResumeDirty && tab !== 'Meu Currículo') {
      showCustomConfirm(
        'Você fez alterações no seu currículo que serão perdidas se você mudar de página agora.\n\nDeseja descartar as alterações e sair?',
        () => {
          if (originalResumeData) {
            setResumeData(JSON.parse(JSON.stringify(originalResumeData)));
          }
          setActiveTab(tab);
        },
        undefined,
        'Alterações não salvas'
      );
    } else {
      setActiveTab(tab);
    }
  };

  return { handleSelectTab };
};
