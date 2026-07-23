import React, { ChangeEvent, RefObject } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Save } from 'lucide-react';
import { CandidateResumeAchievementsEditor } from './CandidateResumeAchievementsEditor';
import { CandidateResumeDiversityEditor } from './CandidateResumeDiversityEditor';
import { CandidateResumeEducationEditor } from './CandidateResumeEducationEditor';
import { CandidateResumeEditorAddBar } from './CandidateResumeEditorAddBar';
import { CandidateResumeEditorModalHeader } from './CandidateResumeEditorModalHeader';
import { CandidateResumeExperienceEditor } from './CandidateResumeExperienceEditor';
import { CandidateResumeLanguagesEditor } from './CandidateResumeLanguagesEditor';
import { CandidateResumePersonalInfoEditor } from './CandidateResumePersonalInfoEditor';
import { CandidateResumeSkillsEditor } from './CandidateResumeSkillsEditor';
import { CandidateResumeSummaryEditor } from './CandidateResumeSummaryEditor';
import { ResumePrimaryButton } from './CandidateResumeEditorPrimitives';
import type {
  CandidateAchievement,
  CandidateEducation,
  CandidateExperience,
  CandidateLanguage,
  CandidateResumeData,
} from '../../types/candidate';

interface CandidateResumeEditorModalProps {
  isOpen: boolean;
  activeAccordion: string;
  resumeData: CandidateResumeData;
  brazilStates: string[];
  genderOptions: string[];
  cities: string[];
  isLoadingCities: boolean;
  profilePicRef: RefObject<HTMLInputElement>;
  showExpModal: boolean;
  showEduModal: boolean;
  showLangModal: boolean;
  showAchModal: boolean;
  editingExp: CandidateExperience | null;
  editingEdu: CandidateEducation | null;
  tempExp: CandidateExperience | null;
  calculateDuration: (startDate: string, endDate: string | null | undefined, current: boolean) => string;
  handleProfilePicSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  setResumeData: React.Dispatch<React.SetStateAction<CandidateResumeData>>;
  setIsOpen: (isOpen: boolean) => void;
  setShowExpModal: (isOpen: boolean) => void;
  setShowEduModal: (isOpen: boolean) => void;
  setShowLangModal: (isOpen: boolean) => void;
  setShowAchModal: (isOpen: boolean) => void;
  setEditingExp: (experience: CandidateExperience | null) => void;
  setEditingEdu: (education: CandidateEducation | null) => void;
  setTempExp: React.Dispatch<React.SetStateAction<CandidateExperience | null>>;
  handleAddLanguage: (language: string, level: CandidateLanguage['level']) => void;
  handleRemoveLanguage: (languageId: string) => void;
  handleAddAchievement: (type: CandidateAchievement['type'], title: string, description: string) => void;
  handleRemoveAchievement: (achievementId: string) => void;
  handleSaveToSupabase: () => Promise<boolean>;
}

export function CandidateResumeEditorModal({
  isOpen,
  activeAccordion,
  resumeData,
  brazilStates,
  genderOptions,
  cities,
  isLoadingCities,
  profilePicRef,
  showExpModal,
  showEduModal,
  showLangModal,
  showAchModal,
  editingExp,
  editingEdu,
  tempExp,
  calculateDuration,
  handleProfilePicSelect,
  setResumeData,
  setIsOpen,
  setShowExpModal,
  setShowEduModal,
  setShowLangModal,
  setShowAchModal,
  setEditingExp,
  setEditingEdu,
  setTempExp,
  handleAddLanguage,
  handleRemoveLanguage,
  handleAddAchievement,
  handleRemoveAchievement,
  handleSaveToSupabase,
}: CandidateResumeEditorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="company-dashboard-surface fixed inset-0 z-[9999] flex justify-end overflow-hidden bg-slate-950/45 text-left backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0 cursor-default border-0 bg-transparent"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar edição"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-slate-200/70 bg-[#fbf9ff] p-5 shadow-2xl sm:p-6"
          >
            <CandidateResumeEditorModalHeader
              activeAccordion={activeAccordion}
              onClose={() => setIsOpen(false)}
            />

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAccordion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5 pb-2"
                >
                  <CandidateResumeEditorAddBar
                    activeAccordion={activeAccordion}
                    isFirstJob={resumeData.isFirstJob}
                    onAddExperience={() => { setEditingExp(null); setShowExpModal(true); }}
                    onAddEducation={() => { setEditingEdu(null); setShowEduModal(true); }}
                    onAddLanguage={() => setShowLangModal(true)}
                    onAddAchievement={() => setShowAchModal(true)}
                  />

                  {activeAccordion === 'info' && (
                    <CandidateResumePersonalInfoEditor
                      resumeData={resumeData}
                      brazilStates={brazilStates}
                      genderOptions={genderOptions}
                      cities={cities}
                      isLoadingCities={isLoadingCities}
                      profilePicRef={profilePicRef}
                      onProfilePicSelect={handleProfilePicSelect}
                      onChange={(patch) => setResumeData({ ...resumeData, ...patch })}
                    />
                  )}

                  {activeAccordion === 'summary' && (
                    <CandidateResumeSummaryEditor
                      summary={resumeData.summary}
                      onChange={(summary) => setResumeData({ ...resumeData, summary })}
                    />
                  )}

                  {activeAccordion === 'experience' && (
                    <CandidateResumeExperienceEditor
                      experiences={resumeData.experiences}
                      isFirstJob={resumeData.isFirstJob}
                      showExperienceModal={showExpModal}
                      editingExperience={editingExp}
                      tempExperience={tempExp}
                      calculateDuration={calculateDuration}
                      onToggleFirstJob={(isFirstJob) => setResumeData({ ...resumeData, isFirstJob })}
                      onTempExperienceChange={setTempExp}
                      onSaveExperience={() => {
                        if (!tempExp) return;
                        if (editingExp) {
                          setResumeData({
                            ...resumeData,
                            experiences: resumeData.experiences.map((experience) => experience.id === editingExp.id ? tempExp : experience),
                          });
                        } else {
                          setResumeData({ ...resumeData, experiences: [tempExp, ...resumeData.experiences] });
                        }
                        setShowExpModal(false);
                      }}
                      onCancelModal={() => setShowExpModal(false)}
                      onEditExperience={(experience) => { setEditingExp(experience); setShowExpModal(true); }}
                      onRemoveExperience={(experienceId) => setResumeData({
                        ...resumeData,
                        experiences: resumeData.experiences.filter((experience) => experience.id !== experienceId),
                      })}
                    />
                  )}

                  {activeAccordion === 'education' && (
                    <CandidateResumeEducationEditor
                      educations={resumeData.educations}
                      showEducationModal={showEduModal}
                      editingEducation={editingEdu}
                      onSaveEducation={(education) => {
                        if (editingEdu) {
                          setResumeData({
                            ...resumeData,
                            educations: resumeData.educations.map((item) => item.id === editingEdu.id ? education : item),
                          });
                        } else {
                          setResumeData({ ...resumeData, educations: [education, ...resumeData.educations] });
                        }
                        setShowEduModal(false);
                      }}
                      onCancelModal={() => setShowEduModal(false)}
                      onEditEducation={(education) => { setEditingEdu(education); setShowEduModal(true); }}
                      onRemoveEducation={(educationId) => setResumeData({
                        ...resumeData,
                        educations: resumeData.educations.filter((education) => education.id !== educationId),
                      })}
                    />
                  )}

                  {activeAccordion === 'skills' && (
                    <CandidateResumeSkillsEditor
                      skills={resumeData.skills}
                      onChange={(skills) => setResumeData({ ...resumeData, skills })}
                    />
                  )}

                  {activeAccordion === 'languages' && (
                    <CandidateResumeLanguagesEditor
                      languages={resumeData.languages}
                      showLangModal={showLangModal}
                      onAddLanguage={handleAddLanguage}
                      onRemoveLanguage={handleRemoveLanguage}
                      onCloseModal={() => setShowLangModal(false)}
                    />
                  )}

                  {activeAccordion === 'achievements' && (
                    <CandidateResumeAchievementsEditor
                      achievements={resumeData.achievements}
                      showAchModal={showAchModal}
                      onAddAchievement={handleAddAchievement}
                      onRemoveAchievement={handleRemoveAchievement}
                      onCloseModal={() => setShowAchModal(false)}
                    />
                  )}

                  {activeAccordion === 'diversity' && (
                    <CandidateResumeDiversityEditor
                      diversity={resumeData.diversity}
                      onChange={(diversity) => setResumeData({ ...resumeData, diversity })}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex shrink-0 justify-end border-t border-slate-200/70 pt-4">
              <ResumePrimaryButton
                onClick={async () => {
                  const saved = await handleSaveToSupabase();
                  if (saved) setIsOpen(false);
                }}
              >
                <Save size={14} />
                Salvar alterações
              </ResumePrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}