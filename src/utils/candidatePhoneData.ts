export type CandidatePhoneData = {
  phone: string;
  disc: string;
  notes: string;
  questions: string;
  mbti: string;
  temperamentos: string;
  customTest: string;
  discDate: string | null;
  questionsDate: string | null;
  mbtiDate: string | null;
  temperamentosDate: string | null;
  customTestDate: string | null;
};

const emptyCandidatePhoneData = (): CandidatePhoneData => ({
  phone: '',
  disc: '',
  notes: '',
  questions: '',
  mbti: '',
  temperamentos: '',
  customTest: '',
  discDate: null,
  questionsDate: null,
  mbtiDate: null,
  temperamentosDate: null,
  customTestDate: null,
});

const markers = ['===DISC===', '===NOTES===', '===QUESTIONS===', '===MBTI===', '===TEMPERAMENTOS===', '===CUSTOM_TEST==='];

const splitBeforeAnyMarker = (value: string) => {
  let result = value;
  for (const marker of markers) {
    result = result.split(marker)[0];
  }
  return result.trim();
};

const extractMarkerValue = (source: string, marker: string) => {
  if (!source.includes(marker)) return '';
  return splitBeforeAnyMarker(source.split(marker)[1] || '');
};

const extractValueAndDate = (value: string) => {
  if (!value) return { value: '', date: null };
  if (!value.includes('===DATE===')) return { value: value.trim(), date: null };

  const [rawValue, rawDate] = value.split('===DATE===');
  return {
    value: (rawValue || '').trim(),
    date: (rawDate || '').trim() || null,
  };
};

export const parseCandidatePhoneData = (phoneStr: string): CandidatePhoneData => {
  if (!phoneStr) return emptyCandidatePhoneData();

  const discData = extractValueAndDate(extractMarkerValue(phoneStr, '===DISC==='));
  const questionsData = extractValueAndDate(extractMarkerValue(phoneStr, '===QUESTIONS==='));
  const mbtiData = extractValueAndDate(extractMarkerValue(phoneStr, '===MBTI==='));
  const temperamentosData = extractValueAndDate(extractMarkerValue(phoneStr, '===TEMPERAMENTOS==='));
  const customTestData = extractValueAndDate(extractMarkerValue(phoneStr, '===CUSTOM_TEST==='));

  return {
    phone: splitBeforeAnyMarker(phoneStr),
    disc: discData.value,
    discDate: discData.date,
    notes: extractMarkerValue(phoneStr, '===NOTES==='),
    questions: questionsData.value,
    questionsDate: questionsData.date,
    mbti: mbtiData.value,
    mbtiDate: mbtiData.date,
    temperamentos: temperamentosData.value,
    temperamentosDate: temperamentosData.date,
    customTest: customTestData.value,
    customTestDate: customTestData.date,
  };
};

export const serializeCandidatePhoneData = (
  phone: string,
  disc: string = '',
  notes: string = '',
  questions: string = '',
  mbti: string = '',
  temperamentos: string = '',
  customTest: string = '',
) => {
  let result = phone.trim();
  if (disc && disc.trim()) result += ` ===DISC===${disc.trim()}`;
  if (notes && notes.trim()) result += ` ===NOTES===${notes.trim()}`;
  if (questions && questions.trim()) result += ` ===QUESTIONS===${questions.trim()}`;
  if (mbti && mbti.trim()) result += ` ===MBTI===${mbti.trim()}`;
  if (temperamentos && temperamentos.trim()) result += ` ===TEMPERAMENTOS===${temperamentos.trim()}`;
  if (customTest && customTest.trim()) result += ` ===CUSTOM_TEST===${customTest.trim()}`;
  return result;
};

export type CandidateAssessmentMarkerField = 'disc' | 'questions' | 'mbti' | 'temperamentos' | 'customTest';

export const serializeCandidatePhoneWithAssessment = (
  currentPhone: string,
  field: CandidateAssessmentMarkerField,
  value: string,
) => {
  const parsedData = parseCandidatePhoneData(currentPhone || '');

  return serializeCandidatePhoneData(
    parsedData.phone,
    field === 'disc' ? value : parsedData.disc,
    parsedData.notes,
    field === 'questions' ? value : parsedData.questions,
    field === 'mbti' ? value : parsedData.mbti,
    field === 'temperamentos' ? value : parsedData.temperamentos,
    field === 'customTest' ? value : parsedData.customTest,
  );
};
