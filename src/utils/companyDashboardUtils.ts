export {
  parseCandidatePhoneData,
  serializeCandidatePhoneData,
  serializeCandidatePhoneWithAssessment,
} from './candidatePhoneData';
import type { CustomQuestion } from '../types/candidate';
import type { CompanyApplicant, CompanyJob } from '../types/companyDashboard';

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const cleanEmojiFromText = (text: string): string => {
  return text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
};

export const DF_REGIONS = [
  'Brasilia (Plano Piloto)', 'Aguas Claras', 'Ceilandia', 'Taguatinga', 'Samambaia', 'Guara', 'Gama',
  'Vicente Pires', 'Sobradinho', 'Sobradinho II', 'Planaltina', 'Santa Maria', 'Sao Sebastiao',
  'Recanto das Emas', 'Riacho Fundo', 'Riacho Fundo II', 'Nucleo Bandeirante', 'Cruzeiro',
  'Lago Norte', 'Lago Sul', 'Jardim Botanico', 'Itapoa', 'Paranoa', 'Park Way', 'SCIA/Estrutural',
  'SIA', 'Varjao', 'Brazlandia', 'Fercal', 'Arniqueira', 'Sol Nascente/Por do Sol',
  'Valparaiso de Goias', 'Luziania', 'Novo Gama', 'Cidade Ocidental', 'Aguas Lindas de Goias',
  'Santo Antonio do Descoberto', 'Formosa', 'Planaltina de Goias', 'Cristalina', 'Padre Bernardo',
].sort();

export const formatDate = (dateStr: string | number | Date | null | undefined) => {
  if (!dateStr) return 'Nao inf.';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    if (typeof dateStr === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }
    return d.toLocaleDateString('pt-BR');
  } catch (e) {
    return String(dateStr);
  }
};

export const getCurrentJobStages = (job?: CompanyJob | null): string[] => {
  if (!job) return [];
  if (Array.isArray(job.stages)) return job.stages;
  if (typeof job.stages === 'string') {
    try {
      return JSON.parse(job.stages);
    } catch (e) {
      console.error('Error parsing stages column:', e);
    }
  }
  if (job.description && job.description.includes('===ETAPAS_JSON===')) {
    try {
      const part = job.description.split('===ETAPAS_JSON===')[1].split('===FIM_ETAPAS===')[0];
      return JSON.parse(part);
    } catch (e) {
      console.error('Error parsing stages from description:', e);
    }
  }
  return ['Analise de Curriculo'];
};

export const getCurrentJobStageTests = (job?: CompanyJob | null): Record<string, string[]> => {
  if (!job) return {};
  if (job.description && job.description.includes('===STAGE_TESTS_JSON===')) {
    try {
      const part = job.description.split('===STAGE_TESTS_JSON===')[1].split('===FIM_STAGE_TESTS===')[0];
      return JSON.parse(part);
    } catch (e) {
      console.error('Error parsing stage tests from description:', e);
    }
  }
  if (job.stageTests && typeof job.stageTests === 'object') {
    return job.stageTests;
  }
  return getCurrentJobStages(job).reduce<Record<string, string[]>>((acc, stage) => {
    acc[stage] = [];
    return acc;
  }, {});
};

export const calculateAiMatchScore = (job: CompanyJob | null | undefined, fullApp: CompanyApplicant | null | undefined) => {
  if (!job || !fullApp) return 0;

  const talent = fullApp.talentMatched;
  if (!talent) return 50;

  let score = 0;
  let totalPossible = 0;

  const jobSkills = Array.isArray(job.requirements) ? job.requirements : [];
  const candidateSkills = Array.isArray(talent.skills) ? talent.skills : [];

  if (jobSkills.length > 0) {
    const matchedSkills = jobSkills.filter((reqSkill: string) =>
      candidateSkills.some((candSkill: string) =>
        candSkill.toLowerCase().trim().includes(reqSkill.toLowerCase().trim()) ||
        reqSkill.toLowerCase().trim().includes(candSkill.toLowerCase().trim()),
      ),
    ).length;
    score += (matchedSkills / jobSkills.length) * 40;
  } else {
    score += 30;
  }
  totalPossible += 40;

  const jobTitle = (job.title || '').toLowerCase();
  const candidateRole = (talent.role || '').toLowerCase();
  const candidateSummary = (talent.summary || '').toLowerCase();
  let titleMatchPoints = 5;

  if (candidateRole) {
    if (jobTitle.includes(candidateRole) || candidateRole.includes(jobTitle)) {
      titleMatchPoints = 20;
    } else {
      const jobWords = jobTitle.split(/\s+/).filter((w: string) => w.length > 3);
      const matchCount = jobWords.filter((word: string) =>
        candidateRole.includes(word) || candidateSummary.includes(word),
      ).length;
      titleMatchPoints = matchCount > 0 ? Math.min(20, 10 + matchCount * 3) : 5;
    }
  }
  score += titleMatchPoints;
  totalPossible += 20;

  let locationScore = 15;
  const jobModality = (job.modality || '').toLowerCase();
  const candidateModality = (talent.modality || '').toLowerCase();
  if (jobModality.includes('presencial')) {
    if (job.city && talent.city && job.city.toLowerCase().trim() !== talent.city.toLowerCase().trim()) locationScore -= 8;
    if (job.state && talent.state && job.state.toLowerCase().trim() !== talent.state.toLowerCase().trim()) locationScore -= 5;
    if (candidateModality && !candidateModality.includes('presencial') && !candidateModality.includes('hibrido')) locationScore -= 5;
  } else if (jobModality.includes('home office') || jobModality.includes('remoto')) {
    if (candidateModality && !candidateModality.includes('remoto') && !candidateModality.includes('hibrido')) locationScore -= 5;
  }
  score += Math.max(0, locationScore);
  totalPossible += 15;

  const extractNumber = (value: string) => {
    const clean = (value || '').replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };
  const jobSalaryVal = extractNumber(job.salary);
  const candidateSalaryVal = extractNumber(talent.salary);
  let salaryScore = 15;
  if (jobSalaryVal > 0 && candidateSalaryVal > 0 && candidateSalaryVal > jobSalaryVal) {
    const diffPercent = (candidateSalaryVal - jobSalaryVal) / jobSalaryVal;
    salaryScore = diffPercent <= 0.1 ? 12 : diffPercent <= 0.25 ? 8 : 3;
  }
  score += salaryScore;
  totalPossible += 15;

  let seniorityScore = 8;
  const candidateExp = (talent.experience || '').toLowerCase();
  let jobReqSeniority = 'pleno';
  if (jobTitle.includes('senior') || jobTitle.includes('sr') || jobTitle.includes('especialista')) {
    jobReqSeniority = 'senior';
  } else if (jobTitle.includes('junior') || jobTitle.includes('jr') || jobTitle.includes('assistente')) {
    jobReqSeniority = 'junior';
  } else if (jobTitle.includes('estagio') || jobTitle.includes('estagiario')) {
    jobReqSeniority = 'estagio';
  }
  if (candidateExp) {
    if (candidateExp.includes(jobReqSeniority)) seniorityScore = 10;
    else if (jobReqSeniority === 'senior' && candidateExp.includes('pleno')) seniorityScore = 6;
    else if (jobReqSeniority === 'pleno' && candidateExp.includes('senior')) seniorityScore = 10;
    else if (jobReqSeniority === 'pleno' && candidateExp.includes('junior')) seniorityScore = 5;
    else if (jobReqSeniority === 'junior' && candidateExp.includes('pleno')) seniorityScore = 8;
    else seniorityScore = 4;
  }
  score += seniorityScore;
  totalPossible += 10;

  return Math.min(100, Math.max(0, Math.round((score / totalPossible) * 100)));
};

export const getCustomQuestionsFromJobDescription = (description: string): CustomQuestion[] => {
  if (!description) return [];
  const regex = /===CUSTOM_QUESTIONS_JSON===([\s\S]*?)===FIM_CUSTOM_QUESTIONS===/;
  const match = description.match(regex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      console.error('Erro ao fazer parse do JSON de perguntas customizadas:', e);
    }
  }
  return [];
};

export const QUESTIONS_CATEGORIES = {
  EXPERIENCE: {
    title: 'Experiencia Profissional',
    questions: [
      'Conte sobre sua trajetoria profissional e as principais atividades que desempenhou, na vaga para qual esta se candidatando;',
      'Qual foi a experiencia profissional mais significativa da sua carreira ate o momento? Por que?',
      'Quais habilidades voce desenvolveu ao longo das suas experiencias anteriores?',
      'Fale sobre um desafio profissional que enfrentou e como conseguiu soluciona-lo.',
      'Cite uma conquista profissional da qual voce se orgulha e explique sua participacao.',
    ],
  },
  CONTRIBUTION: {
    title: 'Contribuicao e Resultados',
    questions: [
      'De que forma voce acredita que pode contribuir para nossa empresa e equipe? Qual seu diferencial para a vaga?',
      'Em experiencias anteriores, o que voce fez que trouxe resultados positivos para a empresa?',
      'Voce ja identificou alguma melhoria em processos ou atividades no ambiente de trabalho? Explique.',
      'Como voce costuma lidar com metas, prazos e cobrancas?',
      'O que considera essencial para gerar bons resultados no trabalho.',
    ],
  },
  TEAMWORK: {
    title: 'Trabalho em Equipe',
    questions: [
      'Como voce define um bom trabalho em equipe?',
      'Conte uma situacao em que precisou colaborar com colegas para alcancar um objetivo.',
      'Como voce reage quando existem opinioes diferentes dentro da equipe?',
      'Qual costuma ser seu papel dentro de uma equipe: lider, apoiador, organizador, executor ou outro? Explique.',
      'O que voce considera mais importante para manter um ambiente de trabalho saudavel.',
    ],
  },
  BEHAVIORAL: {
    title: 'Comportamental',
    questions: [
      'Como voce lida com mudancas inesperadas ou situacoes fora do planejamento?',
      'Como costuma reagir diante de pressao ou momentos de grande demanda?',
      'Cite tres caracteristicas pessoais que considera seus pontos fortes.',
      'Qual comportamento ou habilidade voce busca melhorar em si mesmo atualmente?',
      'O que mais motiva voce em um ambiente de trabalho?',
    ],
  },
};

export const ALL_QUESTIONS_LIST = [
  ...QUESTIONS_CATEGORIES.EXPERIENCE.questions,
  ...QUESTIONS_CATEGORIES.CONTRIBUTION.questions,
  ...QUESTIONS_CATEGORIES.TEAMWORK.questions,
  ...QUESTIONS_CATEGORIES.BEHAVIORAL.questions,
];

export const calculateAge = (birthDate: string) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
