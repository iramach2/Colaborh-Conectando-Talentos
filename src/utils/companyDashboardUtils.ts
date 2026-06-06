export const APPLICATION_DATA = [
  { name: 'Seg', applications: 45, views: 120 },
  { name: 'Ter', applications: 52, views: 150 },
  { name: 'Qua', applications: 38, views: 110 },
  { name: 'Qui', applications: 65, views: 180 },
  { name: 'Sex', applications: 48, views: 140 },
  { name: 'Sab', applications: 20, views: 70 },
  { name: 'Dom', applications: 15, views: 50 },
];

export const VACANCY_DISTRIBUTION = [
  { name: 'Triagem', value: 40, color: '#6366f1' },
  { name: 'Entrevista', value: 30, color: '#10b981' },
  { name: 'Teste', value: 20, color: '#f59e0b' },
  { name: 'Contratado', value: 10, color: '#8b5cf6' },
];

export const TOP_SKILLS = [
  { name: 'React', count: 85 },
  { name: 'Vendas', count: 72 },
  { name: 'Liderança', count: 45 },
  { name: 'Inglês', count: 38 },
  { name: 'Design', count: 32 },
];

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const DF_REGIONS = [
  'Brasília (Plano Piloto)', 'Águas Claras', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Guará', 'Gama',
  'Vicente Pires', 'Sobradinho', 'Sobradinho II', 'Planaltina', 'Santa Maria', 'São Sebastião',
  'Recanto das Emas', 'Riacho Fundo', 'Riacho Fundo II', 'Núcleo Bandeirante', 'Cruzeiro',
  'Lago Norte', 'Lago Sul', 'Jardim Botânico', 'Itapoã', 'Paranoá', 'Park Way', 'SCIA/Estrutural',
  'SIA', 'Varjão', 'Brazlândia', 'Fercal', 'Arniqueira', 'Sol Nascente/Pôr do Sol',
  // Cidades do Entorno (RIDE)
  'Valparaíso de Goiás', 'Luziânia', 'Novo Gama', 'Cidade Ocidental', 'Águas Lindas de Goiás',
  'Santo Antônio do Descoberto', 'Formosa', 'Planaltina de Goiás', 'Cristalina', 'Padre Bernardo'
].sort();

export const parseCandidatePhoneData = (phoneStr: string) => {
  if (!phoneStr) return { phone: '', disc: '', notes: '', questions: '', mbti: '', temperamentos: '', customTest: '', discDate: null, questionsDate: null, mbtiDate: null, temperamentosDate: null, customTestDate: null };
  
  const extractValueAndDate = (str: string) => {
    if (!str) return { value: '', date: null };
    if (str.includes('===DATE===')) {
      const parts = str.split('===DATE===');
      return { value: parts[0].trim(), date: parts[1].trim() };
    }
    return { value: str.trim(), date: null };
  };

  let phone = phoneStr.split('===DISC===')[0].split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  
  let notes = '';
  if (phoneStr.includes('===NOTES===')) {
    const afterNotes = phoneStr.split('===NOTES===')[1];
    notes = afterNotes.split('===DISC===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  }
  
  let disc = '';
  if (phoneStr.includes('===DISC===')) {
    const afterDisc = phoneStr.split('===DISC===')[1];
    disc = afterDisc.split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  }

  let questions = '';
  if (phoneStr.includes('===QUESTIONS===')) {
    const afterQuestions = phoneStr.split('===QUESTIONS===')[1];
    questions = afterQuestions.split('===DISC===')[0].split('===NOTES===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  }

  let mbti = '';
  if (phoneStr.includes('===MBTI===')) {
    const afterMbti = phoneStr.split('===MBTI===')[1];
    mbti = afterMbti.split('===DISC===')[0].split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===TEMPERAMENTOS===')[0].split('===CUSTOM_TEST===')[0].trim();
  }

  let temperamentos = '';
  if (phoneStr.includes('===TEMPERAMENTOS===')) {
    const afterTemp = phoneStr.split('===TEMPERAMENTOS===')[1];
    temperamentos = afterTemp.split('===DISC===')[0].split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===CUSTOM_TEST===')[0].trim();
  }

  let customTest = '';
  if (phoneStr.includes('===CUSTOM_TEST===')) {
    const afterCustom = phoneStr.split('===CUSTOM_TEST===')[1];
    customTest = afterCustom.split('===DISC===')[0].split('===NOTES===')[0].split('===QUESTIONS===')[0].split('===MBTI===')[0].split('===TEMPERAMENTOS===')[0].trim();
  }
  
  const discData = extractValueAndDate(disc);
  const questionsData = extractValueAndDate(questions);
  const mbtiData = extractValueAndDate(mbti);
  const temperamentosData = extractValueAndDate(temperamentos);
  const customTestData = extractValueAndDate(customTest);
  
  return { 
    phone, 
    disc: discData.value, 
    discDate: discData.date,
    notes, 
    questions: questionsData.value, 
    questionsDate: questionsData.date,
    mbti: mbtiData.value, 
    mbtiDate: mbtiData.date,
    temperamentos: temperamentosData.value, 
    temperamentosDate: temperamentosData.date,
    customTest: customTestData.value,
    customTestDate: customTestData.date
  };
};

export const formatDate = (dateStr: any) => {
  if (!dateStr) return 'Não inf.';
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

export const getCurrentJobStages = (job: any): string[] => {
  if (!job) return [];
  if (job.description && job.description.includes('===ETAPAS_JSON===')) {
    try {
      const part = job.description.split('===ETAPAS_JSON===')[1].split('===FIM_ETAPAS===')[0];
      return JSON.parse(part);
    } catch (e) {
      console.error('Error parsing stages from description:', e);
    }
  }
  return Array.isArray(job.stages) 
    ? job.stages 
    : (typeof job.stages === 'string' 
        ? JSON.parse(job.stages) 
        : ['Análise de Currículo']);
};

export const getCurrentJobStageTests = (job: any): Record<string, string[]> => {
  if (!job) return {};
  if (job.description && job.description.includes('===STAGE_TESTS_JSON===')) {
    try {
      const part = job.description.split('===STAGE_TESTS_JSON===')[1].split('===FIM_STAGE_TESTS===')[0];
      return JSON.parse(part);
    } catch (e) {
      console.error('Error parsing stage tests from description:', e);
    }
  }
  const stages = getCurrentJobStages(job);
  const initial: Record<string, string[]> = {};
  stages.forEach(s => {
    initial[s] = [];
  });
  return initial;
};

// Função para calcular o score de match (0 a 100) do candidato para a vaga
export const calculateAiMatchScore = (job: any, fullApp: any) => {
  if (!job || !fullApp) return 0;
  
  const talent = fullApp.talentMatched;
  if (!talent) return 50; // Se não tiver perfil detalhado, dá um match médio padrão
  
  let score = 0;
  let totalPossible = 0;
  
  // 1. MATCH DE HABILIDADES (SKILLS) - Peso 40%
  const jobSkills = job.requirements || [];
  const candidateSkills = talent.skills || [];
  
  if (jobSkills.length > 0) {
    let matchedSkills = 0;
    jobSkills.forEach((reqSkill: string) => {
      // Checagem case-insensitive e parcial
      const matched = candidateSkills.some((candSkill: string) => 
        candSkill.toLowerCase().trim().includes(reqSkill.toLowerCase().trim()) ||
        reqSkill.toLowerCase().trim().includes(candSkill.toLowerCase().trim())
      );
      if (matched) matchedSkills++;
    });
    
    const skillsRatio = matchedSkills / jobSkills.length;
    score += skillsRatio * 40;
  } else {
    // Se a vaga não exige habilidades específicas, assume match de 30 pontos padrão na categoria
    score += 30;
  }
  totalPossible += 40;
  
  // 2. MATCH DE CARGO / TÍTULO (ROLE) - Peso 20%
  const jobTitle = (job.title || '').toLowerCase();
  const candidateRole = (talent.role || '').toLowerCase();
  const candidateSummary = (talent.summary || '').toLowerCase();
  
  let titleMatchPoints = 0;
  if (candidateRole) {
    // Se os títulos de cargo são muito parecidos
    if (jobTitle.includes(candidateRole) || candidateRole.includes(jobTitle)) {
      titleMatchPoints = 20;
    } else {
      // Palavras chave comuns nos cargos (ex: desenvolvedor, vendedor, gerente, analista)
      const jobWords = jobTitle.split(/\s+/).filter((w: string) => w.length > 3);
      let matchCount = 0;
      jobWords.forEach((word: string) => {
        if (candidateRole.includes(word) || candidateSummary.includes(word)) {
          matchCount++;
        }
      });
      
      if (matchCount > 0) {
        titleMatchPoints = Math.min(20, 10 + matchCount * 3);
      } else {
        titleMatchPoints = 5; // match mínimo de afinidade se não achar palavras-chave
      }
    }
  }
  score += titleMatchPoints;
  totalPossible += 20;
  
  // 3. MATCH DE LOCALIZAÇÃO E MODALIDADE - Peso 15%
  let locMatch = 15;
  const jobModality = (job.modality || '').toLowerCase();
  const candidateModality = (talent.modality || '').toLowerCase();
  
  // Se a vaga for presencial e os locais forem diferentes
  if (jobModality.includes('presencial')) {
    const jobCity = (job.city || '').toLowerCase().trim();
    const jobState = (job.state || '').toLowerCase().trim();
    const candCity = (talent.city || '').toLowerCase().trim();
    const candState = (talent.state || '').toLowerCase().trim();
    
    if (jobCity && candCity && jobCity !== candCity) {
      locMatch -= 8; // penalidade por cidade diferente
    }
    if (jobState && candState && jobState !== candState) {
      locMatch -= 5; // penalidade por estado diferente
    }
    
    // Preferência do candidato por modalidade
    if (candidateModality && !candidateModality.includes('presencial') && !candidateModality.includes('híbrido')) {
      locMatch -= 5; // prefere apenas remoto
    }
  } else if (jobModality.includes('home office') || jobModality.includes('remoto')) {
    // Se for remoto, a localização física não importa tanto, mas a modalidade preferida sim
    if (candidateModality && !candidateModality.includes('remoto') && !candidateModality.includes('híbrido')) {
      locMatch -= 5; // prefere apenas presencial
    }
  }
  score += Math.max(0, locMatch);
  totalPossible += 15;
  
  // 4. ADERÊNCIA SALARIAL - Peso 15%
  let salaryScore = 15;
  const extractNumber = (valStr: string) => {
    if (!valStr) return 0;
    const clean = valStr.replace(/\D/g, '');
    return clean ? parseInt(clean) : 0;
  };
  
  const jobSalaryVal = extractNumber(job.salary);
  const candidateSalaryVal = extractNumber(talent.salary);
  
  if (jobSalaryVal > 0 && candidateSalaryVal > 0) {
    if (candidateSalaryVal <= jobSalaryVal) {
      // Pretensão menor ou igual ao proposto
      salaryScore = 15;
    } else {
      // Pretensão maior. Calcula o excedente
      const diffPercent = (candidateSalaryVal - jobSalaryVal) / jobSalaryVal;
      if (diffPercent <= 0.1) {
        salaryScore = 12; // até 10% acima do orçamento é aceitável
      } else if (diffPercent <= 0.25) {
        salaryScore = 8;  // até 25% acima
      } else {
        salaryScore = 3;  // muito acima do orçamento
      }
    }
  }
  score += salaryScore;
  totalPossible += 15;
  
  // 5. ADERÊNCIA DE SÊNIORIDADE / EXPERIÊNCIA - Peso 10%
  let senScore = 8;
  const candidateExp = (talent.experience || '').toLowerCase();
  
  let jobReqSeniority = 'pleno'; // default
  if (jobTitle.includes('sênior') || jobTitle.includes('senior') || jobTitle.includes('sr') || jobTitle.includes('especialista')) {
    jobReqSeniority = 'sênior';
  } else if (jobTitle.includes('júnior') || jobTitle.includes('junior') || jobTitle.includes('jr') || jobTitle.includes('assistente')) {
    jobReqSeniority = 'júnior';
  } else if (jobTitle.includes('estágio') || jobTitle.includes('estagiário') || jobTitle.includes('estagiario')) {
    jobReqSeniority = 'estágio';
  }
  
  if (candidateExp) {
    if (candidateExp.includes(jobReqSeniority)) {
      senScore = 10;
    } else {
      // Desvios toleráveis
      if (jobReqSeniority === 'sênior' && candidateExp.includes('pleno')) senScore = 6;
      else if (jobReqSeniority === 'pleno' && candidateExp.includes('sênior')) senScore = 10; // sobreequalificado
      else if (jobReqSeniority === 'pleno' && candidateExp.includes('júnior')) senScore = 5;
      else if (jobReqSeniority === 'júnior' && candidateExp.includes('pleno')) senScore = 8; // sobreequalificado
      else senScore = 4; // incompatível
    }
  }
  score += senScore;
  totalPossible += 10;
  
  // Arredonda e retorna o score final entre 0 e 100
  return Math.min(100, Math.max(0, Math.round((score / totalPossible) * 100)));
};

export const serializeCandidatePhoneData = (
  phone: string, 
  disc: string = '', 
  notes: string = '', 
  questions: string = '', 
  mbti: string = '', 
  temperamentos: string = '',
  customTest: string = ''
) => {
  let result = phone.trim();
  if (disc && disc.trim()) {
    result += ` ===DISC===${disc.trim()}`;
  }
  if (notes && notes.trim()) {
    result += ` ===NOTES===${notes.trim()}`;
  }
  if (questions && questions.trim()) {
    result += ` ===QUESTIONS===${questions.trim()}`;
  }
  if (mbti && mbti.trim()) {
    result += ` ===MBTI===${mbti.trim()}`;
  }
  if (temperamentos && temperamentos.trim()) {
    result += ` ===TEMPERAMENTOS===${temperamentos.trim()}`;
  }
  if (customTest && customTest.trim()) {
    result += ` ===CUSTOM_TEST===${customTest.trim()}`;
  }
  return result;
};

export const getCustomQuestionsFromJobDescription = (description: string): any[] => {
  if (!description) return [];
  const regex = /===CUSTOM_QUESTIONS_JSON===([\s\S]*?)===FIM_CUSTOM_QUESTIONS===/;
  const match = description.match(regex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      console.error("Erro ao fazer parse do JSON de perguntas customizadas:", e);
    }
  }
  return [];
};

export const QUESTIONS_CATEGORIES = {
  EXPERIENCE: {
    title: "Experiência Profissional",
    questions: [
      "Conte sobre sua trajetória profissional e as principais atividades que desempenhou, na vaga para qual está se candidatando;",
      "Qual foi a experiência profissional mais significativa da sua carreira até o momento? Por quê?",
      "Quais habilidades você desenvolveu ao longo das suas experiências anteriores?",
      "Fale sobre um desafio profissional que enfrentou e como conseguiu solucioná-lo.",
      "Cite uma conquista profissional da qual você se orgulha e explique sua participação."
    ]
  },
  CONTRIBUTION: {
    title: "Contribuição e Resultados",
    questions: [
      "De que forma você acredita que pode contribuir para nossa empresa e equipe? (Qual seu diferencial para a vaga em que está se candidatando)",
      "Em experiências anteriores, o que você fez que trouxe resultados positivos para a empresa?",
      "Você já identificou alguma melhoria em processos ou atividades no ambiente de trabalho? Explique.",
      "Como você costuma lidar com metas, prazos e cobranças?",
      "O que considera essencial para gerar bons resultados no trabalho."
    ]
  },
  TEAMWORK: {
    title: "Trabalho em Equipe",
    questions: [
      "Como você define um bom trabalho em equipe?",
      "Conte uma situação em que precisou colaborar com colegas para alcançar um objetivo.",
      "Como você reage quando existem opiniões diferentes dentro da equipe?",
      "Qual costuma ser seu papel dentro de uma equipe: líder, apoiador, organizador, executor ou outro? Explique.",
      "O que você considera mais importante para manter um ambiente de trabalho saudável."
    ]
  },
  BEHAVIORAL: {
    title: "Comportamental",
    questions: [
      "Como você lida com mudanças inesperadas ou situações fora do planejamento?",
      "Como costuma reagir diante de pressão ou momentos de grande demanda?",
      "Cite três características pessoais que considera seus pontos fortes.",
      "Qual comportamento ou habilidade você busca melhorar em si mesmo atualmente?",
      "O que mais motiva você em um ambiente de trabalho?"
    ]
  }
};

export const ALL_QUESTIONS_LIST = [
  ...QUESTIONS_CATEGORIES.EXPERIENCE.questions,
  ...QUESTIONS_CATEGORIES.CONTRIBUTION.questions,
  ...QUESTIONS_CATEGORIES.TEAMWORK.questions,
  ...QUESTIONS_CATEGORIES.BEHAVIORAL.questions
];

export const calculateAge = (birthDate: string) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

