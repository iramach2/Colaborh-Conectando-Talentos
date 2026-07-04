import type { Dispatch, SetStateAction } from 'react';
import type { CandidateAchievement, CandidateLanguage, CandidateResumeData } from '../types/candidate';

type LanguageLevel = 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente';
type AchievementType = 'Certificado' | 'Curso' | 'Reconhecimento' | 'Trabalho Voluntário';

interface UseCandidateResumeCollectionsParams {
  setResumeData: Dispatch<SetStateAction<CandidateResumeData>>;
}

export const useCandidateResumeCollections = ({
  setResumeData
}: UseCandidateResumeCollectionsParams) => {
  const handleAddLanguage = (language: string, level: LanguageLevel) => {
    if (!language) return;

    setResumeData((prev) => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        {
          id: crypto.randomUUID(),
          language,
          level
        }
      ]
    }));
  };

  const handleRemoveLanguage = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      languages: (prev.languages || []).filter((item: CandidateLanguage) => item.id !== id)
    }));
  };

  const handleAddAchievement = (type: AchievementType, title: string, description: string) => {
    if (!title) return;

    setResumeData((prev) => ({
      ...prev,
      achievements: [
        ...(prev.achievements || []),
        {
          id: crypto.randomUUID(),
          type,
          title,
          description
        }
      ]
    }));
  };

  const handleRemoveAchievement = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((item: CandidateAchievement) => item.id !== id)
    }));
  };

  return {
    handleAddLanguage,
    handleRemoveLanguage,
    handleAddAchievement,
    handleRemoveAchievement
  };
};
