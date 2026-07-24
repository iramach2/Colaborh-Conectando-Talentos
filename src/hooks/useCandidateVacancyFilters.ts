import { useEffect, useMemo, useState } from 'react';
import type { CompanyJob } from '../types/companyDashboard';
import { sortBrazilianCityNames } from '../utils/companyDashboardUtils';

interface UseCandidateVacancyFiltersParams {
  vacancies: CompanyJob[];
  dfRegions: string[];
  cleanText: (text: string) => string;
}

type IbgeCity = {
  nome: string;
};

export const useCandidateVacancyFilters = ({
  vacancies,
  dfRegions,
  cleanText,
}: UseCandidateVacancyFiltersParams) => {
  const [vacancySearch, setVacancySearch] = useState('');
  const [vacancyModalityFilter, setVacancyModalityFilter] = useState('');
  const [vacancyContractFilter, setVacancyContractFilter] = useState('');
  const [vacancyStateFilter, setVacancyStateFilter] = useState('');
  const [vacancyCityFilter, setVacancyCityFilter] = useState('');
  const [vacancyCitiesList, setVacancyCitiesList] = useState<string[]>([]);
  const [isLoadingVacancyCities, setIsLoadingVacancyCities] = useState(false);

  useEffect(() => {
    if (vacancyStateFilter) {
      if (vacancyStateFilter === 'DF') {
        setVacancyCitiesList(dfRegions);
        setIsLoadingVacancyCities(false);
        return;
      }

      setIsLoadingVacancyCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${vacancyStateFilter}/municipios`)
        .then((response) => response.json())
        .then((data: IbgeCity[]) => {
          setVacancyCitiesList(sortBrazilianCityNames(data.map((city) => city.nome)));
          setIsLoadingVacancyCities(false);
        })
        .catch((error) => {
          console.error('Error fetching vacancy cities:', error);
          setIsLoadingVacancyCities(false);
        });
    } else {
      setVacancyCitiesList([]);
      setVacancyCityFilter('');
    }
  }, [dfRegions, vacancyStateFilter]);

  const clearVacancyFilters = () => {
    setVacancySearch('');
    setVacancyModalityFilter('');
    setVacancyContractFilter('');
    setVacancyStateFilter('');
    setVacancyCityFilter('');
  };

  const filteredVacancies = useMemo(() => vacancies.filter((vacancy) => {
    const titleClean = cleanText(vacancy.title || '').toLowerCase();
    const descClean = (vacancy.description || '').toLowerCase();
    const companyClean = (vacancy.company_name || '').toLowerCase();
    const searchLower = vacancySearch.toLowerCase();

    const matchesSearch = !vacancySearch ||
      titleClean.includes(searchLower) ||
      descClean.includes(searchLower) ||
      companyClean.includes(searchLower);

    const matchesModality = !vacancyModalityFilter || vacancy.modality === vacancyModalityFilter;
    const matchesContract = !vacancyContractFilter || vacancy.contract_type === vacancyContractFilter;
    const matchesState = !vacancyStateFilter || vacancy.state === vacancyStateFilter;
    const matchesCity = !vacancyCityFilter ||
      (vacancy.city && vacancy.city.toLowerCase().trim() === vacancyCityFilter.toLowerCase().trim());

    return matchesSearch && matchesModality && matchesContract && matchesState && matchesCity;
  }), [
    cleanText,
    vacancies,
    vacancyCityFilter,
    vacancyContractFilter,
    vacancyModalityFilter,
    vacancySearch,
    vacancyStateFilter,
  ]);

  return {
    vacancySearch,
    setVacancySearch,
    vacancyModalityFilter,
    setVacancyModalityFilter,
    vacancyContractFilter,
    setVacancyContractFilter,
    vacancyStateFilter,
    setVacancyStateFilter,
    vacancyCityFilter,
    setVacancyCityFilter,
    vacancyCitiesList,
    isLoadingVacancyCities,
    filteredVacancies,
    clearVacancyFilters,
  };
};
