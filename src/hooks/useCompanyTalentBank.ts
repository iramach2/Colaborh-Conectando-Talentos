import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { calculateAge, DF_REGIONS } from '../utils/companyDashboardUtils';

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
          setTalentCities(data.map((city: { nome: string }) => city.nome).sort());
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

  const filteredTalents = talents.filter((talent) => {
    if (!talent) return false;
    if (talent.role && (talent.role.toLowerCase() === 'empresa' || talent.role.toLowerCase() === 'company')) {
      return false;
    }

    if (talentSubTab === 'saved') {
      const selectedCompany = companies.find((company) => company.id === selectedCompanyId);
      const savedIds = selectedCompany?.savedTalents || [];
      if (!savedIds.includes(talent.id)) {
        return false;
      }
    }

    const talentAge = talent.age || calculateAge(talent.birth_date) || 0;
    const talentName = talent.name || '';
    const talentRole = talent.role || '';
    const talentCity = talent.city || '';
    const talentState = talent.state || '';
    const talentSalary = talent.salary || '';
    const normalizedSearch = talentSearch.toLowerCase();

    const matchesSearch = talentName.toLowerCase().includes(normalizedSearch)
      || talentRole.toLowerCase().includes(normalizedSearch)
      || (talent.skills && Array.isArray(talent.skills) && talent.skills.some((skill: string) => skill && skill.toLowerCase().includes(normalizedSearch)));

    const matchesFilters = (!talentFilters.role || talentRole.toLowerCase().includes(talentFilters.role.toLowerCase()))
      && (talentAge >= talentFilters.minAge && talentAge <= talentFilters.maxAge)
      && (!talentFilters.city || talentCity.toLowerCase().includes(talentFilters.city.toLowerCase()))
      && (!talentFilters.state || talentState === talentFilters.state)
      && (!talentFilters.first_job || talent.first_job === true)
      && (!talentFilters.education || talent.education === talentFilters.education)
      && (!talentFilters.experience || talent.experience === talentFilters.experience)
      && (!talentFilters.modality || talent.modality === talentFilters.modality)
      && (!talentFilters.salary || talentSalary.includes(talentFilters.salary));

    return matchesSearch && matchesFilters;
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
