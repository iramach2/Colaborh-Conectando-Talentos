import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchApplicationNotes, saveApplicationNote } from '../services/applicationNotesService';
import type { CompanyApplicant, CompanyApplication } from '../types/companyDashboard';
import {
  parseCandidatePhoneData,
  serializeCandidatePhoneData,
} from '../utils/companyDashboardUtils';

const NOTE_RATING_MARKER = '===RATING===';

export const parseRecruitmentNote = (rawNote = '') => {
  const match = rawNote.match(/^===RATING===(\d)\n?([\s\S]*)$/);
  if (!match) return { text: rawNote, rating: 0 };

  const rating = Math.min(5, Math.max(0, Number(match[1]) || 0));
  return { text: match[2] || '', rating };
};

const serializeRecruitmentNote = (text: string, rating: number) => {
  const safeRating = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return safeRating > 0 ? `${NOTE_RATING_MARKER}${safeRating}\n${text || ''}` : (text || '');
};

export const useCompanyApplicantNotes = (
  getFullApplicantInfo: (applicant: CompanyApplication) => CompanyApplicant,
  selectedResumeApplicant: CompanyApplicant | null,
  setSelectedResumeApplicant: Dispatch<SetStateAction<CompanyApplicant | null>>,
  setJobApplicants: Dispatch<SetStateAction<CompanyApplicant[]>>
) => {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedApplicantForNotes, setSelectedApplicantForNotes] = useState<CompanyApplicant | null>(null);
  const [tempNotesText, setTempNotesText] = useState('');
  const [tempNotesRating, setTempNotesRating] = useState(0);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const hydrateApplicationsWithNotes = useCallback(async (applications: CompanyApplication[]) => {
    const applicationIds = applications.map((application) => application.id).filter(Boolean);
    const notesByApplication = await fetchApplicationNotes(applicationIds);

    return applications.map((application) => {
      if (!Object.prototype.hasOwnProperty.call(notesByApplication, application.id)) return application;

      const parsedData = parseCandidatePhoneData(application.candidate_phone || '');
      return {
        ...application,
        candidate_phone: serializeCandidatePhoneData(
          parsedData.phone,
          parsedData.disc,
          notesByApplication[application.id],
          parsedData.questions,
          parsedData.mbti,
          parsedData.temperamentos,
          parsedData.customTest
        ),
      };
    });
  }, []);

  const closeNotes = useCallback(() => {
    if (isSavingNotes) return;
    setIsNotesModalOpen(false);
    setSelectedApplicantForNotes(null);
  }, [isSavingNotes]);

  const handleOpenNotes = useCallback((applicant: CompanyApplication) => {
    const info = getFullApplicantInfo(applicant);
    const parsedData = parseCandidatePhoneData(info.candidate_phone || '');
    const parsedNote = parseRecruitmentNote(parsedData.notes || '');
    setSelectedApplicantForNotes(info);
    setTempNotesText(parsedNote.text);
    setTempNotesRating(parsedNote.rating);
    setIsNotesModalOpen(true);
  }, [getFullApplicantInfo]);

  const handleSaveNotes = useCallback(async () => {
    const targetApplicant = selectedApplicantForNotes || selectedResumeApplicant;
    if (!targetApplicant?.id) return;

    try {
      setIsSavingNotes(true);
      const appId = targetApplicant.id;
      const currentPhone = targetApplicant.candidate_phone || '';
      const parsedData = parseCandidatePhoneData(currentPhone);
      const serializedNotes = serializeRecruitmentNote(tempNotesText, tempNotesRating);
      const updatedPhoneValue = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        serializedNotes,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const noteSaved = await saveApplicationNote(appId, serializedNotes);

      if (!noteSaved) {
        const { error } = await supabase
          .from('applications')
          .update({ candidate_phone: updatedPhoneValue })
          .eq('id', appId);

        if (error) throw error;
      }

      setJobApplicants((previous) => previous.map((item) => (
        item.id === appId ? { ...item, candidate_phone: updatedPhoneValue } : item
      )));

      if (selectedResumeApplicant?.id === appId) {
        setSelectedResumeApplicant((previous) => (
          previous ? { ...previous, candidate_phone: updatedPhoneValue } : null
        ));
      }

      setIsNotesModalOpen(false);
      setSelectedApplicantForNotes(null);
    } catch (err) {
      console.error('Erro ao salvar anotacoes:', err);
      alert('Erro ao salvar anotacoes. Por favor, tente novamente.');
    } finally {
      setIsSavingNotes(false);
    }
  }, [
    selectedApplicantForNotes,
    selectedResumeApplicant,
    setJobApplicants,
    setSelectedResumeApplicant,
    tempNotesRating,
    tempNotesText,
  ]);

  return {
    isNotesModalOpen,
    selectedApplicantForNotes,
    tempNotesText,
    setTempNotesText,
    tempNotesRating,
    setTempNotesRating,
    isSavingNotes,
    hydrateApplicationsWithNotes,
    handleOpenNotes,
    handleSaveNotes,
    closeNotes,
  };
};