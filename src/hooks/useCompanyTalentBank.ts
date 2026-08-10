import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { calculateAge, DF_REGIONS, sortBrazilianCityNames } from '../utils/companyDashboardUtils';

type CompanyWithSavedTalents = {
  id: string;
  savedTalents?: string[];
};

export type TalentProfile = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  city?: string;
  state?: string;
  birth_date?: string;
  age?: number;
  gender?: string;
  salary?: string;
  summary?: string;
  skills?: string[];
  profile_pic?: string;
  first_job?: boolean;
  education?: string;
  experience?: string;
  modality?: string;
  experiences?: TalentExperience[];
  educations?: TalentEducation[];
};

export type TalentExperience = {
  role?: string;
  company?: string;
  duration?: string;
  startDate?: string;
  endDate?: string | null;
  current?: boolean;
  description?: string;
};

export type TalentEducation = {
  course?: string;
  gradYear?: string;
  status?: string;
  institution?: string;
};

export type TalentFilters = {
  role: string;
  minAge: number;
  maxAge: number;
  city: string;
  state: string;
  first_job: boolean;
  education: string;
  experience: string;
  modality: string;
  salary: string;
};

export const initialTalentFilters: TalentFilters = {
  role: '',
  minAge: 16,
  maxAge: 60,
  city: '',
  state: '',
  first_job: false,
  education: '',
  experience: '',
  modality: '',
  salary: '',
};

const normalizeTalentText = (value?: string | number | null) => String(value ?? '').trim().toLowerCase();

const getTalentAge = (talent: TalentProfile) => {
  const numericAge = Number(talent.age);
  if (Number.isFinite(numericAge) && numericAge > 0) {
    return numericAge;
  }

  const calculatedAge = calculateAge(talent.birth_date);
  return calculatedAge > 0 ? calculatedAge : null;
};

const isCandidateTalent = (talent?: TalentProfile | null) => {
  if (!talent) return false;
  const role = normalizeTalentText(talent.role);
  return role !== 'empresa' && role !== 'company';
};

export const filterTalentProfiles = (
  talents: TalentProfile[],
  options: {
    talentSubTab: 'all' | 'saved';
    savedTalentIds?: string[];
    talentSearch: string;
    talentFilters: TalentFilters;
  },
) => {
  const { talentSubTab, savedTalentIds = [], talentSearch, talentFilters } = options;
  const normalizedSearch = normalizeTalentText(talentSearch);

  return talents.filter((talent) => {
    if (!isCandidateTalent(talent)) return false;

    if (talentSubTab === 'saved' && !savedTalentIds.includes(talent.id)) {
      return false;
    }

    const talentAge = getTalentAge(talent);
    const searchableValues = [
      talent.name,
      talent.email,
      talent.phone,
      talent.role,
      talent.city,
      talent.state,
      talent.salary,
      talent.summary,
      ...(Array.isArray(talent.skills) ? talent.skills : []),
      ...(Array.isArray(talent.experiences)
        ? talent.experiences.flatMap((experience) => [
          experience.role,
          experience.company,
          experience.description,
          experience.duration,
        ])
        : []),
      ...(Array.isArray(talent.educations)
        ? talent.educations.flatMap((education) => [
          education.course,
          education.institution,
          education.status,
          education.gradYear,
        ])
        : []),
    ];

    const matchesSearch = !normalizedSearch
      || searchableValues.some((value) => normalizeTalentText(value).includes(normalizedSearch));

    const ageFilterIsDefault = talentFilters.minAge === initialTalentFilters.minAge
      && talentFilters.maxAge === initialTalentFilters.maxAge;
    const matchesAge = ageFilterIsDefault
      || (talentAge !== null && talentAge >= talentFilters.minAge && talentAge <= talentFilters.maxAge);

    const matchesFilters = (!talentFilters.role || normalizeTalentText(talent.role).includes(normalizeTalentText(talentFilters.role)))
      && matchesAge
      && (!talentFilters.city || normalizeTalentText(talent.city).includes(normalizeTalentText(talentFilters.city)))
      && (!talentFilters.state || talent.state === talentFilters.state)
      && (!talentFilters.first_job || talent.first_job === true)
      && (!talentFilters.education || talent.education === talentFilters.education)
      && (!talentFilters.experience || talent.experience === talentFilters.experience)
      && (!talentFilters.modality || talent.modality === talentFilters.modality)
      && (!talentFilters.salary || normalizeTalentText(talent.salary).includes(normalizeTalentText(talentFilters.salary)));

    return matchesSearch && matchesFilters;
  });
};

type UseCompanyTalentBankParams<TOrg extends CompanyWithSavedTalents> = {
  companies: TOrg[];
  selectedCompanyId: string;
  setCompanies: Dispatch<SetStateAction<TOrg[]>>;
};

export const useCompanyTalentBank = <TOrg extends CompanyWithSavedTalents>({
  companies,
  selectedCompanyId,
  setCompanies,
}: UseCompanyTalentBankParams<TOrg>) => {
  const [talentSubTab, setTalentSubTab] = useState<'all' | 'saved'>('all');
  const [talentSearch, setTalentSearch] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [talentFilters, setTalentFilters] = useState<TalentFilters>(initialTalentFilters);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isFetchingTalents, setIsFetchingTalents] = useState(false);
  const [talentCities, setTalentCities] = useState<string[]>([]);
  const [isTalentLoadingCities, setIsTalentLoadingCities] = useState(false);

  useEffect(() => {
    async function loadTalents() {
      if (!import.meta.env.VITE_SUPABASE_URL) return;

      setIsFetchingTalents(true);
      try {
        const { data, error } = await supabase
          .from('talents')
          .select('id, name, email, phone, role, city, state, birth_date, age, gender, salary, summary, skills, profile_pic, first_job, experiences, educations');

        if (error) throw error;
        setTalents(data || []);
      } catch (err) {
        console.error('Erro ao buscar talentos do Supabase:', err);
      } finally {
        setIsFetchingTalents(false);
      }
    }

    loadTalents();
  }, []);

  useEffect(() => {
    if (talentFilters.state) {
      if (talentFilters.state === 'DF') {
        setTalentCities(DF_REGIONS);
        setIsTalentLoadingCities(false);
        return;
      }

      setIsTalentLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${talentFilters.state}/municipios`)
        .then((response) => response.json())
        .then((data) => {
          setTalentCities(sortBrazilianCityNames(data.map((city: { nome: string }) => city.nome)));
          setIsTalentLoadingCities(false);
        })
        .catch((err) => {
          console.error('Error fetching cities:', err);
          setIsTalentLoadingCities(false);
        });
    } else {
      setTalentCities([]);
    }
  }, [talentFilters.state]);

  const handleToggleSaveTalent = (talentId: string) => {
    setCompanies((previousCompanies) => previousCompanies.map((company) => {
      if (company.id === selectedCompanyId) {
        const saved = company.savedTalents || [];
        const updated = saved.includes(talentId)
          ? saved.filter((id) => id !== talentId)
          : [...saved, talentId];
        return { ...company, savedTalents: updated };
      }
      return company;
    }));
  };

  const selectedCompany = companies.find((company) => company.id === selectedCompanyId);
  const filteredTalents = filterTalentProfiles(talents, {
    talentSubTab,
    savedTalentIds: selectedCompany?.savedTalents || [],
    talentSearch,
    talentFilters,
  });
  const handleAiSearch = () => {
    if (!aiPrompt.trim()) return;
    setIsAiSearching(true);
    const keywords = aiPrompt
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 2)
      .slice(0, 4)
      .join(' ');

    setTalentSearch(keywords || aiPrompt.trim());
    setIsAiSearching(false);
    setShowAiModal(false);
    setAiPrompt('');
  };

  return {
    talents,
    filteredTalents,
    isFetchingTalents,
    talentSubTab,
    setTalentSubTab,
    talentSearch,
    setTalentSearch,
    isAiSearching,
    aiPrompt,
    setAiPrompt,
    showAiModal,
    setShowAiModal,
    talentFilters,
    setTalentFilters,
    talentCities,
    isTalentLoadingCities,
    handleToggleSaveTalent,
    handleAiSearch,
  };
};
