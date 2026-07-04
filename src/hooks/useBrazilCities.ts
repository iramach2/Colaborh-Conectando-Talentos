import { useEffect, useState } from 'react';

interface UseBrazilCitiesParams {
  stateCode?: string;
  dfRegions: string[];
}

type IbgeCity = {
  nome: string;
};

export const useBrazilCities = ({ stateCode, dfRegions }: UseBrazilCitiesParams) => {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    if (stateCode) {
      if (stateCode === 'DF') {
        setCities(dfRegions);
        setIsLoadingCities(false);
        return;
      }

      setIsLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios`)
        .then((response) => response.json())
        .then((data: IbgeCity[]) => {
          setCities(data.map((city) => city.nome).sort());
          setIsLoadingCities(false);
        })
        .catch((error) => {
          console.error('Error fetching cities:', error);
          setIsLoadingCities(false);
        });
    } else {
      setCities([]);
    }
  }, [dfRegions, stateCode]);

  return {
    cities,
    isLoadingCities,
  };
};
