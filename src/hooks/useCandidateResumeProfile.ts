import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CandidateResumeData } from '../types/candidate';

const TALENT_PROFILE_COLUMNS = 'id, name, email, phone, state, city, gender, summary, skills, educations, experiences, profile_pic, birth_date, salary, is_pcd, CID, first_job, languages, achievements, diversity' as const;

export const createEmptyResumeData = (): CandidateResumeData => ({
  fullName: '',
  email: '',
  phone: '',
  state: '',
  gender: '',
  summary: '',
  isPcd: false,
  cid: '',
  isFirstJob: false,
  birthDate: '',
  city: '',
  salary: '',
  skills: [],
  experiences: [],
  educations: [],
  profilePic: undefined,
  languages: [],
  achievements: [],
  diversity: {
    pronoun: '',
    genderIdentity: '',
    sexualOrientation: '',
    race: '',
    consent: false,
  },
});

export const useCandidateResumeProfile = () => {
  const [resumeData, setResumeData] = useState<CandidateResumeData>(createEmptyResumeData);
  const [originalResumeData, setOriginalResumeData] = useState<CandidateResumeData | null>(null);
  const [isResumeDirty, setIsResumeDirty] = useState(false);

  const isSectionCompleted = (sectionId: string): boolean => {
    if (!resumeData) return false;

    switch (sectionId) {
      case 'info':
        return !!(
          resumeData.fullName?.trim() &&
          resumeData.profilePic?.trim() &&
          resumeData.email?.trim() &&
          resumeData.phone?.trim() &&
          resumeData.birthDate?.trim() &&
          resumeData.gender?.trim() &&
          resumeData.state?.trim() &&
          resumeData.city?.trim() &&
          resumeData.salary?.trim()
        );
      case 'summary':
        return !!resumeData.summary?.trim();
      case 'experience':
        return !!(resumeData.isFirstJob || (resumeData.experiences && resumeData.experiences.length > 0));
      case 'education':
        return !!(resumeData.educations && resumeData.educations.some((education) => (
          education.institution?.trim() &&
          education.course?.trim() &&
          education.status?.trim() &&
          education.gradYear?.trim()
        )));
      case 'skills':
        return !!(resumeData.skills && resumeData.skills.some((skill) => skill.trim()));
      case 'languages':
        return !!(resumeData.languages && resumeData.languages.some((language) => language.language?.trim() && language.level?.trim()));
      case 'achievements':
        return !!(resumeData.achievements && resumeData.achievements.some((achievement) => achievement.type?.trim() && achievement.title?.trim()));
      case 'diversity':
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    async function loadUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const metadata = session.user.user_metadata;
      const userEmail = session.user.email;

      let initialProfile: CandidateResumeData = {
        ...createEmptyResumeData(),
        fullName: (metadata?.full_name || '').toUpperCase(),
        email: userEmail || '',
        phone: metadata?.whatsapp || '',
      };

      try {
        let talentProfile = null;

        const userId = session.user.id;
        if (userId) {
          const { data, error } = await supabase
            .from('talents')
            .select(TALENT_PROFILE_COLUMNS)
            .eq('user_id', userId)
            .limit(1)
            .maybeSingle();

          if (error) console.warn('Nao foi possivel buscar perfil por usuario:', error);
          talentProfile = data;
        }

        if (!talentProfile && userEmail) {
          const { data, error } = await supabase
            .from('talents')
            .select(TALENT_PROFILE_COLUMNS)
            .eq('email', userEmail)
            .limit(1)
            .maybeSingle();

          if (error) console.warn('Nao foi possivel buscar perfil por e-mail:', error);
          talentProfile = data;
        }

        if (talentProfile) {
          const data = talentProfile;
          initialProfile = {
              ...initialProfile,
              fullName: (data.name || initialProfile.fullName || '').toUpperCase(),
              email: data.email || initialProfile.email || '',
              phone: data.phone || initialProfile.phone || '',
              state: data.state || initialProfile.state || '',
              city: data.city || initialProfile.city || '',
              gender: data.gender || initialProfile.gender || '',
              summary: data.summary || initialProfile.summary || '',
              skills: Array.isArray(data.skills) ? data.skills : initialProfile.skills,
              educations: Array.isArray(data.educations) ? data.educations : initialProfile.educations,
              experiences: Array.isArray(data.experiences) ? data.experiences : initialProfile.experiences,
              profilePic: data.profile_pic || initialProfile.profilePic,
              birthDate: data.birth_date || initialProfile.birthDate || '',
              salary: data.salary || initialProfile.salary || '',
              isPcd: data.is_pcd || initialProfile.isPcd || false,
              cid: data.CID || initialProfile.cid || '',
              isFirstJob: data.first_job ?? initialProfile.isFirstJob ?? false,
              languages: Array.isArray(data.languages) ? data.languages : initialProfile.languages,
              achievements: Array.isArray(data.achievements) ? data.achievements : initialProfile.achievements,
              diversity: data.diversity ? data.diversity : initialProfile.diversity,
          };
        }
      } catch (error) {
        console.error('Error fetching talent profile:', error);
      }

      setResumeData(initialProfile);
      setOriginalResumeData(JSON.parse(JSON.stringify(initialProfile)));
    }

    loadUserData();
  }, []);

  useEffect(() => {
    if (originalResumeData && resumeData) {
      const isChanged = JSON.stringify(originalResumeData) !== JSON.stringify(resumeData);
      setIsResumeDirty(isChanged);
    }
  }, [resumeData, originalResumeData]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isResumeDirty) {
        event.preventDefault();
        event.returnValue = 'Você possui alterações não salvas. Tem certeza que deseja sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isResumeDirty]);

  return {
    resumeData,
    setResumeData,
    originalResumeData,
    setOriginalResumeData,
    isResumeDirty,
    setIsResumeDirty,
    isSectionCompleted,
  };
};
