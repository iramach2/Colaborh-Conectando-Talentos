import { useEffect, useState } from 'react';
import type { CandidateEducation, CandidateExperience } from '../types/candidate';

export const useCandidateResumeEditorUi = () => {
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showAchModal, setShowAchModal] = useState(false);
  const [editingExp, setEditingExp] = useState<CandidateExperience | null>(null);
  const [editingEdu, setEditingEdu] = useState<CandidateEducation | null>(null);
  const [tempExp, setTempExp] = useState<CandidateExperience | null>(null);

  useEffect(() => {
    if (showExpModal) {
      if (editingExp) {
        setTempExp({ ...editingExp });
      } else {
        setTempExp({
          id: crypto.randomUUID(),
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        });
      }
    } else {
      setTempExp(null);
    }
  }, [showExpModal, editingExp]);

  return {
    showActionDropdown,
    setShowActionDropdown,
    showExpModal,
    setShowExpModal,
    showEduModal,
    setShowEduModal,
    showLangModal,
    setShowLangModal,
    showAchModal,
    setShowAchModal,
    editingExp,
    setEditingExp,
    editingEdu,
    setEditingEdu,
    tempExp,
    setTempExp,
  };
};
