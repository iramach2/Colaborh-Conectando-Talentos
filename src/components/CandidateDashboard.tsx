import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { 
  User, 
  FileText, 
  Briefcase, 
  Star, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Camera,
  GraduationCap,
  Sparkles,
  Loader2,
  Mail,
  X,
  Phone,
  MapPin,
  Save,
  Clock,
  Accessibility,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building,
  Eye,
  Download,
  DollarSign,
  ArrowLeft,
  Brain,
  Award,
  Menu,
  Compass,
  Bell,
  MessageSquare,
  Building2,
  AlertTriangle,
  HelpCircle,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import Cropper from 'react-easy-crop';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

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

export const getCustomTestStatusForApp = (app: any) => {
  const parsed = parseCandidatePhoneData(app.candidate_phone || '');
  const customVal = parsed.customTest;
  if (customVal) {
    if (customVal === 'PENDING') {
      return { status: 'PENDING', answers: null };
    }
    if (customVal.startsWith('PENDING:::')) {
      try {
        const jsonStr = customVal.replace('PENDING:::', '').trim();
        const data = JSON.parse(jsonStr);
        return { status: 'PENDING', answers: null, title: data.title, questions: data.questions };
      } catch (err) {
        console.error('Erro ao fazer parse do JSON de Custom Test pendente:', err);
        return { status: 'NONE', answers: null };
      }
    }
    if (customVal.startsWith('COMPLETED:::')) {
      try {
        const jsonStr = customVal.replace('COMPLETED:::', '').trim();
        const data = JSON.parse(jsonStr);
        return { status: 'COMPLETED', answers: data.responses || {}, title: data.title, questions: data.questions };
      } catch (err) {
        console.error('Erro ao fazer parse do JSON de Custom Test concluído:', err);
        return { status: 'NONE', answers: null };
      }
    }
    if (customVal.startsWith('COMPLETED===')) {
      try {
        const jsonStr = customVal.replace('COMPLETED===', '').trim();
        const data = JSON.parse(jsonStr);
        return { status: 'COMPLETED', answers: data.responses || data };
      } catch (err) {
        console.error('Erro ao fazer parse do JSON de Custom Test:', err);
        return { status: 'NONE', answers: null };
      }
    }
  }
  return { status: 'NONE', answers: null };
};

export interface TemperamentosQuestion {
  id: number;
  text: string;
  options: {
    I: string;
    C: string;
    O: string;
    A: string;
  };
}

export const TEMPERAMENTOS_QUESTIONS: TemperamentosQuestion[] = [
  {
    id: 1,
    text: "Eu sou...",
    options: {
      I: "Idealista, criativo e visionário",
      C: "Divertido, espiritual e benéfico",
      O: "Confiável, meticuloso e previsível",
      A: "Focado, determinado e persistente"
    }
  },
  {
    id: 2,
    text: "Eu gosto de...",
    options: {
      A: "Ser piloto",
      C: "Conversar com os passageiros",
      O: "Planejar a viagem",
      I: "Explorar novas rotas"
    }
  },
  {
    id: 3,
    text: "Se você quiser se dar bem comigo...",
    options: {
      I: "Me dê liberdade",
      O: "Me deixe saber sua expectativa",
      A: "Lidere, siga ou saia do caminho",
      C: "Seja amigável, carinhoso e compreensivo"
    }
  },
  {
    id: 4,
    text: "Para conseguir obter bons resultados é preciso...",
    options: {
      I: "Ter incertezas",
      O: "Controlar o essencial",
      C: "Diversão e celebração",
      A: "Planejar e obter recursos"
    }
  },
  {
    id: 5,
    text: "Eu me divirto quando...",
    options: {
      A: "Estou me exercitando",
      I: "Tenho novidades",
      C: "Estou com outros",
      O: "Determino as regras"
    }
  },
  {
    id: 6,
    text: "Eu penso que...",
    options: {
      C: "Unidos venceremos, divididos perderemos",
      A: "O ataque é melhor que a defesa",
      I: "É bom ser manso, mas andar com um porrete",
      O: "Um homem prevenido vale por dois"
    }
  },
  {
    id: 7,
    text: "Minha preocupação é...",
    options: {
      I: "Gerar a ideia global",
      C: "Fazer com que as pessoas gostem",
      O: "Fazer com que funcione",
      A: "Fazer com que aconteça"
    }
  },
  {
    id: 8,
    text: "Eu prefiro...",
    options: {
      A: "Vencer",
      O: "Ter garantias",
      C: "Ser aceito",
      I: "Descobrir novas possibilidades"
    }
  },
  {
    id: 9,
    text: "Eu gosto de pessoas que...",
    options: {
      O: "Seguem processos",
      C: "Demonstram emoção",
      A: "Tomam atitude",
      I: "Pensam diferente"
    }
  },
  {
    id: 10,
    text: "Eu valorizo mais...",
    options: {
      O: "Precisão",
      C: "Harmonia",
      A: "Resultado",
      I: "Criatividade"
    }
  },
  {
    id: 11,
    text: "Eu normalmente...",
    options: {
      C: "Converso facilmente",
      O: "Analiso antes",
      A: "Tomo iniciativa",
      I: "Imagino possibilidades"
    }
  },
  {
    id: 12,
    text: "Minha tendência é...",
    options: {
      O: "Planejar",
      C: "Compartilhar",
      A: "Executar rapidamente",
      I: "Criar alternativas"
    }
  },
  {
    id: 13,
    text: "Eu gosto mais de...",
    options: {
      C: "Pessoas",
      O: "Estrutura",
      A: "Desafios",
      I: "Liberdade"
    }
  },
  {
    id: 14,
    text: "Eu sempre gostei de...",
    options: {
      I: "Explorar",
      O: "Evitar surpresas",
      A: "Focalizar a meta",
      C: "Realizar uma abordagem natural"
    }
  },
  {
    id: 15,
    text: "Eu gosto de mudanças se...",
    options: {
      A: "Me der vantagem competitiva",
      C: "For divertido e compartilhável",
      I: "Me der liberdade e variedade",
      O: "Melhorar ou me der mais controle"
    }
  },
  {
    id: 16,
    text: "Não existe nada de errado em...",
    options: {
      A: "Se colocar na frente",
      C: "Colocar os outros na frente",
      I: "Mudar de ideia",
      O: "Ser consistente"
    }
  },
  {
    id: 17,
    text: "Eu gosto de buscar conselhos de...",
    options: {
      A: "Pessoas bem sucedidas",
      C: "Anciões e conselheiros",
      O: "Autoridades no assunto",
      I: "Lugares e ideias estranhas"
    }
  },
  {
    id: 18,
    text: "Meu lema é...",
    options: {
      I: "Fazer o que precisa ser feito",
      O: "Fazer bem feito",
      C: "Fazer junto com o grupo",
      A: "Simplesmente fazer"
    }
  },
  {
    id: 19,
    text: "Eu gosto de...",
    options: {
      I: "Complexidade, mesmo se confuso",
      O: "Ordem e sistematização",
      C: "Calor humano e animação",
      A: "Coisas claras e simples"
    }
  },
  {
    id: 20,
    text: "Tempo para mim é...",
    options: {
      A: "Algo que detesto desperdiçar",
      C: "Um grande ciclo",
      O: "Uma flecha que leva ao inevitável",
      I: "Irrelevante"
    }
  },
  {
    id: 21,
    text: "Se eu fosse bilionário...",
    options: {
      C: "Faria doações para muitas entidades",
      O: "Criaria uma poupança avantajada",
      I: "Faria o que desse na cabeça",
      A: "Exibiria bastante com algumas pessoas"
    }
  },
  {
    id: 22,
    text: "Eu acredito que...",
    options: {
      A: "O destino é mais importante que a jornada",
      C: "A jornada é mais importante que o destino",
      O: "Um centavo economizado é um centavo ganho",
      I: "Bastam um navio e uma estrela para navegar"
    }
  },
  {
    id: 23,
    text: "Eu acredito também que...",
    options: {
      A: "Aquele que hesita está perdido",
      O: "De grão em grão a galinha enche o papo",
      C: "O que vai, volta",
      I: "Um sorriso ou uma careta é o mesmo para quem é cego"
    }
  },
  {
    id: 24,
    text: "Eu acredito ainda que...",
    options: {
      O: "É melhor prudência do que arrependimento",
      I: "A autoridade deve ser desafiada",
      A: "Ganhar é fundamental",
      C: "O coletivo é mais importante do que o individual"
    }
  },
  {
    id: 25,
    text: "Eu penso que...",
    options: {
      I: "Não é fácil ficar encurralado",
      O: "É preferível olhar, antes de pular",
      C: "Duas cabeças pensam melhor do que uma",
      A: "Se você não tem condições de competir, não compita"
    }
  }
];

export const TEMPERAMENTOS_PROFILES: Record<string, {
  name: string;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  environments: string[];
}> = {
  I: {
    name: "Idealista / Criativo",
    title: "Inovador Visionário",
    description: "Indivíduos criativos, intuitivos e visionários que adoram a liberdade e buscam pensar de maneira inovadora. Adaptam-se muito bem a novidades e exploram rotas desconhecidas com entusiasmo, embora possam apresentar dificuldades com rotinas e estabilidade rígida.",
    strengths: ["Criatividade", "Inovação", "Visão de futuro", "Adaptabilidade", "Pensamento fora da caixa"],
    weaknesses: ["Fácil distração", "Dificuldade com rotinas", "Mudanças frequentes de rumo", "Pouca tolerância à repetição"],
    environments: ["Criação", "Marketing", "Estratégia e Inovação", "Desenvolvimento de novos projetos"]
  },
  C: {
    name: "Comunicador / Relacional",
    title: "Facilitador de Equipes",
    description: "Pessoas altamente sociáveis, comunicativas e empáticas. Trabalham incrivelmente bem em ambientes coletivos e buscam harmonia constante em suas relações interpessoais. Podem ser excessivamente sensíveis ou evitar confrontos e tomadas de decisão difíceis.",
    strengths: ["Comunicação ativa", "Relacionamento interpessoal", "Espírito de equipe", "Capacidade de engajamento"],
    weaknesses: ["Sensibilidade extrema", "Dificuldade com conflitos", "Alta necessidade de aprovação", "Tendência a evitar confrontos necessários"],
    environments: ["Atendimento ao cliente", "Recursos Humanos (RH)", "Vendas e Comercial", "Liderança de equipes", "Áreas sociais"]
  },
  O: {
    name: "Organizador / Analítico",
    title: "Planejador Metódico",
    description: "Personalidades metódicas, organizadas e extremamente precisas. Valorizam a estabilidade, a segurança e a previsibilidade, focando em processos eficientes e planejamento de longo prazo. Podem apresentar rigidez e perfeccionismo excessivo.",
    strengths: ["Organização impecável", "Confiabilidade", "Planejamento estruturado", "Precisão e qualidade técnica"],
    weaknesses: ["Rigidez operacional", "Resistência a mudanças bruscas", "Perfeccionismo travante", "Excesso de cautela"],
    environments: ["Controladoria e Financeiro", "Análise de Processos", "Administrativo", "Garantia de Qualidade", "Controle de projetos"]
  },
  A: {
    name: "Executor / Dominante",
    title: "Líder Assertivo",
    description: "Profissionais orientados a resultados, competitivos e determinados. Tomam decisões com rapidez e assumem posições de liderança de forma natural. Podem se mostrar impacientes ou demonstrar baixa tolerância com ritmos mais lentos.",
    strengths: ["Liderança assertiva", "Foco em resultados", "Agilidade de execução", "Tomada de decisão rápida"],
    weaknesses: ["Impaciência", "Autoritarismo", "Pouca tolerância com lentidão", "Risco de desconsiderar aspectos emocionais"],
    environments: ["Gestão executiva", "Direção comercial", "Negociação", "Operações críticas", "Áreas de alta competitividade"]
  },
  "A + O": {
    name: "Executor Estratégico",
    title: "Líder Organizador",
    description: "Esta combinação traz o melhor da execução assertiva aliado à estrutura analítica do organizador. São focados em metas, mas planejam as etapas detalhadamente antes de iniciar. Possuem forte liderança e alta qualidade de entrega.",
    strengths: ["Liderança forte", "Foco em resultados e processos", "Organização extrema", "Confiabilidade técnica"],
    weaknesses: ["Altamente exigentes", "Dificuldade em delegar flexibilidade", "Risco de rigidez sob pressão"],
    environments: ["Gestão de Projetos", "Operações Complexas", "Liderança Administrativa", "Direção Técnica"]
  },
  "C + I": {
    name: "Comunicador Criativo",
    title: "Inspirador Dinâmico",
    description: "A fusão perfeita da facilidade de comunicação e espírito de equipe com a criatividade visionária. Conseguem inspirar pessoas a seguirem ideias inovadoras, têm excelente empatia e trazem um dinamismo contagiante para o grupo.",
    strengths: ["Criatividade brilhante", "Inspirar e motivar pessoas", "Fácil relacionamento", "Carisma natural"],
    weaknesses: ["Dificuldade em manter o foco em tarefas repetitivas", "Falta de organização prática", "Sensibilidade às críticas"],
    environments: ["Marketing", "Relações Públicas", "Design de Experiência", "Recrutamento", "Comunicação Corporativa"]
  },
  "O + C": {
    name: "Organizador Relacional",
    title: "Diplomata Estruturado",
    description: "Equilibra a empatia e sociabilidade do comunicador com a metodologia e planejamento do organizador. São ótimos mediadores, buscam a harmonia de processos e pessoas, valorizam a cooperação estruturada e a estabilidade coletiva.",
    strengths: ["Diplomacia", "Cooperação", "Processos organizados com foco humano", "Estabilidade nas relações"],
    weaknesses: ["Resistência a decisões individuais drásticas", "Evita conflitos mesmo quando necessários", "Lentidão para reagir a crises abruptas"],
    environments: ["Suporte ao Cliente", "Gestão de Recursos Humanos", "Qualidade e Atendimento", "Coordenação de Equipes"]
  },
  "A + I": {
    name: "Visionário Executor",
    title: "Empreendedor Ágil",
    description: "Combina a velocidade de ação do executor com a inovação fora da caixa do idealista. Tomam atitudes rápidas sobre novas ideias e oportunidades. São movidos por desafios e altamente competitivos, sempre desenhando o futuro do negócio.",
    strengths: ["Inovação pragmática", "Rapidez para agir sobre novas ideias", "Foco em resultado e inovação", "Ambição saudável"],
    weaknesses: ["Impaciência com processos formais", "Tendência a pular etapas de validação", "Mudanças constantes"],
    environments: ["Desenvolvimento de Negócios (BD)", "Startups", "Vendas Estratégicas", "Gestão de Inovação"]
  }
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

export interface MbtiQuestion {
  id: number;
  text: string;
  optionA: { text: string; dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' };
  optionB: { text: string; dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' };
}

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  { id: 1, text: "Numa festa você:", optionA: { text: "Interage com muitos, incluindo estranhos", dimension: 'E' }, optionB: { text: "Interage com poucos, apenas conhecidos", dimension: 'I' } },
  { id: 2, text: "Você é mais:", optionA: { text: "Realista", dimension: 'S' }, optionB: { text: "Filosófico", dimension: 'N' } },
  { id: 3, text: "Você se interessa mais por:", optionA: { text: "Fatos", dimension: 'S' }, optionB: { text: "Semelhanças / comparações", dimension: 'N' } },
  { id: 4, text: "Normalmente você é:", optionA: { text: "Justo", dimension: 'T' }, optionB: { text: "Sensível / interessado", dimension: 'F' } },
  { id: 5, text: "Você normalmente:", optionA: { text: "Decide mais pela lógica", dimension: 'T' }, optionB: { text: "Decide mais pelos sentimentos", dimension: 'F' } },
  { id: 6, text: "Você prefere:", optionA: { text: "Planejamento", dimension: 'J' }, optionB: { text: "Espontaneidade", dimension: 'P' } },
  { id: 7, text: "Você normalmente:", optionA: { text: "Age rapidamente", dimension: 'E' }, optionB: { text: "Pensa antes de agir", dimension: 'I' } },
  { id: 8, text: "Você valoriza mais:", optionA: { text: "Experiência", dimension: 'S' }, optionB: { text: "Imaginação", dimension: 'N' } },
  { id: 9, text: "Você prefere pessoas:", optionA: { text: "Objetivas", dimension: 'T' }, optionB: { text: "Emocionais", dimension: 'F' } },
  { id: 10, text: "Você prefere:", optionA: { text: "Organização", dimension: 'J' }, optionB: { text: "Flexibilidade", dimension: 'P' } },
  { id: 11, text: "Você costuma:", optionA: { text: "Falar mais", dimension: 'E' }, optionB: { text: "Ouvir mais", dimension: 'I' } },
  { id: 12, text: "Você confia mais em:", optionA: { text: "Experiência concreta", dimension: 'S' }, optionB: { text: "Inspiração", dimension: 'N' } },
  { id: 13, text: "Você valoriza mais:", optionA: { text: "Justiça", dimension: 'T' }, optionB: { text: "Compaixão", dimension: 'F' } },
  { id: 14, text: "Você se incomoda mais em ter coisas:", optionA: { text: "Incompletas", dimension: 'J' }, optionB: { text: "Completas", dimension: 'P' } },
  { id: 15, text: "Em seus grupos sociais você:", optionA: { text: "Mantém-se atualizado", dimension: 'E' }, optionB: { text: "Fica desatualizado", dimension: 'I' } },
  { id: 16, text: "Normalmente você se interessa mais por:", optionA: { text: "Detalhes", dimension: 'S' }, optionB: { text: "Conceitos", dimension: 'N' } },
  { id: 17, text: "Você prefere escritores que:", optionA: { text: "Vão direto ao assunto", dimension: 'S' }, optionB: { text: "Usam muitas analogias", dimension: 'N' } },
  { id: 18, text: "Naturalmente você é mais:", optionA: { text: "Imparcial", dimension: 'T' }, optionB: { text: "Compassivo", dimension: 'F' } },
  { id: 19, text: "Num julgamento é mais comum você ser:", optionA: { text: "Impessoal", dimension: 'T' }, optionB: { text: "Sentimental", dimension: 'F' } },
  { id: 20, text: "Você normalmente:", optionA: { text: "Define as coisas", dimension: 'J' }, optionB: { text: "Mantém-se aberto às opções", dimension: 'P' } },
  { id: 21, text: "Você normalmente prefere:", optionA: { text: "Rapidamente concordar com um horário", dimension: 'J' }, optionB: { text: "Relutar em aceitar um horário", dimension: 'P' } },
  { id: 22, text: "Ao ligar para alguém você:", optionA: { text: "Apenas começa falando", dimension: 'E' }, optionB: { text: "Prepara o que irá dizer", dimension: 'I' } },
  { id: 23, text: "Fatos:", optionA: { text: "Falam por eles mesmos", dimension: 'S' }, optionB: { text: "Precisam ser interpretados", dimension: 'N' } },
  { id: 24, text: "Você prefere trabalhar com:", optionA: { text: "Informações práticas", dimension: 'S' }, optionB: { text: "Ideias abstratas", dimension: 'N' } },
  { id: 25, text: "Você normalmente é:", optionA: { text: "Mais lógico", dimension: 'T' }, optionB: { text: "Mais emocional", dimension: 'F' } },
  { id: 26, text: "Você prefere:", optionA: { text: "Estrutura", dimension: 'J' }, optionB: { text: "Liberdade", dimension: 'P' } },
  { id: 27, text: "Você normalmente:", optionA: { text: "Conversa facilmente", dimension: 'E' }, optionB: { text: "É mais reservado", dimension: 'I' } },
  { id: 28, text: "Você prefere:", optionA: { text: "O real", dimension: 'S' }, optionB: { text: "O possível", dimension: 'N' } },
  { id: 29, text: "Você valoriza:", optionA: { text: "Coerência", dimension: 'T' }, optionB: { text: "Harmonia", dimension: 'F' } },
  { id: 30, text: "Você trabalha melhor:", optionA: { text: "Com rotina", dimension: 'J' }, optionB: { text: "Com liberdade", dimension: 'P' } },
  { id: 31, text: "Em grupos você:", optionA: { text: "Participa rapidamente", dimension: 'E' }, optionB: { text: "Observa antes", dimension: 'I' } },
  { id: 32, text: "Você confia mais:", optionA: { text: "Nos sentidos", dimension: 'S' }, optionB: { text: "Na intuição", dimension: 'N' } },
  { id: 33, text: "Você tende a:", optionA: { text: "Criticar", dimension: 'T' }, optionB: { text: "Apoiar", dimension: 'F' } },
  { id: 34, text: "Você é mais tendencioso a manter as coisas:", optionA: { text: "Bem organizadas", dimension: 'J' }, optionB: { text: "Sem terminar", dimension: 'P' } },
  { id: 35, text: "Você dá mais valor ao que é:", optionA: { text: "Definitivo", dimension: 'J' }, optionB: { text: "Mutável", dimension: 'P' } },
  { id: 36, text: "Novas interações com outros:", optionA: { text: "Estimulam e incentivam", dimension: 'E' }, optionB: { text: "Consomem suas energias", dimension: 'I' } },
  { id: 37, text: "Frequentemente você é:", optionA: { text: "Uma pessoa prática", dimension: 'S' }, optionB: { text: "Uma pessoa abstrata", dimension: 'N' } },
  { id: 38, text: "Qual dos itens se identifica mais com você:", optionA: { text: "Percepção exata e sem enganos", dimension: 'S' }, optionB: { text: "Formação de conceitos", dimension: 'N' } },
  { id: 39, text: "O que é mais realizador:", optionA: { text: "Discutir profundamente", dimension: 'T' }, optionB: { text: "Chegar a acordo", dimension: 'F' } },
  { id: 40, text: "O que te conduz mais:", optionA: { text: "Sua cabeça", dimension: 'T' }, optionB: { text: "Seu coração", dimension: 'F' } },
  { id: 41, text: "Você se sente mais confortável com um trabalho:", optionA: { text: "Contratado", dimension: 'J' }, optionB: { text: "Feito de forma casual", dimension: 'P' } },
  { id: 42, text: "Você prefere que as coisas sejam:", optionA: { text: "Certas e ordenadas", dimension: 'J' }, optionB: { text: "Opcionais", dimension: 'P' } },
  { id: 43, text: "Você prefere:", optionA: { text: " Muitos amigos com breves contatos", dimension: 'E' }, optionB: { text: "Poucos amigos com contato longo", dimension: 'I' } },
  { id: 44, text: "Você é mais atraído a:", optionA: { text: "Informações substanciais", dimension: 'S' }, optionB: { text: "Suposições confiáveis", dimension: 'N' } },
  { id: 45, text: "Você normalmente:", optionA: { text: "Analisa logicamente", dimension: 'T' }, optionB: { text: "Analisa emocionalmente", dimension: 'F' } },
  { id: 46, text: "Você prefere ambientes:", optionA: { text: "Organizados", dimension: 'J' }, optionB: { text: "Flexíveis", dimension: 'P' } },
  { id: 47, text: "Você normalmente:", optionA: { text: "Externaliza pensamentos", dimension: 'E' }, optionB: { text: "Guarda pensamentos", dimension: 'I' } },
  { id: 48, text: "Você gosta mais de:", optionA: { text: "Experiência prática", dimension: 'S' }, optionB: { text: "Ideias novas", dimension: 'N' } },
  { id: 49, text: "Você valoriza mais:", optionA: { text: "Verdade", dimension: 'T' }, optionB: { text: "Relacionamentos", dimension: 'F' } },
  { id: 50, text: "Você prefere:", optionA: { text: "Planejamento antecipado", dimension: 'J' }, optionB: { text: "Improvisação", dimension: 'P' } },
  { id: 51, text: "Você normalmente:", optionA: { text: "Inicia conversas", dimension: 'E' }, optionB: { text: "Espera abordarem você", dimension: 'I' } },
  { id: 52, text: "Você presta mais atenção em:", optionA: { text: "Detalhes", dimension: 'S' }, optionB: { text: "Significados", dimension: 'N' } },
  { id: 53, text: "Você é mais:", optionA: { text: "Objetivo", dimension: 'T' }, optionB: { text: "Sensível", dimension: 'F' } },
  { id: 54, text: "Você prefere:", optionA: { text: "Controle", dimension: 'J' }, optionB: { text: "Liberdade", dimension: 'P' } },
  { id: 55, text: "Você normalmente:", optionA: { text: "É expansivo", dimension: 'E' }, optionB: { text: "É reservado", dimension: 'I' } },
  { id: 56, text: "Você prefere:", optionA: { text: "O que existe", dimension: 'S' }, optionB: { text: "O que pode existir", dimension: 'N' } },
  { id: 57, text: "Você valoriza:", optionA: { text: "Eficiência", dimension: 'T' }, optionB: { text: "Empatia", dimension: 'F' } },
  { id: 58, text: "Você prefere:", optionA: { text: "Conclusões", dimension: 'J' }, optionB: { text: "Possibilidades", dimension: 'P' } },
  { id: 59, text: "Você normalmente:", optionA: { text: "Compartilha rapidamente", dimension: 'E' }, optionB: { text: "Guarda para si", dimension: 'I' } },
  { id: 60, text: "Você gosta mais de:", optionA: { text: "Fatos reais", dimension: 'S' }, optionB: { text: "Ideias inovadoras", dimension: 'N' } },
  { id: 61, text: "Você considera a si mesmo uma pessoa:", optionA: { text: "Capaz de pensar claramente", dimension: 'T' }, optionB: { text: "De boa intenção", dimension: 'F' } },
  { id: 62, text: "Você é mais tendencioso a:", optionA: { text: "Organizar atividades", dimension: 'J' }, optionB: { text: "Pegar as coisas quando vêm", dimension: 'P' } },
  { id: 63, text: "Você é uma pessoa mais:", optionA: { text: "Sistemática", dimension: 'J' }, optionB: { text: "Imprevisível", dimension: 'P' } },
  { id: 64, text: "Você é mais inclinado a ser:", optionA: { text: "De fácil acesso", dimension: 'E' }, optionB: { text: "Reservado", dimension: 'I' } }
];

export interface MbtiProfile {
  nome: string;
  titulo: string;
  categoria: 'Analítico' | 'Diplomata' | 'Guardião' | 'Explorador';
  desc: string;
  caracteristicas: string[];
  pontosFortes: string[];
  pontosAtencao: string[];
  classColor: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
}

export const MBTI_PROFILES: Record<string, MbtiProfile> = {
  ISTJ: {
    nome: "ISTJ",
    titulo: "Organizador responsável",
    categoria: "Guardião",
    desc: "Pessoas práticas e orientadas a fatos, cuja confiabilidade não pode ser questionada. Focam na estabilidade, dever e ordem.",
    caracteristicas: ["Sistemático", "Organizado", "Prático", "Confiável", "Focado em regras"],
    pontosFortes: ["Foco em detalhes", "Cumprimento de prazos", "Lealdade", "Lógica clara"],
    pontosAtencao: ["Dificuldade com mudanças", "Pode parecer frio ou rígido demais", "Dificuldade em delegar"],
    classColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-700"
  },
  ISFJ: {
    nome: "ISFJ",
    titulo: "Protetor cuidadoso",
    categoria: "Guardião",
    desc: "Protetores dedicados e acolhedores, sempre prontos para defender as pessoas de quem gostam. Valorizam a harmonia social.",
    caracteristicas: ["Empático", "Protetor", "Responsável", "Pacífico", "Tradicional"],
    pontosFortes: ["Apoio à equipe", "Grande senso de dever", "Excelente atenção aos outros", "Praticidade"],
    pontosAtencao: ["Sobrecarga por não saber dizer não", "Relutância a inovações", "Guarda sentimentos para si"],
    classColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-700"
  },
  INFJ: {
    nome: "INFJ",
    titulo: "Conselheiro idealista",
    categoria: "Diplomata",
    desc: "Idealistas místicos e quietos, porém inspiradores. Têm uma visão profunda sobre as relações humanas e o potencial das pessoas.",
    caracteristicas: ["Visionário", "Intuitivo", "Altruísta", "Profundo", "Determinado"],
    pontosFortes: ["Pensamento criativo", "Forte empatia", "Comunicação inspiradora", "Busca por propósito"],
    pontosAtencao: ["Perfeccionismo extremo", "Tende a se desgastar emocionalmente", "Dificuldade em aceitar críticas"],
    classColor: "text-indigo-700 bg-indigo-50 border-indigo-100",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-500",
    textColor: "text-indigo-700"
  },
  INTJ: {
    nome: "INTJ",
    titulo: "Estrategista visionário",
    categoria: "Analítico",
    desc: "Pensadores criativos e estratégicos, com um plano para tudo. Gostam de lógica, eficiência e soluções complexas.",
    caracteristicas: ["Estratégico", "Independente", "Lógico", "Racional", "Inovador"],
    pontosFortes: ["Alta capacidade de análise", "Planejamento de longo prazo", "Foco em melhoria contínua", "Determinação"],
    pontosAtencao: ["Pode parecer impessoal", "Exigência excessiva com os outros", "Impaciência com ineficiências"],
    classColor: "text-rose-700 bg-rose-50 border-rose-100",
    borderColor: "border-rose-200",
    bgColor: "bg-rose-500",
    textColor: "text-rose-700"
  },
  ISTP: {
    nome: "ISTP",
    titulo: "Executor lógico",
    categoria: "Explorador",
    desc: "Experimentadores ousados e práticos, mestres em todos os tipos de ferramentas. Abordam a vida com racionalidade e curiosidade.",
    caracteristicas: ["Prático", "Adaptável", "Racional", "Espontâneo", "Resoluto"],
    pontosFortes: ["Excelente sob pressão", "Ótima solução prática de problemas", "Flexibilidade", "Otimismo natural"],
    pontosAtencao: ["Dificuldade em seguir rotinas rígidas", "Reservado demais", "Pode tomar riscos excessivos"],
    classColor: "text-amber-700 bg-amber-50 border-amber-100",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700"
  },
  ISFP: {
    nome: "ISFP",
    titulo: "Artista sensível",
    categoria: "Explorador",
    desc: "Artistas flexíveis e charmosos, sempre prontos para explorar e experimentar algo novo. Valorizam a harmonia e a expressão pessoal.",
    caracteristicas: ["Sensível", "Criativo", "Harmônico", "Estético", "Reservado"],
    pontosFortes: ["Sensibilidade com outros", "Criatividade prática", "Fácil convivência", "Espontaneidade"],
    pontosAtencao: ["Dificuldade com planos futuros", "Tende a se estressar facilmente", "Muito independente da estrutura"],
    classColor: "text-amber-700 bg-amber-50 border-amber-100",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700"
  },
  INFP: {
    nome: "INFP",
    titulo: "Mediador idealista",
    categoria: "Diplomata",
    desc: "Pessoas poéticas, bondosas e altruístas, sempre ansiosas para ajudar uma boa causa. Buscam viver alinhadas com seus valores.",
    caracteristicas: ["Idealista", "Compassivo", "Criativo", "Fiel a valores", "Acolhedor"],
    pontosFortes: ["Forte empatia e escuta", "Criatividade literária/conceitual", "Busca de soluções ganha-ganha", "Dedicação"],
    pontosAtencao: ["Pode ser excessivamente idealista", "Dificuldade em lidar com dados puramente lógicos", "Guarda críticas e sofre internamente"],
    classColor: "text-indigo-700 bg-indigo-50 border-indigo-100",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-500",
    textColor: "text-indigo-700"
  },
  INTP: {
    nome: "INTP",
    titulo: "Pensador analítico",
    categoria: "Analítico",
    desc: "Criadores inovadores com uma sede insaciável por conhecimento. Adoram analisar teorias, conceitos e encontrar padrões ocultos.",
    caracteristicas: ["Analítico", "Teórico", "Curioso", "Objetivo", "Independente"],
    pontosFortes: ["Pensamento inovador", "Grande capacidade conceitual", "Imparcialidade", "Resolução de problemas complexos"],
    pontosAtencao: ["Tende a pensar demais e não agir", "Dificuldade em expressar emoções", "Impaciência com tarefas repetitivas"],
    classColor: "text-rose-700 bg-rose-50 border-rose-100",
    borderColor: "border-rose-200",
    bgColor: "bg-rose-500",
    textColor: "text-rose-700"
  },
  ESTP: {
    nome: "ESTP",
    titulo: "Executor ousado",
    categoria: "Explorador",
    desc: "Pessoas inteligentes, enérgicas e muito perceptivas, que realmente gostam de viver no limite e agir com dinamismo.",
    caracteristicas: ["Energético", "Ousado", "Perspicaz", "Prático", "Divertido"],
    pontosFortes: ["Ação rápida e focada", "Networking excelente", "Grande adaptabilidade", "Resolução de crises imediatas"],
    pontosAtencao: ["Impaciência com teoria", "Pode agir sem planejar consequências", "Dificuldade em seguir regras estritas"],
    classColor: "text-amber-700 bg-amber-50 border-amber-100",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700"
  },
  ESFP: {
    nome: "ESFP",
    titulo: "Animador sociável",
    categoria: "Explorador",
    desc: "Animadores espontâneos, enérgicos e entusiasmados — a vida nunca é entediante perto deles. Adoram a interação social.",
    caracteristicas: ["Sociável", "Espontâneo", "Alegre", "Expressivo", "Colaborativo"],
    pontosFortes: ["Facilidade em engajar pessoas", "Atitude positiva constante", "Excelente senso estético", "Praticidade cotidiana"],
    pontosAtencao: ["Falta de planejamento de longo prazo", "Dificuldade em lidar com críticas", "Tende a evitar conflitos sérios"],
    classColor: "text-amber-700 bg-amber-50 border-amber-100",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700"
  },
  ENFP: {
    nome: "ENFP",
    titulo: "Comunicador criativo",
    categoria: "Diplomata",
    desc: "Espíritos livres, criativos, sociáveis e entusiasmados, que sempre encontram um motivo para sorrir e engajar sua equipe.",
    caracteristicas: ["Entusiasta", "Criativo", "Sociável", "Comunicativo", "Energético"],
    pontosFortes: ["Liderança inspiradora", "Pensamento inovador e fora da caixa", "Excelente em motivar equipes", "Carismático"],
    pontosAtencao: ["Dificuldade em manter o foco em rotinas", "Pode procrastinar na finalização de tarefas", "Necessidade constante de aprovação"],
    classColor: "text-indigo-700 bg-indigo-50 border-indigo-100",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-500",
    textColor: "text-indigo-700"
  },
  ENTP: {
    nome: "ENTP",
    titulo: "Inovador questionador",
    categoria: "Analítico",
    desc: "Pensadores espertos e curiosos que não conseguem resistir a um desafio intelectual. São mestres em debate e ideias disruptivas.",
    caracteristicas: ["Disruptivo", "Debatedor", "Inovador", "Curioso", "Adaptável"],
    pontosFortes: ["Geração de ideias novas", "Grande agilidade mental", "Ótima argumentação", "Sem medo de arriscar"],
    pontosAtencao: ["Pode parecer argumentativo ou insensível", "Dificuldade em seguir regras corporativas", "Deixa projetos inacabados"],
    classColor: "text-rose-700 bg-rose-50 border-rose-100",
    borderColor: "border-rose-200",
    bgColor: "bg-rose-500",
    textColor: "text-rose-700"
  },
  ESTJ: {
    nome: "ESTJ",
    titulo: "Administrador eficiente",
    categoria: "Guardião",
    desc: "Administradores excelentes, inigualáveis no gerenciamento de coisas — ou pessoas. Focam na ordem, regras e objetivos claros.",
    caracteristicas: ["Eficiente", "Sistemático", "Organizado", "Direto", "Líder natural"],
    pontosFortes: ["Organização de projetos e tarefas", "Clareza na direção e liderança", "Confiabilidade total", "Dedicação ao dever"],
    pontosAtencao: ["Pode parecer inflexível com mudanças", "Impaciência com ideias não comprovadas", "Dificuldade em expressar sensibilidade"],
    classColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-700"
  },
  ESFJ: {
    nome: "ESFJ",
    titulo: "Cooperador social",
    categoria: "Guardião",
    desc: "Pessoas extraordinariamente atenciosas, sociais e populares, sempre prontas a ajudar e apoiar a comunidade ou equipe de trabalho.",
    caracteristicas: ["Cooperativo", "Acolhedor", "Social", "Leal", "Organizado"],
    pontosFortes: ["Excelente trabalho em equipe", "Forte senso de responsabilidade", "Capacidade de criar harmonia", "Atenção ao bem-estar do time"],
    pontosAtencao: ["Preocupação excessiva com a imagem social", "Dificuldade com críticas construtivas", "Resistência a novas formas de trabalho"],
    classColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-700"
  },
  ENFJ: {
    nome: "ENFJ",
    titulo: "Líder inspirador",
    categoria: "Diplomata",
    desc: "Líderes carismáticos e inspiradores, capazes de hipnotizar seus ouvintes. Focam no desenvolvimento das pessoas e na colaboração.",
    caracteristicas: ["Carismático", "Inspirador", "Empático", "Altruísta", "Facilitador"],
    pontosFortes: ["Habilidade de motivar e liderar", "Excelente comunicação interpessoal", "Foco no desenvolvimento do time", "Valores elevados"],
    pontosAtencao: ["Tende a assumir problemas alheios", "Pode ser muito protetor ou idealista", "Dificuldade em tomar decisões duras com pessoas"],
    classColor: "text-indigo-700 bg-indigo-50 border-indigo-100",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-500",
    textColor: "text-indigo-700"
  },
  ENTJ: {
    nome: "ENTJ",
    titulo: "Comandante estratégico",
    categoria: "Analítico",
    desc: "Líderes ousados, criativos e enérgicos, sempre encontrando um caminho — ou criando um. São impulsionados pela eficiência.",
    caracteristicas: ["Líder forte", "Estratégico", "Decidido", "Objetivo", "Focado no futuro"],
    pontosFortes: ["Excelente liderança estratégica", "Forte tomada de decisões", "Foco em eficiência e resultados", "Superação de obstáculos"],
    pontosAtencao: ["Pode parecer dominador ou impaciente", "Dificuldade em processar aspectos emocionais", "Pode atropelar processos de terceiros"],
    classColor: "text-rose-700 bg-rose-50 border-rose-100",
    borderColor: "border-rose-200",
    bgColor: "bg-rose-500",
    textColor: "text-rose-700"
  }
};

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  course: string;
  status: 'Incompleto' | 'Completo' | 'Cursando';
  gradYear: string;
}

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  gender: string;
  summary: string;
  isPcd: boolean;
  cid: string;
  isFirstJob: boolean;
  birthDate: string;
  city: string;
  salary: string;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
  profilePic?: string;
}

const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const DF_REGIONS = [
  'Brasília (Plano Piloto)', 'Águas Claras', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Guará', 'Gama',
  'Vicente Pires', 'Sobradinho', 'Sobradinho II', 'Planaltina', 'Santa Maria', 'São Sebastião',
  'Recanto das Emas', 'Riacho Fundo', 'Riacho Fundo II', 'Núcleo Bandeirante', 'Cruzeiro',
  'Lago Norte', 'Lago Sul', 'Jardim Botânico', 'Itapoã', 'Paranoá', 'Park Way', 'SCIA/Estrutural',
  'SIA', 'Varjão', 'Brazlândia', 'Fercal', 'Arniqueira', 'Sol Nascente/Pôr do Sol',
  // Cidades do Entorno (RIDE)
  'Valparaíso de Goiás', 'Luziânia', 'Novo Gama', 'Cidade Ocidental', 'Águas Lindas de Goiás',
  'Santo Antônio do Descoberto', 'Formosa', 'Planaltina de Goiás', 'Cristalina', 'Padre Bernardo'
].sort();

const GENDER_OPTIONS = [
  'Masculino',
  'Feminino',
  'Transgênero',
  'Transexual',
  'Não-binário',
  'Intersexual',
  'Outro',
  'Prefiro não informar'
];

// Helper for cropping
const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string | null> => {
  const image = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
};

function getExperienceDuration(startDate: string, endDate: string | null, current: boolean): string {
  if (!startDate) return '';
  const start = new Date(startDate);
  const end = current || !endDate ? new Date() : new Date(endDate);
  
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  months += 1;
  if (months >= 12) {
    years += Math.floor(months / 12);
    months = months % 12;
  }

  const yearsStr = years > 0 ? `${years} ano${years > 1 ? 's' : ''}` : '';
  const monthsStr = months > 0 ? `${months} mê${months > 1 ? 'ses' : 's'}` : '';
  
  if (yearsStr && monthsStr) {
    return `${yearsStr} e ${monthsStr}`;
  }
  return yearsStr || monthsStr;
}

interface SidebarItemProps {
  icon: any;
  label: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarExpanded: boolean;
}

const SidebarItem = ({ icon: Icon, label, activeTab, setActiveTab, isSidebarExpanded }: SidebarItemProps) => (
  <div className="relative group/item w-full flex justify-center h-12 lg:h-12">
    <button
      onClick={() => setActiveTab(label)}
      className={`w-full ${
        isSidebarExpanded 
          ? 'lg:w-full lg:h-12 lg:px-4 lg:justify-start lg:space-x-3' 
          : 'lg:w-12 lg:h-12 lg:px-0 lg:justify-center lg:space-x-0'
      } flex items-center justify-start space-x-3 py-3.5 rounded-2xl transition-all duration-300 bg-transparent text-white/60 hover:text-white hover:bg-white/10`}
      style={{
        backgroundColor: activeTab === label ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        color: activeTab === label ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
        boxShadow: activeTab === label ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
      }}
    >
      <Icon size={18} className={activeTab === label ? 'text-white' : 'text-white/50'} />
      <span className={`font-bold text-[11px] uppercase tracking-widest whitespace-nowrap ${isSidebarExpanded ? 'lg:inline-block' : 'lg:hidden'}`}>{label}</span>
    </button>

    {/* Balão/Tooltip flutuante de sobreposição perfeita no desktop com animação slide-in e leve transparência */}
    <div 
      onClick={() => setActiveTab(label)}
      className={`absolute left-0 top-0 h-12 ${isSidebarExpanded ? 'hidden' : 'hidden lg:flex'} items-center justify-start bg-[#533af6]/75 backdrop-blur-[6px] text-white rounded-2xl shadow-[0_10px_25px_rgba(83,58,246,0.25)] cursor-pointer pointer-events-none opacity-0 translate-x-[-24px] group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[110] w-auto whitespace-nowrap pl-[15px] pr-6 gap-3`}
    >
      <Icon size={18} className="text-white" />
      <span className="font-black text-[10px] uppercase tracking-widest text-white leading-none mt-0.5">{label}</span>
    </div>
  </div>
);

export default function CandidateDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('Meu Currículo');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Alert / Confirm Dialog states
  const [customDialog, setCustomDialog] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm' | 'success';
    title?: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: 'alert',
    message: ''
  });

  const showCustomAlert = (message: string, title: string = 'Aviso') => {
    setCustomDialog({
      isOpen: true,
      type: 'alert',
      title,
      message
    });
  };

  const showCustomSuccess = (message: string, title: string = 'Sucesso') => {
    setCustomDialog({
      isOpen: true,
      type: 'success',
      title,
      message
    });
  };

  const showCustomConfirm = (message: string, onConfirm: () => void, onCancel?: () => void, title: string = 'Confirmação') => {
    setCustomDialog({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        setCustomDialog(prev => ({ ...prev, isOpen: false }));
        onConfirm();
      },
      onCancel: () => {
        setCustomDialog(prev => ({ ...prev, isOpen: false }));
        if (onCancel) onCancel();
      }
    });
  };
  const [resumeData, setResumeData] = useState<ResumeData>({
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
  });

  const [originalResumeData, setOriginalResumeData] = useState<ResumeData | null>(null);
  const [isResumeDirty, setIsResumeDirty] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata;
        const userEmail = session.user.email;

        // Criar o objeto de perfil inicial combinando metadados do login
        let initialProfile: ResumeData = {
          fullName: (metadata?.full_name || '').toUpperCase(),
          email: userEmail || '',
          phone: metadata?.whatsapp || '',
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
        };

        // Buscar do banco de dados (tabela talents)
        if (userEmail) {
          try {
            const { data, error } = await supabase
              .from('talents')
              .select('*')
              .eq('email', userEmail)
              .maybeSingle();

            if (data && !error) {
              initialProfile = {
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
                isFirstJob: data.first_job ?? initialProfile.isFirstJob ?? false
              };
            }
          } catch (err) {
            console.error('Error fetching talent profile:', err);
          }
        }

        setResumeData(initialProfile);
        setOriginalResumeData(JSON.parse(JSON.stringify(initialProfile)));
      }
    }
    loadUserData();
  }, []);

  // Monitorar se o currículo atual difere do original (dirty state)
  useEffect(() => {
    if (originalResumeData && resumeData) {
      const isChanged = JSON.stringify(originalResumeData) !== JSON.stringify(resumeData);
      setIsResumeDirty(isChanged);
    }
  }, [resumeData, originalResumeData]);

  // Alerta nativo ao tentar fechar/recarregar a aba do navegador com alterações não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isResumeDirty) {
        e.preventDefault();
        e.returnValue = 'Você possui alterações não salvas. Tem certeza que deseja sair?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isResumeDirty]);

  const [isParsing, setIsParsing] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempExp, setTempExp] = useState<Experience | null>(null);

  useEffect(() => {
    if (showExpModal) {
      if (editingExp) {
        setTempExp({ ...editingExp });
      } else {
        setTempExp({
          id: crypto.randomUUID(),
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        });
      }
    } else {
      setTempExp(null);
    }
  }, [showExpModal, editingExp]);

  useEffect(() => {
    if (resumeData.state) {
      if (resumeData.state === 'DF') {
        setCities(DF_REGIONS);
        setIsLoadingCities(false);
        return;
      }
      setIsLoadingCities(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${resumeData.state}/municipios`)
        .then(res => res.json())
        .then(data => {
          setCities(data.map((city: any) => city.nome).sort());
          setIsLoadingCities(false);
        })
        .catch(err => {
          console.error('Error fetching cities:', err);
          setIsLoadingCities(false);
        });
    } else {
      setCities([]);
    }
  }, [resumeData.state]);

  // Cropping State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const resumePrintRef = useRef<HTMLDivElement>(null);

  const calculateDuration = (start: string, end: string, current: boolean) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = current ? new Date() : new Date(end);
    
    if (isNaN(startDate.getTime()) || (!current && isNaN(endDate.getTime()))) return '';

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    const yearStr = years > 0 ? `${years} ano${years > 1 ? 's' : ''}` : '';
    const monthStr = months > 0 ? `${months} mê${months > 1 ? 'ses' : 's'}` : '';

    return [yearStr, monthStr].filter(Boolean).join(' e ');
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedImage) {
        setResumeData(prev => ({ ...prev, profilePic: croppedImage }));
      }
      setImageToCrop(null);
    }
  };

  const handleProfilePicSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIParse = async (file: File) => {
    setIsParsing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const prompt = `Extraia os dados deste currículo para o formato JSON solicitado. 
      Certifique-se de que o resumo tenha pelo menos 300 caracteres.
      Traduza status de educação para: 'Completo', 'Incompleto' ou 'Cursando'.
      Extraia apenas o telefone, estado (sigla UF), cidade, nome completo, resumo, habilidades (lista de strings), experiências e formações.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ inlineData: { data: base64Data, mimeType: file.type } }, { text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              phone: { type: Type.STRING },
              state: { type: Type.STRING },
              city: { type: Type.STRING },
              summary: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experiences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    current: { type: Type.BOOLEAN },
                    description: { type: Type.STRING }
                  }
                }
              },
              educations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    course: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['Incompleto', 'Completo', 'Cursando'] },
                    gradYear: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      const parsed = JSON.parse(response.text);
      setResumeData(prev => ({
        ...prev,
        fullName: (parsed.fullName || prev.fullName).toUpperCase(),
        phone: parsed.phone || prev.phone,
        state: BRAZIL_STATES.includes(parsed.state) ? parsed.state : prev.state,
        city: parsed.city || prev.city,
        summary: parsed.summary || prev.summary,
        skills: parsed.skills || prev.skills,
        experiences: (parsed.experiences || []).map((exp: any) => ({ ...exp, id: crypto.randomUUID() })),
        educations: (parsed.educations || []).map((edu: any) => ({ ...edu, id: crypto.randomUUID() })),
        isFirstJob: (parsed.experiences || []).length === 0
      }));
    } catch (error) {
      console.error('Error parsing:', error);
    } finally {
      setIsParsing(false);
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToSupabase = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setErrorMessage('Configuração do Supabase ausente. Contate o administrador.');
      return;
    }

    // Validation
    const errors = [];
    if (!resumeData.fullName) errors.push('Nome Completo');
    if (!resumeData.email) errors.push('E-mail');
    if (!resumeData.phone) errors.push('WhatsApp / Telefone');
    if (!resumeData.salary) errors.push('Pretensão Salarial');
    if (!resumeData.state) errors.push('Estado');
    if (!resumeData.city) errors.push('Cidade');
    if (!resumeData.gender) errors.push('Gênero');
    if (!resumeData.birthDate) errors.push('Data de Nascimento');
    if (!resumeData.summary || resumeData.summary.length < 50) errors.push('Resumo Profissional (mínimo 50 caracteres)');
    if (resumeData.skills.length === 0) errors.push('Pelo menos uma Habilidade');
    if (resumeData.educations.length === 0) errors.push('Pelo menos uma Formação Acadêmica');
    if (!resumeData.isFirstJob && resumeData.experiences.length === 0) {
      errors.push('Pelo menos uma Experiência Profissional (ou marque "Primeiro Emprego")');
    }

    if (errors.length > 0) {
      setErrorMessage('Por favor, preencha as informações obrigatórias: ' + errors.join(', '));
      setTimeout(() => setErrorMessage(null), 6000);
      return;
    }
    
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const talentToSave = {
        name: resumeData.fullName,
        email: resumeData.email,
        role: resumeData.experiences.length > 0 ? (resumeData.experiences[0].role || 'Candidato') : 'Candidato',
        phone: resumeData.phone,
        state: resumeData.state,
        city: resumeData.city,
        age: calculateAge(resumeData.birthDate) || 0,
        skills: resumeData.skills,
        experience: resumeData.experiences.length > 0 ? 'Experiente' : 'Iniciante', 
        education: resumeData.educations.length > 0 ? (resumeData.educations[0].status || 'N/A') : 'N/A',
        modality: 'Híbrido', 
        salary: resumeData.salary,
        first_job: resumeData.isFirstJob,
        summary: resumeData.summary,
        educations: resumeData.educations,
        experiences: resumeData.experiences,
        profile_pic: resumeData.profilePic,
        birth_date: resumeData.birthDate,
        gender: resumeData.gender,
        is_pcd: resumeData.isPcd,
        CID: resumeData.cid
      };

      const { error } = await supabase
        .from('talents')
        .upsert([talentToSave], { onConflict: 'email' });

      if (error) {
        console.error('Supabase Error:', error);
        setErrorMessage('Erro ao salvar no banco de dados: ' + error.message + ' (Código: ' + (error.code || 'N/A') + ')');
        return;
      }
      
      setOriginalResumeData(JSON.parse(JSON.stringify(resumeData)));
      setIsResumeDirty(false);
      showCustomSuccess('Seu currículo foi salvo com sucesso!\nSuas alterações foram enviadas para o banco de dados.', 'Salvo com sucesso');
    } catch (err: any) {
      console.error('Catch Error:', err);
      setErrorMessage('Erro inesperado: ' + (err.message || 'Erro de conexão.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!resumePrintRef.current) {
      console.error('Resume reference not found');
      return;
    }
    
    setIsExporting(true);
    try {
      const element = resumePrintRef.current;
      
      // Temporarily remove hidden styles for capture
      const originalStyle = element.getAttribute('style') || '';
      element.style.display = 'block';
      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '-9999';
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.background = 'white';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 210 * 3.78, // Approximately A4 width in px
        windowHeight: 297 * 3.78,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * { 
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: "Inter", system-ui, -apple-system, sans-serif !important;
            }
            /* Universal Fallback for anything that might use oklch/oklab */
            svg { fill: currentColor !important; }
            
            /* Remove all oklch/oklab references from CSS variables */
            :root {
              --primary-600: #7c3aed !important;
              --slate-900: #0f172a !important;
              --slate-600: #475569 !important;
              --slate-400: #94a3b8 !important;
            }

            .text-primary-600 { color: #7c3aed !important; }
            .bg-primary-600 { background-color: #7c3aed !important; }
            .bg-primary-50 { background-color: #f5f3ff !important; }
            .text-slate-900 { color: #0f172a !important; }
            .text-slate-800 { color: #1e293b !important; }
            .text-slate-500 { color: #64748b !important; }
            .text-slate-400 { color: #94a3b8 !important; }
            .bg-slate-50 { background-color: #f8fafc !important; }
            .bg-white { background-color: #ffffff !important; }
            .text-white { color: #ffffff !important; }
          `;
          clonedDoc.head.appendChild(style);

          // Forcefully remove any oklch from ANY style attribute in the clone
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            const computed = window.getComputedStyle(htmlEl);
            
            // Check major properties that might use oklch/oklab
            ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
              // @ts-ignore
              const val = computed[prop];
              if (val && (val.includes('oklch') || val.includes('oklab'))) {
                // @ts-ignore
                htmlEl.style[prop] = prop === 'backgroundColor' ? '#ffffff' : '#000000';
              }
            });

            // Specific cleanup for tailwind-generated inline styles
            const styleAttr = htmlEl.getAttribute('style') || '';
            if (styleAttr.includes('oklch') || styleAttr.includes('oklab')) {
              const newStyle = styleAttr.replace(/(oklch|oklab)\([^)]+\)/g, '#7c3aed');
              htmlEl.setAttribute('style', newStyle);
            }
          });
        }
      });

      // Restore original style
      element.setAttribute('style', originalStyle);

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Curriculo_${(resumeData.fullName || 'Candidato').replace(/\s+/g, '_').toUpperCase()}.pdf`);
      
      // If we are in the preview modal, maybe we don't want to close it automatically, 
      // but if we were called from the main dashboard, we just stay as we are.
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrorMessage('Houve um erro ao gerar o PDF. Por favor, tente novamente.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const [vacancies, setVacancies] = useState<any[]>([]);
  const [isFetchingVacancies, setIsFetchingVacancies] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<any | null>(null);

  // DISC Test States
  const [discTestState, setDiscTestState] = useState<'initial' | 'taking' | 'completed' | 'none'>('none');
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [discAnswers, setDiscAnswers] = useState<Array<{ D: number | null; I: number | null; S: number | null; C: number | null }>>(
    Array.from({ length: 25 }, () => ({ D: null, I: null, S: null, C: null }))
  );
  const [discResult, setDiscResult] = useState<{ D: number; I: number; S: number; C: number } | null>(null);
  const [activeTestApplicationId, setActiveTestApplicationId] = useState<string | null>(null);
  const [discErrorMessage, setDiscErrorMessage] = useState<string | null>(null);

  // Questionário de Experiência e Perfil States
  const [questionsState, setQuestionsState] = useState<'initial' | 'taking' | 'completed' | 'none'>('none');
  const [activeQuestionsApplicationId, setActiveQuestionsApplicationId] = useState<string | null>(null);
  const [questionsAnswers, setQuestionsAnswers] = useState<Record<number, string>>({});
  const [currentQuestionsCategoryIndex, setCurrentQuestionsCategoryIndex] = useState<number>(0);
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);
  const [questionsErrorMessage, setQuestionsErrorMessage] = useState<string | null>(null);
  const [selectedQuestionsResult, setSelectedQuestionsResult] = useState<Record<number, string> | null>(null);

  // MBTI Test States
  const [mbtiState, setMbtiState] = useState<'initial' | 'taking' | 'completed' | 'none'>('none');
  const [activeMbtiApplicationId, setActiveMbtiApplicationId] = useState<string | null>(null);
  const [currentMbtiStageIndex, setCurrentMbtiStageIndex] = useState<number>(0);
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<number, { a: number | null; b: number | null }>>({});
  const [mbtiResult, setMbtiResult] = useState<{ type: string; scores: Record<string, number> } | null>(null);
  const [isSavingMbti, setIsSavingMbti] = useState(false);
  const [mbtiErrorMessage, setMbtiErrorMessage] = useState<string | null>(null);
  const [selectedMbtiResult, setSelectedMbtiResult] = useState<any | null>(null);

  // Temperamentos Test States
  const [temperamentosState, setTemperamentosState] = useState<'initial' | 'taking' | 'completed' | 'none'>('none');
  const [activeTemperamentosApplicationId, setActiveTemperamentosApplicationId] = useState<string | null>(null);
  const [currentTemperamentosStageIndex, setCurrentTemperamentosStageIndex] = useState<number>(0);
  const [temperamentosAnswers, setTemperamentosAnswers] = useState<Record<number, string>>({});
  const [temperamentosResult, setTemperamentosResult] = useState<{ type: string; scores: Record<string, number> } | null>(null);
  const [isSavingTemperamentos, setIsSavingTemperamentos] = useState(false);
  const [temperamentosErrorMessage, setTemperamentosErrorMessage] = useState<string | null>(null);
  const [selectedTemperamentosResult, setSelectedTemperamentosResult] = useState<any | null>(null);

  // Questionário Customizado States
  const [customTestState, setCustomTestState] = useState<'initial' | 'taking' | 'completed' | 'none'>('none');
  const [activeCustomTestApplicationId, setActiveCustomTestApplicationId] = useState<string | null>(null);
  const [customTestQuestions, setCustomTestQuestions] = useState<any[]>([]);
  const [customTestAnswers, setCustomTestAnswers] = useState<Record<string, string>>({});
  const [isSavingCustomTest, setIsSavingCustomTest] = useState(false);
  const [customTestErrorMessage, setCustomTestErrorMessage] = useState<string | null>(null);
  const [selectedCustomTestResult, setSelectedCustomTestResult] = useState<Record<string, string> | null>(null);

  const cleanDescription = (desc: string) => {
    if (!desc) return '';
    return desc.split('===ETAPAS_JSON===')[0].trim();
  };

  const handleFinishDISCTest = async () => {
    const unanswered = discAnswers.findIndex(ans => ans.D === null || ans.I === null || ans.S === null || ans.C === null);
    if (unanswered !== -1) {
      setDiscErrorMessage(`Por favor, responda a todas as 25 questões. A questão ${unanswered + 1} está pendente.`);
      return;
    }

    setDiscErrorMessage(null);

    let D = 0, I = 0, S = 0, C = 0;

    discAnswers.forEach((ans) => {
      D += ans.D || 0;
      I += ans.I || 0;
      S += ans.S || 0;
      C += ans.C || 0;
    });

    const dPct = Math.min(100, Math.max(0, D));
    const iPct = Math.min(100, Math.max(0, I));
    const sPct = Math.min(100, Math.max(0, S));
    const cPct = Math.min(100, Math.max(0, C));

    const result = { D: dPct, I: iPct, S: sPct, C: cPct };
    setDiscResult(result);

    if (!import.meta.env.VITE_SUPABASE_URL || !activeTestApplicationId) {
      setDiscTestState('completed');
      return;
    }

    try {
      const app = myApplications.find(a => a.id === activeTestApplicationId);
      let phoneStr = '';
      if (app) {
        phoneStr = app.candidate_phone || '';
      }

      const parsedData = parseCandidatePhoneData(phoneStr);
      const discVal = `COMPLETED===${dPct},${iPct},${sPct},${cPct}===DATE===${new Date().toISOString()}`;

      const serializedDISC = serializeCandidatePhoneData(
        parsedData.phone,
        discVal,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: serializedDISC })
        .eq('id', activeTestApplicationId);

      if (error) throw error;

      setMyApplications(prev => prev.map(a => a.id === activeTestApplicationId ? { ...a, candidate_phone: serializedDISC } : a));
      setDiscTestState('completed');
    } catch (err) {
      console.error('Erro ao salvar resultado do teste DISC:', err);
      setDiscErrorMessage('Erro ao enviar suas respostas para o banco de dados. Por favor, tente novamente.');
    }
  };

  const handleFinishQuestions = async () => {
    const emptyQuestionIndex = ALL_QUESTIONS_LIST.findIndex((_, idx) => {
      const resp = questionsAnswers[idx];
      return !resp || resp.trim().length < 10;
    });

    if (emptyQuestionIndex !== -1) {
      setQuestionsErrorMessage(`Por favor, responda de forma descritiva a todas as 20 perguntas. A pergunta ${emptyQuestionIndex + 1} está em branco ou com resposta muito curta (mínimo 10 caracteres).`);
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL || !activeQuestionsApplicationId) {
      setQuestionsState('completed');
      return;
    }

    try {
      setIsSavingQuestions(true);
      setQuestionsErrorMessage(null);

      const app = myApplications.find(a => a.id === activeQuestionsApplicationId);
      let phoneStr = '';
      if (app) {
        phoneStr = app.candidate_phone || '';
      }

      const parsedData = parseCandidatePhoneData(phoneStr);
      const jsonResponses = JSON.stringify(questionsAnswers);
      const questionsVal = `COMPLETED===${jsonResponses}===DATE===${new Date().toISOString()}`;

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        questionsVal,
        parsedData.mbti,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', activeQuestionsApplicationId);

      if (error) throw error;

      setMyApplications(prev => prev.map(a => a.id === activeQuestionsApplicationId ? { ...a, candidate_phone: updatedPhoneVal } : a));
      setQuestionsState('completed');
      setSelectedQuestionsResult(questionsAnswers);
    } catch (err) {
      console.error('Erro ao salvar questionário:', err);
      setQuestionsErrorMessage('Erro ao enviar suas respostas para o banco de dados. Por favor, tente novamente.');
    } finally {
      setIsSavingQuestions(false);
    }
  };

  const handleFinishMBTITest = async () => {
    // Verificar se todas as 64 perguntas foram respondidas
    const unansweredId = MBTI_QUESTIONS.findIndex(q => {
      const ans = mbtiAnswers[q.id];
      return !ans || ans.a === null || ans.b === null;
    });

    if (unansweredId !== -1) {
      setMbtiErrorMessage(`Por favor, responda a todas as 64 questões. A questão ${unansweredId + 1} está com respostas pendentes.`);
      return;
    }

    setMbtiErrorMessage(null);

    try {
      setIsSavingMbti(true);

      let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;

      MBTI_QUESTIONS.forEach(q => {
        const ans = mbtiAnswers[q.id];
        const valA = ans.a ?? 0;
        const valB = ans.b ?? 0;

        // Somar ao score correspondente da opção A
        if (q.optionA.dimension === 'E') E += valA;
        else if (q.optionA.dimension === 'I') I += valA;
        else if (q.optionA.dimension === 'S') S += valA;
        else if (q.optionA.dimension === 'N') N += valA;
        else if (q.optionA.dimension === 'T') T += valA;
        else if (q.optionA.dimension === 'F') F += valA;
        else if (q.optionA.dimension === 'J') J += valA;
        else if (q.optionA.dimension === 'P') P += valA;

        // Somar ao score correspondente da opção B
        if (q.optionB.dimension === 'E') E += valB;
        else if (q.optionB.dimension === 'I') I += valB;
        else if (q.optionB.dimension === 'S') S += valB;
        else if (q.optionB.dimension === 'N') N += valB;
        else if (q.optionB.dimension === 'T') T += valB;
        else if (q.optionB.dimension === 'F') F += valB;
        else if (q.optionB.dimension === 'J') J += valB;
        else if (q.optionB.dimension === 'P') P += valB;
      });

      // Lógica de desempate e determinação do tipo
      let typeResult = "";
      typeResult += (E >= I) ? "E" : "I";
      typeResult += (S >= N) ? "S" : "N";
      typeResult += (T >= F) ? "T" : "F";
      typeResult += (J >= P) ? "J" : "P";

      const mbtiResultData = {
        type: typeResult,
        scores: { E, I, S, N, T, F, J, P },
        answers: MBTI_QUESTIONS.map(q => ({
          q: q.id,
          a: mbtiAnswers[q.id]?.a ?? 0,
          b: mbtiAnswers[q.id]?.b ?? 0
        }))
      };

      setMbtiResult({ type: typeResult, scores: { E, I, S, N, T, F, J, P } });

      if (!import.meta.env.VITE_SUPABASE_URL || !activeMbtiApplicationId) {
        setMbtiState('completed');
        setSelectedMbtiResult(mbtiResultData);
        return;
      }

      const app = myApplications.find(a => a.id === activeMbtiApplicationId);
      let phoneStr = '';
      if (app) {
        phoneStr = app.candidate_phone || '';
      }

      const parsedData = parseCandidatePhoneData(phoneStr);
      const mbtiVal = `COMPLETED===${JSON.stringify(mbtiResultData)}===DATE===${new Date().toISOString()}`;

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        mbtiVal,
        parsedData.temperamentos,
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', activeMbtiApplicationId);

      if (error) throw error;

      setMyApplications(prev => prev.map(a => a.id === activeMbtiApplicationId ? { ...a, candidate_phone: updatedPhoneVal } : a));
      setMbtiState('completed');
      setSelectedMbtiResult(mbtiResultData);
    } catch (err) {
      console.error('Erro ao salvar questionário MBTI:', err);
      setMbtiErrorMessage('Erro ao enviar suas respostas para o banco de dados. Por favor, tente novamente.');
    } finally {
      setIsSavingMbti(false);
    }
  };

  const handleFinishTemperamentosTest = async () => {
    // Verificar se todas as 25 perguntas foram respondidas
    const unansweredId = TEMPERAMENTOS_QUESTIONS.findIndex(q => !temperamentosAnswers[q.id]);

    if (unansweredId !== -1) {
      setTemperamentosErrorMessage(`Por favor, responda a todas as 25 questões. A questão ${unansweredId + 1} está pendente.`);
      return;
    }

    setTemperamentosErrorMessage(null);

    try {
      setIsSavingTemperamentos(true);

      let I = 0, C = 0, O = 0, A = 0;

      TEMPERAMENTOS_QUESTIONS.forEach(q => {
        const choice = temperamentosAnswers[q.id];
        if (choice === 'I') I++;
        else if (choice === 'C') C++;
        else if (choice === 'O') O++;
        else if (choice === 'A') A++;
      });

      // Lógica de perfil predominante e mistura
      const scoreArray = [
        { key: 'I', score: I },
        { key: 'C', score: C },
        { key: 'O', score: O },
        { key: 'A', score: A }
      ].sort((a, b) => b.score - a.score);

      let finalType = scoreArray[0].key;

      // Se a diferença for 0 ou 1, tenta formar uma mistura cadastrada (em qualquer ordem)
      if (scoreArray[0].score - scoreArray[1].score <= 1) {
        const k1 = scoreArray[0].key;
        const k2 = scoreArray[1].key;
        const comb1 = `${k1} + ${k2}`;
        const comb2 = `${k2} + ${k1}`;
        if (TEMPERAMENTOS_PROFILES[comb1]) {
          finalType = comb1;
        } else if (TEMPERAMENTOS_PROFILES[comb2]) {
          finalType = comb2;
        }
      }

      const temperamentosResultData = {
        type: finalType,
        scores: { I, C, O, A },
        answers: TEMPERAMENTOS_QUESTIONS.map(q => ({
          q: q.id,
          choice: temperamentosAnswers[q.id]
        }))
      };

      setTemperamentosResult({ type: finalType, scores: { I, C, O, A } });

      if (!import.meta.env.VITE_SUPABASE_URL || !activeTemperamentosApplicationId) {
        setTemperamentosState('completed');
        setSelectedTemperamentosResult(temperamentosResultData);
        return;
      }

      const app = myApplications.find(a => a.id === activeTemperamentosApplicationId);
      let phoneStr = '';
      if (app) {
        phoneStr = app.candidate_phone || '';
      }

      const parsedData = parseCandidatePhoneData(phoneStr);
      const temperamentosVal = `COMPLETED===${JSON.stringify(temperamentosResultData)}===DATE===${new Date().toISOString()}`;

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        temperamentosVal,
        parsedData.customTest
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', activeTemperamentosApplicationId);

      if (error) throw error;

      setMyApplications(prev => prev.map(a => a.id === activeTemperamentosApplicationId ? { ...a, candidate_phone: updatedPhoneVal } : a));
      setTemperamentosState('completed');
      setSelectedTemperamentosResult(temperamentosResultData);
    } catch (err) {
      console.error('Erro ao salvar teste de temperamentos:', err);
      setTemperamentosErrorMessage('Erro ao enviar suas respostas para o banco de dados. Por favor, tente novamente.');
    } finally {
      setIsSavingTemperamentos(false);
    }
  };

  const handleStartCustomTest = (app: any) => {
    // Tenta primeiro ler as perguntas salvas na candidatura (novo formato)
    const customTestStatus = getCustomTestStatusForApp(app);
    let qList = customTestStatus.questions || [];
    
    // Fallback: se não tiver perguntas na candidatura, lê da descrição da vaga (formato legado)
    if (!qList || qList.length === 0) {
      const jobDescription = app.jobs?.description || app.job?.description || '';
      qList = getCustomQuestionsFromJobDescription(jobDescription);
    }
    
    setCustomTestQuestions(qList);
    setCustomTestAnswers({});
    setActiveCustomTestApplicationId(app.id);
    setCustomTestErrorMessage(null);
    setCustomTestState('initial');
  };

  const handleFinishCustomTest = async () => {
    const unansweredQuestion = customTestQuestions.find(q => {
      const ans = customTestAnswers[q.id];
      return !ans || ans.trim().length === 0;
    });

    if (unansweredQuestion) {
      setCustomTestErrorMessage(`Por favor, responda a todas as perguntas do questionário. A pergunta "${unansweredQuestion.question}" está pendente.`);
      return;
    }

    setCustomTestErrorMessage(null);

    if (!import.meta.env.VITE_SUPABASE_URL || !activeCustomTestApplicationId) {
      setCustomTestState('completed');
      setSelectedCustomTestResult(customTestAnswers);
      return;
    }

    try {
      setIsSavingCustomTest(true);

      const app = myApplications.find(a => a.id === activeCustomTestApplicationId);
      let phoneStr = '';
      if (app) {
        phoneStr = app.candidate_phone || '';
      }

      const parsedData = parseCandidatePhoneData(phoneStr);
      const customStatus = getCustomTestStatusForApp(app);
      
      let customTestVal = '';
      if (customStatus.questions && customStatus.questions.length > 0) {
        // Novo formato: salvar com as perguntas, título e respostas
        const payload = {
          title: customStatus.title || 'Questionário Customizado',
          questions: customStatus.questions,
          responses: customTestAnswers
        };
        customTestVal = `COMPLETED:::${JSON.stringify(payload)}===DATE===${new Date().toISOString()}`;
      } else {
        // Formato legado
        const payload = {
          responses: customTestAnswers
        };
        customTestVal = `COMPLETED===${JSON.stringify(payload)}===DATE===${new Date().toISOString()}`;
      }

      const updatedPhoneVal = serializeCandidatePhoneData(
        parsedData.phone,
        parsedData.disc,
        parsedData.notes,
        parsedData.questions,
        parsedData.mbti,
        parsedData.temperamentos,
        customTestVal
      );

      const { error } = await supabase
        .from('applications')
        .update({ candidate_phone: updatedPhoneVal })
        .eq('id', activeCustomTestApplicationId);

      if (error) throw error;

      setMyApplications(prev => prev.map(a => a.id === activeCustomTestApplicationId ? { ...a, candidate_phone: updatedPhoneVal } : a));
      setCustomTestState('completed');
      setSelectedCustomTestResult(customTestAnswers);
    } catch (err) {
      console.error('Erro ao salvar questionário customizado:', err);
      setCustomTestErrorMessage('Erro ao enviar suas respostas. Por favor, tente novamente.');
    } finally {
      setIsSavingCustomTest(false);
    }
  };

  const getBenefitsList = (job: any) => {
    const list: string[] = [];
    if (job.benefits) {
      let b = job.benefits;
      if (typeof b === 'string') {
        try {
          b = JSON.parse(b);
        } catch (e) {}
      }
      if (b.vt?.selected) list.push(`Vale Transporte (VT): ${b.vt.value || 'Incluso'}`);
      if (b.va?.selected) list.push(`Vale Alimentação/Refeição (VA/VR): ${b.va.value || 'Incluso'}`);
      if (b.healthInsurance) list.push('Plano de Saúde');
      if (b.dentalPlan) list.push('Plano Odontológico');
    }
    
    if (list.length === 0 && job.description) {
      const lines = job.description.split('\n');
      let inBenefits = false;
      for (const line of lines) {
        if (line.toLowerCase().includes('benefícios:') || line.toLowerCase().includes('beneficios:')) {
          inBenefits = true;
          continue;
        }
        if (inBenefits && line.trim().startsWith('•')) {
          list.push(line.replace('•', '').trim());
        }
      }
    }
    return list;
  };

  const getRequirementsList = (job: any) => {
    if (Array.isArray(job.requirements)) return job.requirements;
    if (typeof job.requirements === 'string') {
      try {
        const parsed = JSON.parse(job.requirements);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return job.requirements.split('\n').filter((r: string) => r.trim().length > 0);
    }
    return [];
  };

  // Read shared vacancy parameter from URL query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedJobId = params.get('vaga') || params.get('jobId');
    if (sharedJobId) {
      setActiveTab('Vagas');
      if (import.meta.env.VITE_SUPABASE_URL) {
        supabase
          .from('jobs')
          .select('*')
          .eq('id', sharedJobId)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              const s = (data.status || '').toLowerCase();
              const isActive = s === 'active' || s === 'ativa' || s === '';
              if (isActive) {
                setSelectedJobForDetails(data);
              } else {
                alert('Esta vaga não está ativa no momento.');
              }
            }
          });
      }
    }
  }, []);

  // Fetch applicant's previously submitted candidacies from applications table on email load
  useEffect(() => {
    async function loadCandidateCandidacies() {
      if (!import.meta.env.VITE_SUPABASE_URL || !resumeData.email) return;
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*');
        if (!error && data) {
          // Client-side filtering to avoid database field-mismatch exceptions
          const myApps = data.filter((app: any) => {
            const appEmail = app.candidate_email || app.email;
            const appName = app.candidate_name || app.name;
            return (
              (appEmail && appEmail.toLowerCase().trim() === resumeData.email.toLowerCase().trim()) ||
              (appName && appName.toLowerCase().trim() === resumeData.fullName.toLowerCase().trim())
            );
          });
          setAppliedJobIds(myApps.map((a: any) => a.job_id));
          setMyApplications(myApps);
        }
      } catch (err) {
        console.error('Erro ao buscar candidaturas prévias do candidato:', err);
      }
    }
    if (resumeData.email) {
      loadCandidateCandidacies();
    }
  }, [resumeData.email, resumeData.fullName]);

  useEffect(() => {
    async function loadVacancies() {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      
      setIsFetchingVacancies(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Filter: only show active jobs
        const activeJobs = (data || []).filter((v: any) => {
          const s = (v.status || '').toLowerCase();
          return s === 'active' || s === 'ativa' || s === '';
        });

        // Sort vacancies to place the shared/referred vacancy at the top of the list if referenced in URL
        const params = new URLSearchParams(window.location.search);
        const sharedJobId = params.get('vaga') || params.get('jobId');
        let sortedVacancies = activeJobs;
        if (sharedJobId) {
          sortedVacancies = [...sortedVacancies].sort((a, b) => {
            if (a.id === sharedJobId) return -1;
            if (b.id === sharedJobId) return 1;
            return 0;
          });
        }
        setVacancies(sortedVacancies);
      } catch (err) {
        console.error('Erro ao buscar vagas do Supabase:', err);
      } finally {
        setIsFetchingVacancies(false);
      }
    }

    loadVacancies();
  }, [activeTab]);

  const handleApply = async (vacancy: any) => {
    const age = calculateAge(resumeData.birthDate);
    
    if (!resumeData.birthDate) {
      setErrorMessage('Por favor, preencha sua data de nascimento no currículo primeiro.');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    const minAgeRequired = vacancy.min_age !== undefined ? vacancy.min_age : (vacancy.minAge || 16);
    if (age < minAgeRequired) {
      setErrorMessage(`Esta vaga exige idade mínima de ${minAgeRequired} anos. Você tem ${age} anos.`);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL) {
      alert('Configuração do Supabase ausente.');
      return;
    }

    setIsApplying(vacancy.id);
    try {
      let payload: any = {
        job_id: vacancy.id,
        candidate_name: resumeData.fullName,
        candidate_phone: resumeData.phone,
        status: 'Triagem',
        city: resumeData.city,
        state: resumeData.state,
        profile_pic: resumeData.profilePic,
        candidate_email: resumeData.email,
        email: resumeData.email,
        name: resumeData.fullName,
        phone: resumeData.phone
      };

      let attempt = 0;
      const maxAttempts = 12;
      let success = false;
      let lastError: any = null;

      while (attempt < maxAttempts) {
        const { error } = await supabase
          .from('applications')
          .insert([payload]);

        if (!error) {
          success = true;
          break;
        }

        lastError = error;
        console.error(`Tentativa ${attempt} falhou ao salvar candidatura:`, error);

        // PGRST204: schema cache column not found
        const isColumnError = error.code === 'PGRST204' || 
          (error.message && error.message.toLowerCase().includes("could not find the") && error.message.toLowerCase().includes("column"));

        if (isColumnError) {
          // Extract column name using regex
          const match = error.message.match(/Could not find the '([^']+)' column/i);
          const colToDrop = match ? match[1] : null;

          if (colToDrop && colToDrop in payload) {
            console.warn(`[Self-Healing] Removendo coluna inexistente '${colToDrop}' de applications e tentando novamente.`);
            delete payload[colToDrop];
            attempt++;
            continue;
          }
        }

        // Other database error, throw it
        throw error;
      }

      if (!success) {
        throw lastError || new Error('Falha ao enviar candidatura após várias tentativas.');
      }

      setAppliedJobIds([...appliedJobIds, vacancy.id]);
      showCustomSuccess(`Candidatura enviada com sucesso para ${vacancy.title}!`, 'Candidatura enviada');
    } catch (err) {
      console.error('Erro ao enviar candidatura:', err);
      showCustomAlert('Erro ao se candidatar. Verifique a tabela "applications" ou adicione as colunas conforme as instruções.', 'Erro de candidatura');
    } finally {
      setIsApplying(null);
    }
  };

  const handleSelectTab = (tab: string) => {
    if (activeTab === 'Meu Currículo' && isResumeDirty && tab !== 'Meu Currículo') {
      showCustomConfirm(
        'Você fez alterações no seu currículo que serão perdidas se você mudar de página agora.\n\nDeseja descartar as alterações e sair?',
        () => {
          if (originalResumeData) {
            setResumeData(JSON.parse(JSON.stringify(originalResumeData)));
          }
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        },
        undefined,
        'Alterações não salvas'
      );
    } else {
      setActiveTab(tab);
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F0F2F5] relative font-sans">
      {/* Decorative Blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      {errorMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 bg-red-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <X size={20} className="shrink-0" />
          <span className="font-bold text-sm">{errorMessage}</span>
        </div>
      )}

      {/* Backdrop overlay for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium Style WITH RESPONSIVE BEHAVIOR */}
      <aside className={`w-64 ${isSidebarExpanded ? 'lg:w-64 lg:p-6' : 'lg:w-20 lg:p-4'} bg-gradient-to-b from-primary-600 via-primary-700 to-highlight-700 p-6 flex flex-col fixed h-full z-[100] shadow-2xl transition-all duration-300 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className={`mb-10 flex ${isSidebarExpanded ? 'lg:flex-row justify-between lg:justify-start lg:gap-4' : 'lg:flex-col justify-between lg:justify-center lg:gap-4'} items-center w-full gap-4`}>
          {/* Logo completa no mobile e no desktop expandido */}
          <img src="/logo.png" alt="Colaborh" className={`h-8 w-auto brightness-0 invert ${isSidebarExpanded ? '' : 'lg:hidden'}`} />
          
          {/* Símbolo minimalista no desktop recolhido */}
          <div className={`hidden ${isSidebarExpanded ? 'lg:hidden' : 'lg:flex'} justify-center items-center w-full`}>
            <img src="/logo-icon.png" alt="Colaborh" className="h-10 w-10 object-contain" />
          </div>

          <button 
            onClick={() => setIsMobileSidebarOpen(false)} 
            className="lg:hidden text-white/70 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-3 lg:space-y-4 w-full flex flex-col items-center">
          <SidebarItem icon={FileText} label="Meu Currículo" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
          <SidebarItem icon={Briefcase} label="Candidaturas" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
          <SidebarItem icon={Star} label="Vagas" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
          <SidebarItem icon={Brain} label="Testes" activeTab={activeTab} setActiveTab={handleSelectTab} isSidebarExpanded={isSidebarExpanded} />
        </nav>

        <div className="mt-auto space-y-3 pt-6 border-t border-white/10 w-full flex flex-col items-center">
          {/* Configurações */}
          <div className="relative group/item w-full flex justify-center h-12">
            <button 
              onClick={() => handleSelectTab('Configurações')}
              className={`w-full ${
                isSidebarExpanded 
                  ? 'lg:w-full lg:h-12 lg:px-4 lg:justify-start lg:space-x-3' 
                  : 'lg:w-12 lg:h-12 lg:px-0 lg:justify-center lg:space-x-0'
              } flex items-center justify-start space-x-3 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
                activeTab === 'Configurações' 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings size={16} className={activeTab === 'Configurações' ? 'text-white' : 'text-white/50'} />
              <span className={`font-bold text-[10px] uppercase tracking-widest whitespace-nowrap ${isSidebarExpanded ? 'lg:inline-block' : 'lg:hidden'}`}>Configurações</span>
            </button>
            
            <div 
              onClick={() => handleSelectTab('Configurações')}
              className={`absolute left-0 top-0 h-12 ${isSidebarExpanded ? 'hidden' : 'hidden lg:flex'} items-center justify-start bg-[#533af6]/75 backdrop-blur-[6px] text-white rounded-2xl shadow-[0_10px_25px_rgba(83,58,246,0.25)] cursor-pointer pointer-events-none opacity-0 translate-x-[-24px] group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[110] w-auto whitespace-nowrap pl-[16px] pr-6 gap-3`}
            >
              <Settings size={16} className="text-white" />
              <span className="font-black text-[10px] uppercase tracking-widest text-white leading-none mt-0.5">Configurações</span>
            </div>
          </div>

          {/* Sair */}
          <div className="relative group/item w-full flex justify-center h-12">
            <button 
              onClick={onLogout}
              className={`w-full ${
                isSidebarExpanded 
                  ? 'lg:w-full lg:h-12 lg:px-4 lg:justify-start lg:space-x-3' 
                  : 'lg:w-12 lg:h-12 lg:px-0 lg:justify-center lg:space-x-0'
              } flex items-center justify-start space-x-3 py-2.5 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-500/10 transition-all font-bold text-[10px] uppercase tracking-widest`}
            >
              <LogOut size={16} />
              <span className={`font-bold text-[10px] uppercase tracking-widest whitespace-nowrap ${isSidebarExpanded ? 'lg:inline-block' : 'lg:hidden'}`}>Sair</span>
            </button>

            <div 
              onClick={onLogout}
              className={`absolute left-0 top-0 h-12 ${isSidebarExpanded ? 'hidden' : 'hidden lg:flex'} items-center justify-start bg-[#533af6]/75 backdrop-blur-[6px] text-white rounded-2xl shadow-[0_10px_25px_rgba(83,58,246,0.25)] cursor-pointer pointer-events-none opacity-0 translate-x-[-24px] group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[110] w-auto whitespace-nowrap pl-[16px] pr-6 gap-3`}
            >
              <LogOut size={16} className="text-white" />
              <span className="font-black text-[10px] uppercase tracking-widest text-white leading-none mt-0.5">Sair</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 min-h-screen flex flex-col ${isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'} transition-all duration-300 relative z-10`}>
        {/* Novo Cabeçalho Premium - Estilo Barra Horizontal do Mockup */}
        <header className={`sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 transition-all duration-300 ${
          activeTab === 'Meu Currículo' 
            ? (isHeaderScrolled ? 'pt-4 pb-3 flex flex-col gap-0 shadow-sm' : 'pt-5 pb-5 flex flex-col gap-5') 
            : 'py-5 flex flex-col sm:flex-row items-center justify-between gap-4'
        }`}>
          {/* Linha Principal do Cabeçalho */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* Lado Esquerdo */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-3">
                {/* Botão de Toggle da Sidebar (visível apenas no desktop) */}
                <button
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  className="hidden lg:flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-full text-slate-500 transition-all active:scale-95 shrink-0 shadow-sm"
                  title={isSidebarExpanded ? "Recolher menu" : "Expandir menu"}
                >
                  {isSidebarExpanded ? (
                    <ChevronLeft size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {/* Ícone e Nome da Aba Ativa */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                    {activeTab === 'Meu Currículo' && <FileText size={18} />}
                    {activeTab === 'Candidaturas' && <Briefcase size={18} />}
                    {activeTab === 'Vagas' && <Star size={18} />}
                    {activeTab === 'Testes' && <Brain size={18} />}
                    {activeTab === 'Configurações' && <Settings size={18} />}
                  </div>
                  <h1 className="text-base font-extrabold text-slate-800 tracking-tight">{activeTab}</h1>
                </div>
              </div>

              {/* Botão de abrir menu móvel (apenas mobile/tablet) */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* Lado Direito */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              {/* Botão de Chat (Circular Roxo preenchido com brilho/sombra) */}
              <button 
                onClick={() => showCustomAlert("Suporte Colaborh: Como podemos te ajudar hoje?", "Suporte")}
                className="w-10 h-10 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-600/35 transition-all hover:scale-105 active:scale-95 shrink-0"
                title="Suporte"
              >
                <MessageSquare size={18} />
              </button>

              {/* Botão de Notificações (Sino circular branco) */}
              <button
                onClick={() => showCustomAlert("Você não possui novas notificações no momento.", "Notificações")}
                className="w-10 h-10 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-sm"
                title="Notificações"
              >
                <Bell size={18} />
              </button>

              {/* Divisor Vertical */}
              <div className="h-7 w-[1px] bg-slate-200" />

              {/* Info do Candidato */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 shrink-0 border border-slate-100">
                  <User size={18} />
                </div>
                <div className="flex flex-col text-left hidden sm:flex">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none">Candidato</span>
                  <span className="font-bold text-sm text-slate-700 max-w-[120px] truncate">{resumeData.fullName ? resumeData.fullName.split(' ')[0] : 'Cadastrado'}</span>
                </div>
              </div>

              {/* Divisor Vertical */}
              <div className="h-7 w-[1px] bg-slate-200" />

              {/* Avatar com iniciais */}
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-extrabold text-sm shadow-sm shrink-0" title={resumeData.fullName}>
                {resumeData.fullName ? resumeData.fullName.substring(0, 2).toUpperCase() : 'CA'}
              </div>
            </div>
          </div>

          {/* Segunda Linha: Botões de Ação do Currículo (Alinhados à direita, sem linha divisória intermediária) */}
          {activeTab === 'Meu Currículo' && (
            <motion.div 
              initial={{ height: 'auto', opacity: 1 }}
              animate={{ 
                height: isHeaderScrolled ? 0 : 'auto', 
                opacity: isHeaderScrolled ? 0 : 1,
                pointerEvents: isHeaderScrolled ? 'none' : 'auto'
              }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex justify-end w-full pb-1 overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isParsing}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-highlight-500 to-highlight-600 hover:from-highlight-600 hover:to-highlight-700 text-white rounded-full shadow-md shadow-highlight-500/10 transition-all font-bold border border-transparent shrink-0"
                >
                  {isParsing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles className="text-white" size={14} />}
                  <span className="uppercase tracking-wider text-[11px]">Preencher com IA</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.docx,.doc,image/*" 
                    onChange={(e) => e.target.files?.[0] && handleAIParse(e.target.files[0])}
                  />
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveToSupabase}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-[#533af6] hover:bg-[#4326e5] text-white font-bold rounded-full shadow-md shadow-primary-500/10 transition-all border border-transparent shrink-0 cursor-pointer"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span className="uppercase tracking-wider text-[11px]">{isSaving ? 'Salvando...' : 'Salvar'}</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResumePreview(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-full shadow-sm transition-all border border-indigo-150 shrink-0 cursor-pointer"
                >
                  <Eye size={14} />
                  <span className="uppercase tracking-wider text-[11px]">Visualizar</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadResume}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-primary-600 font-bold rounded-full shadow-sm transition-all border border-primary-100 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  <span className="uppercase tracking-wider text-[11px]">{isExporting ? 'Gerando...' : 'Baixar PDF'}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </header>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-10 relative z-10">
            <div className="w-full">
          {activeTab === 'Meu Currículo' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
              {/* Coluna Esquerda: Ficha Visual do Candidato (Sticky no desktop) - lg:col-span-3 */}
              <aside className="lg:col-span-3 bg-white p-6 rounded-[10px] shadow-sleek border border-white/50 space-y-6 lg:sticky lg:top-28">
                {/* Destaque da Foto com Blur da própria imagem de perfil ao fundo */}
                <div className="w-full h-44 rounded-[10px] flex items-center justify-center relative overflow-hidden bg-slate-100">
                  {resumeData.profilePic ? (
                    <img 
                      src={resumeData.profilePic} 
                      alt="Profile Blur" 
                      className="absolute inset-0 w-full h-full object-cover blur-sm opacity-45 scale-125 select-none pointer-events-none" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-highlight-500/10" />
                  )}
                  <div className="absolute inset-0 bg-black/5 z-0 pointer-events-none" />
                  
                  {/* Degradê suave para se fundir com o fundo branco do card */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none z-10" />
                  
                  {/* Container da Foto Redonda */}
                  <div className="relative group/photo shrink-0 z-20">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative ring-2 ring-white/30 transition-transform duration-500 hover:scale-105">
                      {resumeData.profilePic ? (
                        <img src={resumeData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={36} className="text-slate-200" />
                      )}
                      <div className="absolute inset-0 bg-primary-600/80 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
                        <Camera size={16} className="text-white mb-1" />
                        <span className="text-[7px] font-bold text-white uppercase tracking-widest text-center leading-none">Alterar</span>
                      </div>
                      <input 
                        type="file" 
                        ref={profilePicRef} 
                        className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                        accept="image/*" 
                        onChange={handleProfilePicSelect}
                      />
                    </div>
                  </div>
                </div>

                {/* Nome e Cargo */}
                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-tight truncate px-2" title={resumeData.fullName}>
                    {resumeData.fullName || 'Seu Nome'}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {resumeData.experiences?.find(exp => exp.current)?.role 
                      || (resumeData.experiences?.[0]?.role || 'Candidato')}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-2" />

                <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight pl-1">Informações Pessoais</h2>
                  <div className="w-12 h-1 bg-[#8959f5] rounded-full mt-1.5 ml-1" />
                </div>

                {/* Formulário de Informações Pessoais Mapeado na Barra Lateral */}
                <div className="space-y-4 text-left">
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">Nome Completo</label>
                    <input 
                      type="text"
                      value={resumeData.fullName}
                      onChange={(e) => setResumeData({...resumeData, fullName: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-semibold text-slate-700 text-xs"
                      placeholder="Nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">E-mail</label>
                    <input 
                      type="email"
                      value={resumeData.email}
                      onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-semibold text-slate-700 text-xs"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">Gênero</label>
                    <div className="relative">
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        value={resumeData.gender}
                        onChange={(e) => setResumeData({...resumeData, gender: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-semibold text-slate-700 appearance-none pr-10 text-xs"
                      >
                        <option value="">Selecione seu gênero</option>
                        {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">WhatsApp / Telefone</label>
                    <div className="relative">
                      <Phone size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400" />
                      <input 
                        type="tel"
                        value={resumeData.phone}
                        onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-semibold text-slate-700 text-xs"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">Data de Nascimento</label>
                    <input 
                      type="date"
                      value={resumeData.birthDate}
                      onChange={(e) => setResumeData({...resumeData, birthDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-semibold text-slate-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">Estado</label>
                    <div className="relative">
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        value={resumeData.state}
                        onChange={(e) => setResumeData({...resumeData, state: e.target.value, city: ''})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-semibold text-slate-700 appearance-none text-xs"
                      >
                        <option value="">UF</option>
                        {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>
                  </div>

                  {resumeData.state && (
                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">Cidade</label>
                      <div className="relative">
                        {isLoadingCities ? (
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            <Loader2 size={12} className="animate-spin text-primary-500" />
                          </div>
                        ) : (
                          <MapPin size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400" />
                        )}
                        <select 
                          value={resumeData.city}
                          onChange={(e) => setResumeData({...resumeData, city: e.target.value})}
                          disabled={isLoadingCities || !cities.length}
                          className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-semibold text-slate-700 appearance-none text-xs disabled:opacity-50"
                        >
                          <option value="">{isLoadingCities ? 'Carregando...' : 'Selecione a cidade'}</option>
                          {cities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                        {!isLoadingCities && <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">Pretensão Salarial</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">R$</span>
                      <input 
                        type="text"
                        value={resumeData.salary}
                        onChange={(e) => setResumeData({...resumeData, salary: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-semibold text-slate-700 text-xs"
                        placeholder="Ex: 2.500,00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1 block pl-1">Acessibilidade</label>
                    <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-[10px] border border-transparent">
                      <label className="flex items-center gap-3 cursor-pointer group/toggle shrink-0">
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${resumeData.isPcd ? 'bg-primary-600' : 'bg-slate-200'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${resumeData.isPcd ? 'translate-x-5' : ''}`} />
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={resumeData.isPcd} 
                            onChange={(e) => setResumeData({...resumeData, isPcd: e.target.checked})} 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                          <Accessibility size={14} /> PCD
                        </span>
                      </label>
                      
                      <AnimatePresence>
                        {resumeData.isPcd && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pt-1"
                          >
                            <input 
                              type="text"
                              value={resumeData.cid}
                              onChange={(e) => setResumeData({...resumeData, cid: e.target.value})}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-[10px] outline-none font-bold text-[10px] text-primary-600 uppercase placeholder:text-slate-350"
                              placeholder="COD CID"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Coluna Direita: Seções Completas do Currículo - lg:col-span-9 */}
              <div className="lg:col-span-9 space-y-6">

              {/* Summary Section */}
              <section className="bg-white p-7 rounded-[10px] shadow-[0_10px_40px_rgba(124,58,237,0.06)] border border-white">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Resumo Profissional</h2>
                    <div className="w-16 h-1 bg-[#8959f5] rounded-full mt-1.5" />
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${resumeData.summary.length >= 300 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {resumeData.summary.length >= 300 ? <CheckCircle2 size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                    {resumeData.summary.length} / 300
                  </div>
                </div>
                <textarea 
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-transparent rounded-[10px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all min-h-[140px] leading-relaxed font-medium text-slate-600 text-sm italic"
                  placeholder="Conte um pouco sobre sua trajetória..."
                />
              </section>

              {/* Professional Experience */}
              <section className="bg-white p-8 rounded-[10px] shadow-sleek border border-white/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Experiência Profissional</h2>
                    <div className="w-16 h-1 bg-[#8959f5] rounded-full mt-1.5" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${resumeData.isFirstJob ? 'bg-primary-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${resumeData.isFirstJob ? 'translate-x-5' : ''}`} />
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={resumeData.isFirstJob} 
                          onChange={(e) => setResumeData({...resumeData, isFirstJob: e.target.checked})} 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primeiro Emprego</span>
                    </label>

                    {!resumeData.isFirstJob && (
                      <button 
                        onClick={() => { setEditingExp(null); setShowExpModal(true); }}
                        className="w-10 h-10 flex items-center justify-center bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-full transition-all cursor-pointer"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {resumeData.isFirstJob ? (
                  <div className="bg-primary-50/20 p-8 rounded-[10px] text-center border-2 border-dashed border-primary-50/50">
                    <div className="w-12 h-12 bg-white rounded-[10px] shadow-sm flex items-center justify-center mx-auto mb-4 text-primary-500 border border-slate-100/50">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">Pronto para sua jornada?</h3>
                    <p className="text-slate-400 max-w-sm mx-auto text-[11px] font-medium uppercase tracking-wider">Focaremos na sua formação e habilidades.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {resumeData.experiences.length === 0 ? (
                      <div className="md:col-span-2 text-center py-12 bg-slate-50 rounded-[10px] border-2 border-dashed border-slate-200">
                        <Briefcase size={32} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sem registros</p>
                      </div>
                    ) : (
                      resumeData.experiences.map((exp) => (
                        <div key={exp.id} className="group relative bg-white p-6 rounded-[10px] border-2 border-slate-100 hover:border-primary-100 hover:bg-slate-50/50 transition-all shadow-sm">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 bg-white border border-slate-100 rounded-[10px] flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                                <Building size={20} />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-tight">{exp.role}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-slate-700 font-bold text-xs">{exp.company}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Clock size={12} className="text-primary-400" />
                                    {calculateDuration(exp.startDate, exp.endDate, exp.current)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1.5 self-end sm:self-auto opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingExp(exp); setShowExpModal(true); }} className="p-2.5 bg-white text-slate-400 hover:text-primary-600 rounded-full shadow-sm border border-slate-100 transition-colors cursor-pointer">
                                <Settings size={16} />
                              </button>
                              <button onClick={() => setResumeData({...resumeData, experiences: resumeData.experiences.filter(e => e.id !== exp.id)})} className="p-2.5 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm border border-slate-100 transition-colors cursor-pointer">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 pl-16">
                            <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-line border-l-2 border-slate-100 pl-4">{exp.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </section>

              {/* Education Section */}
              <section className="bg-white p-8 rounded-[10px] shadow-sleek border border-white/50">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Formação Acadêmica</h2>
                    <div className="w-16 h-1 bg-[#8959f5] rounded-full mt-1.5" />
                  </div>
                  <button onClick={() => { setEditingEdu(null); setShowEduModal(true); }} className="w-10 h-10 flex items-center justify-center bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-full transition-all cursor-pointer">
                    <Plus size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {resumeData.educations.length === 0 ? (
                    <div className="md:col-span-2 text-center py-12 bg-slate-50 rounded-[10px] border-2 border-dashed border-slate-200">
                      <GraduationCap size={32} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sem registros</p>
                    </div>
                  ) : (
                    resumeData.educations.map((edu) => (
                      <div key={edu.id} className="group bg-white p-6 rounded-[10px] border border-slate-100 hover:border-primary-100 hover:shadow-md transition-all relative">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-primary-50 rounded-[10px] flex items-center justify-center text-primary-600 border border-slate-100/50">
                            <GraduationCap size={20} />
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => { setEditingEdu(edu); setShowEduModal(true); }} className="p-2 text-slate-300 hover:text-primary-600 cursor-pointer"><Settings size={16} /></button>
                            <button onClick={() => setResumeData({...resumeData, educations: resumeData.educations.filter(e => e.id !== edu.id)})} className="p-2 text-slate-300 hover:text-red-500 cursor-pointer"><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight mb-1">{edu.course}</h3>
                        <p className="text-[11px] font-bold text-slate-500 mb-4">{edu.institution}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            edu.status === 'Completo' ? 'bg-green-100 text-green-700' : 
                            edu.status === 'Cursando' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {edu.status}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ano: {edu.gradYear}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Skills Section */}
              <section className="bg-white p-8 rounded-[10px] shadow-sleek border border-white/50">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Habilidades</h2>
                    <div className="w-16 h-1 bg-[#8959f5] rounded-full mt-1.5" />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 bg-highlight-50 text-highlight-700 rounded-[10px] text-xs font-bold border border-highlight-100 group transition-all hover:bg-highlight-100">
                      {skill}
                      <button 
                        onClick={() => setResumeData({...resumeData, skills: resumeData.skills.filter((_, i) => i !== index)})}
                        className="text-primary-300 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Adicione uma habilidade (ex: React, Inglês, Gestão...)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value.trim();
                        if (val && !resumeData.skills.includes(val)) {
                          setResumeData({...resumeData, skills: [...resumeData.skills, val]});
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm"
                  />
                  <button 
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const val = input.value.trim();
                      if (val && !resumeData.skills.includes(val)) {
                        setResumeData({...resumeData, skills: [...resumeData.skills, val]});
                        input.value = '';
                      }
                    }}
                    className="px-5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors cursor-pointer"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </section>

              </div>
            </div>
          ) : activeTab === 'Configurações' ? (
            <motion.div 
              key="configuracoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white flex flex-col items-center">
                  <div className="relative group shrink-0 mb-6">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative ring-2 ring-primary-50">
                      {resumeData.profilePic ? (
                        <img src={resumeData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-slate-200" />
                      )}
                      <div className="absolute inset-0 bg-primary-600/80 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
                        <Camera size={16} className="text-white mb-1" />
                        <span className="text-[8px] font-bold text-white uppercase tracking-widest text-center">Mudar</span>
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          accept="image/*" 
                          onChange={handleProfilePicSelect}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight text-center">{resumeData.fullName || 'Seu Nome'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Candidato</p>
                  
                  <div className="w-full pt-6 border-t border-slate-50 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Currículo</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Pronto</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Idade</span>
                      <span className="text-slate-700">{calculateAge(resumeData.birthDate) || '--'} anos</span>
                    </div>
                  </div>
                </div>

                {/* Form Card */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sleek border border-white">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                       <User size={20} />
                     </div>
                     <div>
                       <h3 className="text-lg font-black text-slate-900 tracking-tight">Dados do Perfil</h3>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mantenha suas informações básicas em dia</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="col-span-full">
                       <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">Nome Completo</label>
                       <input 
                         type="text" 
                         value={resumeData.fullName}
                         onChange={(e) => setResumeData({...resumeData, fullName: e.target.value.toUpperCase()})}
                         placeholder="Seu nome" 
                         className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" 
                       />
                     </div>
                     <div className="col-span-full">
                       <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">E-mail</label>
                       <input 
                         type="email" 
                         value={resumeData.email}
                         onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
                         placeholder="seu@email.com" 
                         className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" 
                       />
                     </div>
                     <div>
                       <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">WhatsApp / Telefone</label>
                       <div className="relative">
                         <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400" />
                         <input 
                           type="tel" 
                           value={resumeData.phone}
                           onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
                           placeholder="(00) 00000-0000" 
                           className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" 
                         />
                       </div>
                     </div>
                     <div>
                       <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">Data de Nascimento</label>
                       <input 
                         type="date"
                         value={resumeData.birthDate}
                         onChange={(e) => setResumeData({...resumeData, birthDate: e.target.value})}
                         className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm"
                       />
                     </div>
                  </div>
                  
                  <div className="mt-10 flex gap-4">
                    <button 
                      onClick={handleSaveToSupabase}
                      disabled={isSaving}
                      className="flex-1 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all text-[9px] disabled:opacity-50"
                    >
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Location and Other Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <MapPin size={16} />
                      </div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Localização</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Estado</label>
                           <select 
                             value={resumeData.state}
                             onChange={(e) => setResumeData({...resumeData, state: e.target.value, city: ''})}
                             className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:bg-white"
                           >
                             <option value="">UF</option>
                             {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Cidade</label>
                           <select 
                             value={resumeData.city}
                             onChange={(e) => setResumeData({...resumeData, city: e.target.value})}
                             disabled={isLoadingCities || !cities.length}
                             className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:bg-white disabled:opacity-50"
                           >
                             <option value="">Cidade</option>
                             {cities.map(city => <option key={city} value={city}>{city}</option>)}
                           </select>
                         </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <Accessibility size={16} />
                      </div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Diversidade</h4>
                    </div>
                    <div className="space-y-5">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Sou PCD</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${resumeData.isPcd ? 'bg-primary-600' : 'bg-slate-200'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${resumeData.isPcd ? 'right-0.5' : 'left-0.5'}`} />
                          <input type="checkbox" className="hidden" checked={resumeData.isPcd} onChange={(e) => setResumeData({...resumeData, isPcd: e.target.checked})} />
                        </div>
                      </label>
                      {resumeData.isPcd && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">CID</span>
                          <input 
                            type="text" 
                            value={resumeData.cid}
                            onChange={(e) => setResumeData({...resumeData, cid: e.target.value})}
                            placeholder="Ex: G40.0" 
                            className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1 text-[10px] font-bold w-24 text-right"
                          />
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </motion.div>
          ) : activeTab === 'Vagas' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {isFetchingVacancies ? (
                <div className="text-center py-20 bg-white rounded-[2rem] shadow-sleek border border-white">
                  <Loader2 className="animate-spin mx-auto text-primary-600 mb-4" size={32} />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Buscando melhores oportunidades...</p>
                </div>
              ) : vacancies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vacancies.map((v) => {
                    const isApplied = appliedJobIds.includes(v.id);
                    return (
                      <div key={v.id} className="bg-white p-7 rounded-[2.5rem] shadow-sleek border border-white hover:border-primary-100 transition-all group flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-black/5">
                              <Briefcase size={28} />
                            </div>
                            <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                              {v.modality}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1 group-hover:text-primary-600 transition-colors uppercase truncate">{v.title}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                            Empresa Parceira • {
                              (() => {
                                if (v.city && v.state) return `${v.city}, ${v.state}`;
                                if (v.city) return v.city;
                                if (v.state) return v.state;
                                if (v.description) {
                                  const cleanDesc = v.description.split('===ETAPAS_JSON===')[0];
                                  const locMatch = cleanDesc.match(/Localização:\s*([^\n]+)/i);
                                  if (locMatch && locMatch[1]) {
                                    return locMatch[1].trim();
                                  }
                                }
                                return v.modality || 'Remoto';
                              })()
                            }
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="bg-slate-50 p-3 rounded-2xl border border-white shadow-sm italic">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Remuneração</p>
                              <p className="text-[10px] font-bold text-slate-700">{v.salary || 'A combinar'}</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-white shadow-sm italic">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Idade Mín.</p>
                              <p className="text-[10px] font-bold text-red-500">{v.min_age || 18} anos</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2.5 mt-auto">
                           <button 
                             type="button"
                             onClick={() => setSelectedJobForDetails(v)}
                             className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-[9px] uppercase tracking-wider transition-all"
                           >
                             Ver Detalhes
                           </button>
                           <button 
                             type="button"
                             onClick={() => handleApply(v)}
                             disabled={isApplied || isApplying === v.id}
                             className={`flex-[2] py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-[0.1em] transition-all shadow-xl flex items-center justify-center gap-2 ${
                               isApplied 
                                 ? 'bg-emerald-500 text-white cursor-default shadow-emerald-100' 
                                 : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95 shadow-slate-200/50'
                             }`}
                           >
                             {isApplying === v.id ? <Loader2 size={14} className="animate-spin" /> : null}
                             {isApplied ? (
                               <><CheckCircle2 size={14} /> Candidatado</>
                             ) : (
                               'Candidatar-se'
                             )}
                           </button>
                         </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Star size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Aguardando oportunidades...</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium">As empresas ainda estão preparando as melhores vagas para você. Fique de olho!</p>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'Candidaturas' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {myApplications.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <Briefcase size={40} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">Candidaturas Vazias</h3>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest italic">Você ainda não se aplicou para nenhuma vaga.</p>
                </div>
              ) : (
                myApplications.map((app, i) => {
                  const job = vacancies.find(v => v.id === app.job_id);
                  const appDate = app.created_at 
                    ? new Date(app.created_at).toLocaleDateString('pt-BR') 
                    : 'Recentemente';

                  const currentStatus = app.status || 'Triagem';
                  
                  // Retrieve the custom stages list from the vacancy description or stages column
                  const parsedStagesFromDesc = (() => {
                    if (job?.description && job.description.includes('===ETAPAS_JSON===')) {
                      try {
                        const part = job.description.split('===ETAPAS_JSON===')[1].split('===FIM_ETAPAS===')[0];
                        return JSON.parse(part);
                      } catch (e) {
                        console.error('Error parsing stages from description:', e);
                      }
                    }
                    return null;
                  })();

                  const stagesList: string[] = parsedStagesFromDesc || (Array.isArray(job?.stages) 
                    ? job.stages 
                    : (typeof job?.stages === 'string' 
                        ? JSON.parse(job.stages) 
                        : ['Análise de Currículo', 'Entrevista', 'Teste Técnico']));

                  const firstStageName = stagesList[0] || 'Triagem';
                  const normalizedStatus = (currentStatus === 'Triagem') ? firstStageName : currentStatus;

                  let statusColorClass = 'text-primary-600 bg-primary-50';
                  if (normalizedStatus === 'Contratado') {
                    statusColorClass = 'text-emerald-600 bg-emerald-50';
                  } else if (normalizedStatus === 'Reprovado') {
                    statusColorClass = 'text-rose-600 bg-rose-50';
                  } else if (normalizedStatus === 'Entrevista') {
                    statusColorClass = 'text-indigo-600 bg-indigo-50';
                  } else if (normalizedStatus === 'Testes') {
                    statusColorClass = 'text-sky-600 bg-sky-50 border border-sky-100/60';
                  }

                  return (
                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sleek border border-white flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-sm">
                          <CheckCircle2 size={28} />
                        </div>
                        <div className="text-left">
                          <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-1">{job?.title || 'Candidatura Enviada'}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status:</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${statusColorClass}`}>
                              {normalizedStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Enviado em</p>
                          <p className="text-xs font-bold text-slate-600">{appDate}</p>
                        </div>
                        {job && (
                          <button 
                            onClick={() => setSelectedJobForDetails(job)}
                            className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Ver Detalhes
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          ) : activeTab === 'Testes' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {(() => {
                const getDiscStatusForApp = (app: any) => {
                  const phoneVal = app.candidate_phone || '';
                  let discVal = '';
                  if (phoneVal.includes('===DISC===')) {
                    discVal = phoneVal.split('===DISC===')[1].split('===NOTES===')[0].split('===QUESTIONS===')[0].trim();
                  }
                  if (discVal) {
                    if (discVal === 'PENDING') {
                      return { status: 'PENDING', D: 0, I: 0, S: 0, C: 0 };
                    }
                    if (discVal.startsWith('COMPLETED===')) {
                      const scores = discVal.replace('COMPLETED===', '').split(',').map(Number);
                      return { 
                        status: 'COMPLETED', 
                        D: scores[0] || 0, 
                        I: scores[1] || 0, 
                        S: scores[2] || 0, 
                        C: scores[3] || 0 
                      };
                    }
                  }
                  return { status: 'NONE', D: 0, I: 0, S: 0, C: 0 };
                };

                const getQuestionsStatusForApp = (app: any) => {
                  const phoneVal = app.candidate_phone || '';
                  let questionsVal = '';
                  if (phoneVal.includes('===QUESTIONS===')) {
                    questionsVal = phoneVal.split('===QUESTIONS===')[1].split('===DISC===')[0].split('===NOTES===')[0].trim();
                  }
                  if (questionsVal) {
                    if (questionsVal === 'PENDING') {
                      return { status: 'PENDING', answers: null };
                    }
                    if (questionsVal.startsWith('COMPLETED===')) {
                      try {
                        const jsonStr = questionsVal.replace('COMPLETED===', '').trim();
                        const answers = JSON.parse(jsonStr);
                        return { status: 'COMPLETED', answers };
                      } catch (err) {
                        console.error('Erro ao fazer parse do JSON de respostas:', err);
                        return { status: 'NONE', answers: null };
                      }
                    }
                  }
                  return { status: 'NONE', answers: null };
                };

                const getMbtiStatusForApp = (app: any) => {
                  const parsed = parseCandidatePhoneData(app.candidate_phone || '');
                  const mbtiVal = parsed.mbti;
                  if (mbtiVal) {
                    if (mbtiVal === 'PENDING') {
                      return { status: 'PENDING', type: '', scores: null, answers: null };
                    }
                    if (mbtiVal.startsWith('COMPLETED===')) {
                      try {
                        const jsonStr = mbtiVal.replace('COMPLETED===', '').trim();
                        const data = JSON.parse(jsonStr);
                        return { 
                          status: 'COMPLETED', 
                          type: data.type, 
                          scores: data.scores, 
                          answers: data.answers 
                        };
                      } catch (err) {
                        console.error('Erro ao fazer parse do JSON de MBTI:', err);
                        return { status: 'NONE', type: '', scores: null, answers: null };
                      }
                    }
                  }
                  return { status: 'NONE', type: '', scores: null, answers: null };
                };

                const getTemperamentosStatusForApp = (app: any) => {
                  const parsed = parseCandidatePhoneData(app.candidate_phone || '');
                  const tempVal = parsed.temperamentos;
                  if (tempVal) {
                    if (tempVal === 'PENDING') {
                      return { status: 'PENDING', type: '', scores: null, answers: null };
                    }
                    if (tempVal.startsWith('COMPLETED===')) {
                      try {
                        const jsonStr = tempVal.replace('COMPLETED===', '').trim();
                        const data = JSON.parse(jsonStr);
                        return { 
                          status: 'COMPLETED', 
                          type: data.type, 
                          scores: data.scores, 
                          answers: data.answers 
                        };
                      } catch (err) {
                        console.error('Erro ao fazer parse do JSON de Temperamentos:', err);
                        return { status: 'NONE', type: '', scores: null, answers: null };
                      }
                    }
                  }
                  return { status: 'NONE', type: '', scores: null, answers: null };
                };

                // Lógica de agrupamento unificado de testes
                const pendingTests: Array<{
                  id: string;
                  type: 'DISC' | 'QUESTIONS' | 'MBTI' | 'TEMPERAMENTOS' | 'CUSTOM';
                  app: any;
                  jobTitle: string;
                  companyName: string;
                }> = [];

                const completedTests: Array<{
                  id: string;
                  type: 'DISC' | 'QUESTIONS' | 'MBTI' | 'TEMPERAMENTOS' | 'CUSTOM';
                  app: any;
                  jobTitle: string;
                  companyName: string;
                  data: any;
                }> = [];

                myApplications.forEach(app => {
                  const job = vacancies.find(v => v.id === app.job_id);
                  const jobTitle = job?.title || 'Oportunidade';
                  const companyName = job?.company_name || 'Empresa Parceira';

                  const discStatus = getDiscStatusForApp(app);
                  if (discStatus.status === 'PENDING') {
                    pendingTests.push({
                      id: `${app.id}-DISC`,
                      type: 'DISC',
                      app,
                      jobTitle,
                      companyName
                    });
                  } else if (discStatus.status === 'COMPLETED') {
                    completedTests.push({
                      id: `${app.id}-DISC`,
                      type: 'DISC',
                      app,
                      jobTitle,
                      companyName,
                      data: discStatus
                    });
                  }

                  const questionsStatus = getQuestionsStatusForApp(app);
                  if (questionsStatus.status === 'PENDING') {
                    pendingTests.push({
                      id: `${app.id}-QUESTIONS`,
                      type: 'QUESTIONS',
                      app,
                      jobTitle,
                      companyName
                    });
                  } else if (questionsStatus.status === 'COMPLETED') {
                    completedTests.push({
                      id: `${app.id}-QUESTIONS`,
                      type: 'QUESTIONS',
                      app,
                      jobTitle,
                      companyName,
                      data: questionsStatus.answers
                    });
                  }

                  const mbtiStatus = getMbtiStatusForApp(app);
                  if (mbtiStatus.status === 'PENDING') {
                    pendingTests.push({
                      id: `${app.id}-MBTI`,
                      type: 'MBTI',
                      app,
                      jobTitle,
                      companyName
                    });
                  } else if (mbtiStatus.status === 'COMPLETED') {
                    completedTests.push({
                      id: `${app.id}-MBTI`,
                      type: 'MBTI',
                      app,
                      jobTitle,
                      companyName,
                      data: mbtiStatus
                    });
                  }

                  const temperamentosStatus = getTemperamentosStatusForApp(app);
                  if (temperamentosStatus.status === 'PENDING') {
                    pendingTests.push({
                      id: `${app.id}-TEMPERAMENTOS`,
                      type: 'TEMPERAMENTOS',
                      app,
                      jobTitle,
                      companyName
                    });
                  } else if (temperamentosStatus.status === 'COMPLETED') {
                    completedTests.push({
                      id: `${app.id}-TEMPERAMENTOS`,
                      type: 'TEMPERAMENTOS',
                      app,
                      jobTitle,
                      companyName,
                      data: temperamentosStatus
                    });
                  }

                  const customTestStatus = getCustomTestStatusForApp(app);
                  if (customTestStatus.status === 'PENDING') {
                    pendingTests.push({
                      id: `${app.id}-CUSTOM`,
                      type: 'CUSTOM',
                      app,
                      jobTitle,
                      companyName
                    });
                  } else if (customTestStatus.status === 'COMPLETED') {
                    completedTests.push({
                      id: `${app.id}-CUSTOM`,
                      type: 'CUSTOM',
                      app,
                      jobTitle,
                      companyName,
                      data: customTestStatus.answers
                    });
                  }
                });

                if (discTestState === 'taking') {
                  const block = perguntasDISC[currentBlockIndex];
                  const currentAns = discAnswers[currentBlockIndex] || { D: null, I: null, S: null, C: null };
                  const isBlockValid = currentAns.D !== null && currentAns.I !== null && currentAns.S !== null && currentAns.C !== null;

                  const handleSelectRank = (factorKey: 'D' | 'I' | 'S' | 'C', rank: number) => {
                    setDiscAnswers(prev => prev.map((ans, idx) => {
                      if (idx !== currentBlockIndex) return ans;
                      
                      let previousFactorForRank: 'D' | 'I' | 'S' | 'C' | null = null;
                      if (ans.D === rank) previousFactorForRank = 'D';
                      else if (ans.I === rank) previousFactorForRank = 'I';
                      else if (ans.S === rank) previousFactorForRank = 'S';
                      else if (ans.C === rank) previousFactorForRank = 'C';

                      const currentFactorOldRank = ans[factorKey];

                      const newAns = { ...ans };
                      newAns[factorKey] = rank;

                      if (previousFactorForRank && previousFactorForRank !== factorKey) {
                        newAns[previousFactorForRank] = currentFactorOldRank;
                      }

                      return newAns;
                    }));
                  };

                  const factorsList: Array<{ key: 'D' | 'I' | 'S' | 'C'; text: string }> = [
                    { key: 'D', text: block.opcoes.D },
                    { key: 'I', text: block.opcoes.I },
                    { key: 'S', text: block.opcoes.S },
                    { key: 'C', text: block.opcoes.C }
                  ];

                  return (
                    <div className="bg-white p-8 rounded-[3rem] shadow-sleek border border-white max-w-3xl mx-auto animate-fade-in">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                            Pergunta {currentBlockIndex + 1} de 25
                          </span>
                        </div>
                        <span className="text-xs font-black text-slate-400">
                          {Math.round(((currentBlockIndex + 1) / 25) * 100)}% Concluído
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-600 to-indigo-600 transition-all duration-300"
                          style={{ width: `${((currentBlockIndex + 1) / 25) * 100}%` }}
                        />
                      </div>

                      <div className="mb-8 text-left">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Situação</span>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">
                          {block.pergunta}
                        </h3>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          Atribua notas de <span className="text-primary-600">4 a 1</span> para as alternativas abaixo:<br />
                          <span className="font-extrabold text-slate-700">4</span> = mais se parece comigo • <span className="font-extrabold text-slate-700">3</span> = segunda que mais se parece • <span className="font-extrabold text-slate-700">2</span> = terceira • <span className="font-extrabold text-slate-700">1</span> = menos se parece comigo.
                          <br /><span className="text-[10px] text-indigo-500 font-extrabold mt-1 block">✓ O sistema troca as notas automaticamente se você escolher uma nota já atribuída!</span>
                        </p>
                      </div>

                      {discErrorMessage && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold mb-6 text-left">
                          {discErrorMessage}
                        </div>
                      )}

                      <div className="space-y-4 mb-10">
                        {/* Legend headers for desktop view */}
                        <div className="justify-end gap-3 px-4 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:flex">
                          <div className="w-10 text-center">Mais (4)</div>
                          <div className="w-10 text-center">2ª (3)</div>
                          <div className="w-10 text-center">3ª (2)</div>
                          <div className="w-10 text-center">Menos (1)</div>
                        </div>

                        {factorsList.map((factor) => {
                          const val = currentAns[factor.key];

                          return (
                            <div key={factor.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-all gap-4">
                              <span className="font-extrabold text-slate-800 text-sm text-left sm:max-w-[60%] leading-snug">
                                {factor.text}
                              </span>
                              <div className="flex gap-2.5 self-end sm:self-auto">
                                {[4, 3, 2, 1].map((r) => {
                                  const isActive = val === r;
                                  let activeClass = '';
                                  if (r === 4) activeClass = 'bg-emerald-500 text-white shadow-md shadow-emerald-100';
                                  else if (r === 3) activeClass = 'bg-indigo-500 text-white shadow-md shadow-indigo-100';
                                  else if (r === 2) activeClass = 'bg-violet-500 text-white shadow-md shadow-violet-100';
                                  else if (r === 1) activeClass = 'bg-rose-500 text-white shadow-md shadow-rose-100';

                                  return (
                                    <button
                                      key={r}
                                      type="button"
                                      onClick={() => handleSelectRank(factor.key, r)}
                                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center border ${
                                        isActive 
                                          ? `${activeClass} border-transparent scale-105` 
                                          : 'bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-slate-150 shadow-sm'
                                      }`}
                                    >
                                      {r}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => currentBlockIndex > 0 && setCurrentBlockIndex(prev => prev - 1)}
                          disabled={currentBlockIndex === 0}
                          className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-all"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isBlockValid) {
                              setDiscErrorMessage("Por favor, atribua notas de 4 a 1 para todas as alternativas da pergunta.");
                              return;
                            }
                            setDiscErrorMessage(null);
                            if (currentBlockIndex < 24) {
                              setCurrentBlockIndex(prev => prev + 1);
                            } else {
                              handleFinishDISCTest();
                            }
                          }}
                          className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all ${
                            isBlockValid
                              ? 'bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 active:scale-95 shadow-primary-100'
                              : 'bg-slate-300 cursor-not-allowed shadow-none'
                          }`}
                        >
                          {currentBlockIndex === 24 ? 'Finalizar Teste' : 'Próxima Questão'}
                        </button>
                      </div>
                    </div>
                  );
                }

                if (discTestState === 'initial') {
                  return (
                    <div className="bg-white p-10 rounded-[3rem] shadow-sleek border border-white max-w-2xl mx-auto text-center animate-fade-in">
                      <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <Brain size={44} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Teste de Perfil Comportamental DISC 5.0</h2>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-md mx-auto">
                        Este teste mapeia suas características comportamentais em quatro dimensões: <strong>Dominância</strong>, <strong>Influência</strong>, <strong>Estabilidade</strong> e <strong>Conformidade</strong>. 
                        Com isso, conseguimos entender melhor seus pontos fortes e como você se comunica no trabalho.
                      </p>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-10 space-y-3">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Instruções Importantes:</h4>
                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-5 font-semibold">
                          <li>O teste é composto por 24 blocos com 4 adjetivos cada.</li>
                          <li>Em cada bloco, marque a opção que <strong>mais (M)</strong> o descreve e a que <strong>menos (N)</strong> o descreve.</li>
                          <li>Seja honesto e responda pensando em como você age no ambiente de trabalho.</li>
                          <li>Não há perfil certo ou errado. Todos possuem um valor único!</li>
                        </ul>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => setDiscTestState('none')}
                          className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDiscAnswers(Array.from({ length: 25 }, () => ({ D: null, I: null, S: null, C: null })));
                            setCurrentBlockIndex(0);
                            setDiscTestState('taking');
                          }}
                          className="px-10 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary-500/10 hover:-translate-y-0.5 active:scale-95"
                        >
                          Começar Avaliação
                        </button>
                      </div>
                    </div>
                  );
                }

                if (discTestState === 'completed' && discResult) {
                  const { D, I, S, C } = discResult;
                  const scoresList = [
                    { key: 'D' as const, label: 'Dominância (D)', val: D, color: 'bg-rose-500', textColor: 'text-rose-600', classColor: 'text-rose-600 bg-rose-50 border-rose-100', profile: perfisDISC.D },
                    { key: 'I' as const, label: 'Influência (I)', val: I, color: 'bg-indigo-500', textColor: 'text-indigo-600', classColor: 'text-indigo-600 bg-indigo-50 border-indigo-100', profile: perfisDISC.I },
                    { key: 'S' as const, label: 'Estabilidade (S)', val: S, color: 'bg-emerald-500', textColor: 'text-emerald-600', classColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', profile: perfisDISC.S },
                    { key: 'C' as const, label: 'Conformidade (C)', val: C, color: 'bg-amber-500', textColor: 'text-amber-600', classColor: 'text-amber-600 bg-amber-50 border-amber-100', profile: perfisDISC.C }
                  ];

                  const sortedScores = [...scoresList].sort((a, b) => b.val - a.val);
                  const predominant = sortedScores[0];
                  const secondary = sortedScores[1];

                  // Combination Logic
                  const k1 = predominant.key;
                  const k2 = secondary.key;
                  let combinationText = "";
                  if ((k1 === 'D' && k2 === 'I') || (k1 === 'I' && k2 === 'D')) {
                    combinationText = "Líder comunicador, persuasivo e competitivo.";
                  } else if ((k1 === 'D' && k2 === 'C') || (k1 === 'C' && k2 === 'D')) {
                    combinationText = "Estratégico, exigente e focado em alta performance.";
                  } else if ((k1 === 'I' && k2 === 'S') || (k1 === 'S' && k2 === 'I')) {
                    combinationText = "Comunicador empático e colaborativo.";
                  } else if ((k1 === 'S' && k2 === 'C') || (k1 === 'C' && k2 === 'S')) {
                    combinationText = "Organizado, confiável e analítico.";
                  } else if ((k1 === 'D' && k2 === 'S') || (k1 === 'S' && k2 === 'D')) {
                    combinationText = "Liderança equilibrada e firme.";
                  } else if ((k1 === 'I' && k2 === 'C') || (k1 === 'C' && k2 === 'I')) {
                    combinationText = "Criativo com pensamento analítico.";
                  }

                  const getClassificationBand = (v: number) => {
                    if (v <= 39) return { label: "Baixa tendência", color: "text-slate-400 bg-slate-50 border-slate-200" };
                    if (v <= 69) return { label: "Tendência moderada", color: "text-amber-600 bg-amber-50 border-amber-200" };
                    return { label: "Perfil muito forte e predominante", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
                  };

                  return (
                    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-4xl mx-auto space-y-8 text-left">
                      <div className="text-center">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Avaliação Concluída com Sucesso!</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Seu Relatório de Perfil DISC 5.0 está pronto</p>
                      </div>

                      {/* Resumo dos Perfis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-6 rounded-[2rem] border ${predominant.classColor}`}>
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Perfil Predominante</span>
                          <h3 className="text-xl font-black tracking-tight mt-1">{predominant.profile.nome}</h3>
                          <p className="text-xs font-semibold leading-relaxed mt-2 opacity-90">{predominant.profile.desc}</p>
                        </div>
                        <div className={`p-6 rounded-[2rem] border ${secondary.classColor}`}>
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Perfil Secundário</span>
                          <h3 className="text-xl font-black tracking-tight mt-1">{secondary.profile.nome}</h3>
                          <p className="text-xs font-semibold leading-relaxed mt-2 opacity-90">{secondary.profile.desc}</p>
                        </div>
                      </div>

                      {/* Combinação de Perfil */}
                      {combinationText && (
                        <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] text-left">
                          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Combinação de Perfil</span>
                          <h4 className="text-md font-black text-indigo-950 mt-1">{predominant.profile.label} + {secondary.profile.label}</h4>
                          <p className="text-xs font-bold text-indigo-800/90 mt-1 leading-relaxed">{combinationText}</p>
                        </div>
                      )}

                      {/* Gráfico e Classificação */}
                      <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-[2.5rem] space-y-6">
                        <h3 className="text-md font-black text-slate-900 tracking-tight">Equilíbrio dos Fatores (DISC)</h3>
                        <div className="space-y-5">
                          {scoresList.map(f => {
                            const band = getClassificationBand(f.val);
                            return (
                              <div key={f.key} className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                                  <div className="flex items-center gap-2">
                                    <span className="font-black uppercase tracking-wider">{f.label}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${band.color}`}>
                                      {band.label}
                                    </span>
                                  </div>
                                  <span className="font-black text-xs text-slate-900">{f.val}%</span>
                                </div>
                                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${f.val}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`h-full ${f.color} rounded-full`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detalhes do Perfil Predominante */}
                      <div className="border border-slate-100 rounded-[2.5rem] p-6 space-y-6 bg-white shadow-sm">
                        <h3 className="text-md font-black text-slate-900 tracking-tight">Detalhamento Comportamental: {predominant.profile.label}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Características Principais</span>
                            <div className="flex flex-wrap gap-1.5">
                              {predominant.profile.caracteristicas.map((c, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Pontos Fortes</span>
                            <ul className="space-y-1.5">
                              {predominant.profile.pontosFortes.map((pf, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                                  <span className="text-emerald-500 font-extrabold mt-0.5">•</span>
                                  <span>{pf}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Pontos de Atenção</span>
                            <ul className="space-y-1.5">
                              {predominant.profile.pontosAtencao.map((pa, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                                  <span className="text-amber-500 font-extrabold mt-0.5">•</span>
                                  <span>{pa}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Motivadores</span>
                            <ul className="space-y-1.5">
                              {predominant.profile.motivadores.map((m, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                                  <span className="text-indigo-500 font-extrabold mt-0.5">•</span>
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2 md:col-span-2 border-t border-slate-50 pt-4 mt-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">Comportamento Sob Pressão</span>
                            <ul className="space-y-1.5 mt-1">
                              {predominant.profile.sobPressao.map((sp, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                                  <span className="text-rose-500 font-extrabold mt-0.5">•</span>
                                  <span>{sp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setDiscTestState('none');
                            setDiscResult(null);
                          }}
                          className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-200"
                        >
                          Voltar para Testes
                        </button>
                      </div>
                    </div>
                  );
                }

                if (questionsState === 'initial') {
                  return (
                    <div className="bg-white p-10 rounded-[3rem] shadow-sleek border border-white max-w-2xl mx-auto text-center animate-fade-in">
                      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xs" style={{ color: '#533af6', backgroundColor: 'rgba(83, 58, 246, 0.08)' }}>
                        <FileText size={44} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Mapeamento de Perfil</h2>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-md mx-auto">
                        Este teste de mapeamento de perfil foi solicitado pela empresa parceira para entender melhor sua trajetória profissional, conquistas, capacidade de entrega e competências comportamentais.
                      </p>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-10 space-y-3">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Instruções Importantes:</h4>
                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-5 font-semibold">
                          <li>O mapeamento é composto por 20 perguntas de cunho descritivo.</li>
                          <li>Está dividido em 4 categorias temáticas (5 perguntas em cada).</li>
                          <li>Cada resposta deve ter no mínimo <strong>10 caracteres</strong> para ser válida.</li>
                          <li>Você pode avançar entre as páginas após preencher as perguntas da etapa atual.</li>
                          <li>Suas respostas ajudam o recrutador a avaliar seu alinhamento com a cultura da vaga. Dedique um tempo para detalhar suas respostas.</li>
                        </ul>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => setQuestionsState('none')}
                          className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const initialAnswers: Record<number, string> = {};
                            for (let i = 0; i < 20; i++) {
                              initialAnswers[i] = questionsAnswers[i] || '';
                            }
                            setQuestionsAnswers(initialAnswers);
                            setCurrentQuestionsCategoryIndex(0);
                            setQuestionsState('taking');
                          }}
                          className="px-10 py-3.5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5 active:scale-95"
                          style={{ backgroundColor: '#533af6', boxShadow: '0 8px 16px rgba(83, 58, 246, 0.15)' }}
                        >
                          Começar Mapeamento
                        </button>
                      </div>
                    </div>
                  );
                }

                if (questionsState === 'taking') {
                  const categoriesKeys = ['EXPERIENCE', 'CONTRIBUTION', 'TEAMWORK', 'BEHAVIORAL'] as const;
                  const currentCategoryKey = categoriesKeys[currentQuestionsCategoryIndex];
                  const currentCategory = QUESTIONS_CATEGORIES[currentCategoryKey];
                  const startIndex = currentQuestionsCategoryIndex * 5;

                  const handleAnswerChange = (globalIdx: number, val: string) => {
                    setQuestionsAnswers(prev => ({
                      ...prev,
                      [globalIdx]: val
                    }));
                  };

                  const progressPercent = Math.round(((currentQuestionsCategoryIndex + 1) / 4) * 100);

                  const handleNextStep = () => {
                    let hasError = false;
                    let firstErrorIdx = -1;

                    for (let i = startIndex; i < startIndex + 5; i++) {
                      const ans = questionsAnswers[i] || '';
                      if (ans.trim().length < 10) {
                        hasError = true;
                        firstErrorIdx = i;
                        break;
                      }
                    }

                    if (hasError) {
                      const localIdx = firstErrorIdx - startIndex + 1;
                      setQuestionsErrorMessage(`Por favor, responda a pergunta ${localIdx} da categoria atual de forma detalhada (mínimo 10 caracteres).`);
                      return;
                    }

                    setQuestionsErrorMessage(null);
                    if (currentQuestionsCategoryIndex < 3) {
                      setCurrentQuestionsCategoryIndex(prev => prev + 1);
                    } else {
                      handleFinishQuestions();
                    }
                  };

                  const handlePrevStep = () => {
                    setQuestionsErrorMessage(null);
                    if (currentQuestionsCategoryIndex > 0) {
                      setCurrentQuestionsCategoryIndex(prev => prev - 1);
                    } else {
                      setQuestionsState('initial');
                    }
                  };

                  return (
                    <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-sleek border border-white max-w-3xl mx-auto animate-fade-in text-left">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest" style={{ backgroundColor: '#533af6' }}>
                            Etapa {currentQuestionsCategoryIndex + 1} de 4
                          </span>
                          <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-2">
                            {currentCategory.title}
                          </h3>
                        </div>
                        <span className="text-xs font-black text-slate-400">
                          {progressPercent}% Concluído
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%`, backgroundColor: '#533af6' }}
                        />
                      </div>

                      {questionsErrorMessage && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold mb-6">
                          {questionsErrorMessage}
                        </div>
                      )}

                      <div className="space-y-6 mb-8">
                        {currentCategory.questions.map((questionText, idx) => {
                          const globalIdx = startIndex + idx;
                          const answerText = questionsAnswers[globalIdx] || '';
                          const charCount = answerText.trim().length;

                          return (
                            <div key={globalIdx} className="p-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 space-y-3">
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: '#533af6' }}>
                                  {globalIdx + 1}
                                </span>
                                <p className="font-extrabold text-slate-800 text-sm leading-snug">
                                  {questionText}
                                </p>
                              </div>
                              
                              <textarea
                                value={answerText}
                                onChange={(e) => handleAnswerChange(globalIdx, e.target.value)}
                                placeholder="Digite sua resposta aqui de forma detalhada..."
                                className="w-full min-h-[100px] p-4 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#533af6] focus:ring-1 focus:ring-[#533af6] transition-all resize-none shadow-xs"
                                maxLength={2000}
                              />
                              
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className={charCount >= 10 ? "text-emerald-600" : "text-slate-400"}>
                                  {charCount >= 10 ? "✓ Resposta válida" : "Mínimo 10 caracteres necessários"}
                                </span>
                                <span className="text-slate-400">
                                  {charCount} / 2000 caracteres
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                        >
                          Anterior
                        </button>
                        
                        <button
                          type="button"
                          disabled={isSavingQuestions}
                          onClick={handleNextStep}
                          className="px-8 py-3.5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50"
                          style={{ 
                            backgroundColor: '#533af6', 
                            boxShadow: '0 8px 16px rgba(83, 58, 246, 0.15)' 
                          }}
                        >
                          {isSavingQuestions ? (
                            <>
                              <Loader2 size={12} className="animate-spin" /> Salvando...
                            </>
                          ) : (
                            currentQuestionsCategoryIndex === 3 ? 'Finalizar e Enviar' : 'Próxima Etapa'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }

                if (questionsState === 'completed' && selectedQuestionsResult) {
                  const categoriesKeys = ['EXPERIENCE', 'CONTRIBUTION', 'TEAMWORK', 'BEHAVIORAL'] as const;
                  const currentCategoryKey = categoriesKeys[currentQuestionsCategoryIndex];
                  const currentCategory = QUESTIONS_CATEGORIES[currentCategoryKey];
                  const startIndex = currentQuestionsCategoryIndex * 5;

                  return (
                    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-4xl mx-auto space-y-8 text-left">
                      <div className="text-center">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Mapeamento de Perfil Enviado!</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Suas respostas do mapeamento de perfil profissional estão gravadas</p>
                      </div>

                      {/* Seletor de Categorias por Abas (Muito Premium e Harmonioso) */}
                      <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5 rounded-2xl gap-2 overflow-x-auto scrollbar-none">
                        {categoriesKeys.map((catKey, idx) => {
                          const cat = QUESTIONS_CATEGORIES[catKey];
                          const isActive = currentQuestionsCategoryIndex === idx;
                          return (
                            <button
                              key={catKey}
                              type="button"
                              onClick={() => setCurrentQuestionsCategoryIndex(idx)}
                              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-1 ${
                                isActive
                                  ? 'bg-white text-slate-900 shadow-xs border border-slate-100'
                                  : 'text-slate-400 hover:text-slate-700'
                              }`}
                              style={isActive ? { borderLeft: '3px solid #533af6' } : {}}
                            >
                              {cat.title}
                            </button>
                          );
                        })}
                      </div>

                      {/* Lista de perguntas e respostas correspondente à aba ativa */}
                      <div className="space-y-4">
                        {currentCategory.questions.map((questionText, idx) => {
                          const globalIdx = startIndex + idx;
                          const answerText = selectedQuestionsResult[globalIdx] || selectedQuestionsResult[globalIdx.toString()] || 'Nenhuma resposta gravada.';

                          return (
                            <div key={globalIdx} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 space-y-3">
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: '#533af6' }}>
                                  {globalIdx + 1}
                                </span>
                                <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
                                  {questionText}
                                </h4>
                              </div>
                              <div className="p-4 bg-white border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-line shadow-xs">
                                {answerText}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-center pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setQuestionsState('none');
                            setSelectedQuestionsResult(null);
                          }}
                          className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-200"
                        >
                          Voltar para Testes
                        </button>
                      </div>
                    </div>
                  );
                }

                if (mbtiState === 'initial') {
                  return (
                    <div className="bg-white p-10 rounded-[3rem] shadow-sleek border border-white max-w-2xl mx-auto text-center animate-fade-in">
                      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xs text-primary-600" style={{ color: '#533af6', backgroundColor: 'rgba(83, 58, 246, 0.08)' }}>
                        <Sparkles size={44} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Teste de Personalidade MBTI</h2>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-md mx-auto">
                        Este teste baseia-se na teoria dos tipos psicológicos de Carl Jung e no indicador MBTI.
                        Ele identifica suas preferências em 4 dimensões básicas: Extroversão/Introversão, Sensação/Intuição, Pensamento/Sentimento e Julgamento/Percepção, revelando um perfil de 4 letras.
                      </p>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-10 space-y-3">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Instruções Importantes:</h4>
                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-5 font-semibold">
                          <li>O teste é composto por <strong>64 perguntas</strong> divididas em <strong>8 etapas</strong> (8 perguntas por etapa).</li>
                          <li>Em cada pergunta, atribua uma nota de <strong>0 a 3</strong> para ambas as alternativas (Opção A e Opção B).</li>
                          <li>A escala de avaliação é:
                            <br />• <strong>3</strong> = se parece muito comigo
                            <br />• <strong>2</strong> = se parece razoavelmente
                            <br />• <strong>1</strong> = se parece pouco
                            <br />• <strong>0</strong> = não se parece nada comigo
                          </li>
                          <li>Você avalia cada alternativa independentemente. Seja o mais espontâneo e sincero possível!</li>
                        </ul>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => setMbtiState('none')}
                          className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMbtiAnswers({});
                            setCurrentMbtiStageIndex(0);
                            setMbtiState('taking');
                          }}
                          className="px-10 py-3.5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5 active:scale-95"
                          style={{ backgroundColor: '#533af6', boxShadow: '0 8px 16px rgba(83, 58, 246, 0.15)' }}
                        >
                          Começar Teste MBTI
                        </button>
                      </div>
                    </div>
                  );
                }

                if (mbtiState === 'taking') {
                  const stageQuestions = MBTI_QUESTIONS.slice(currentMbtiStageIndex * 8, (currentMbtiStageIndex + 1) * 8);
                  const progressPercent = Math.round(((currentMbtiStageIndex + 1) / 8) * 100);

                  const handleSelectMbtiScore = (qId: number, option: 'a' | 'b', score: number) => {
                    setMbtiAnswers(prev => ({
                      ...prev,
                      [qId]: {
                        a: option === 'a' ? score : (prev[qId]?.a ?? null),
                        b: option === 'b' ? score : (prev[qId]?.b ?? null)
                      }
                    }));
                  };

                  return (
                    <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-sleek border border-white max-w-3xl mx-auto animate-fade-in text-left">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest" style={{ backgroundColor: '#533af6' }}>
                            Etapa {currentMbtiStageIndex + 1} de 8
                          </span>
                          <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-2">
                            Avaliação de Dimensões de Personalidade (MBTI)
                          </h3>
                        </div>
                        <span className="text-xs font-black text-slate-400">
                          {progressPercent}% Concluído
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%`, backgroundColor: '#533af6' }}
                        />
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 text-[11px] font-semibold leading-relaxed mb-6">
                        Atribua notas de <strong>0 a 3</strong> para ambas as alternativas de cada pergunta:<br />
                        <span className="font-extrabold text-slate-700">3</span> = parece muito comigo • <span className="font-extrabold text-slate-700">2</span> = parece razoavelmente • <span className="font-extrabold text-slate-700">1</span> = parece pouco • <span className="font-extrabold text-slate-700">0</span> = não parece nada comigo
                      </div>

                      {mbtiErrorMessage && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold mb-6">
                          {mbtiErrorMessage}
                        </div>
                      )}

                      <div className="space-y-6 mb-8">
                        {stageQuestions.map((q) => {
                          const ans = mbtiAnswers[q.id] || { a: null, b: null };
                          return (
                            <div key={q.id} className="p-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 space-y-4">
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: '#533af6' }}>
                                  {q.id}
                                </span>
                                <p className="font-extrabold text-slate-800 text-sm leading-snug">
                                  {q.text}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Opção A */}
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
                                  <span className="text-xs font-semibold text-slate-700 leading-snug">{q.optionA.text}</span>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sua nota:</span>
                                    <div className="flex gap-1.5">
                                      {[0, 1, 2, 3].map((num) => {
                                        const isActive = ans.a === num;
                                        return (
                                          <button
                                            key={num}
                                            type="button"
                                            onClick={() => handleSelectMbtiScore(q.id, 'a', num)}
                                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all flex items-center justify-center border ${
                                              isActive 
                                                ? 'bg-[#533af6] text-white border-transparent scale-105 shadow-sm' 
                                                : 'bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-slate-150'
                                            }`}
                                          >
                                            {num}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* Opção B */}
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
                                  <span className="text-xs font-semibold text-slate-700 leading-snug">{q.optionB.text}</span>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sua nota:</span>
                                    <div className="flex gap-1.5">
                                      {[0, 1, 2, 3].map((num) => {
                                        const isActive = ans.b === num;
                                        return (
                                          <button
                                            key={num}
                                            type="button"
                                            onClick={() => handleSelectMbtiScore(q.id, 'b', num)}
                                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all flex items-center justify-center border ${
                                              isActive 
                                                ? 'bg-indigo-600 text-white border-transparent scale-105 shadow-sm' 
                                                : 'bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-slate-150'
                                            }`}
                                          >
                                            {num}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setMbtiErrorMessage(null);
                            if (currentMbtiStageIndex > 0) {
                              setCurrentMbtiStageIndex(prev => prev - 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              setMbtiState('initial');
                            }
                          }}
                          className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                        >
                          Anterior
                        </button>
                        
                        <button
                          type="button"
                          disabled={isSavingMbti}
                          onClick={() => {
                            let hasError = false;
                            let firstErrorId = -1;
                            const startIndex = currentMbtiStageIndex * 8;
                            const stageQs = MBTI_QUESTIONS.slice(startIndex, startIndex + 8);
                            
                            for (const q of stageQs) {
                              const qAns = mbtiAnswers[q.id];
                              if (!qAns || qAns.a === null || qAns.b === null) {
                                hasError = true;
                                firstErrorId = q.id;
                                break;
                              }
                            }

                            if (hasError) {
                              setMbtiErrorMessage(`Por favor, atribua notas de 0 a 3 para ambas as alternativas da pergunta ${firstErrorId}.`);
                              return;
                            }

                            setMbtiErrorMessage(null);
                            if (currentMbtiStageIndex < 7) {
                              setCurrentMbtiStageIndex(prev => prev + 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              handleFinishMBTITest();
                            }
                          }}
                          className="px-8 py-3.5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50"
                          style={{ 
                            backgroundColor: '#533af6', 
                            boxShadow: '0 8px 16px rgba(83, 58, 246, 0.15)' 
                          }}
                        >
                          {isSavingMbti ? (
                            <>
                              <Loader2 size={12} className="animate-spin" /> Salvando...
                            </>
                          ) : (
                            currentMbtiStageIndex === 7 ? 'Finalizar e Enviar' : 'Próxima Etapa'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }

                if (mbtiState === 'completed' && (mbtiResult || selectedMbtiResult)) {
                  const mbtiScores = mbtiResult?.scores || selectedMbtiResult?.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
                  const mbtiType = mbtiResult?.type || selectedMbtiResult?.type || "ISTJ";
                  const profile = MBTI_PROFILES[mbtiType] || MBTI_PROFILES.ISTJ;

                  const calcMbtiPercent = (valA: number, valB: number) => {
                    const total = valA + valB;
                    if (total === 0) return 50;
                    return Math.round((valA / total) * 100);
                  };

                  const pctE = calcMbtiPercent(mbtiScores.E, mbtiScores.I);
                  const pctI = 100 - pctE;

                  const pctS = calcMbtiPercent(mbtiScores.S, mbtiScores.N);
                  const pctN = 100 - pctS;

                  const pctT = calcMbtiPercent(mbtiScores.T, mbtiScores.F);
                  const pctF = 100 - pctT;

                  const pctJ = calcMbtiPercent(mbtiScores.J, mbtiScores.P);
                  const pctP = 100 - pctJ;

                  const dimensionsList = [
                    { leftLabel: "Extroversão (E)", rightLabel: "Introversão (I)", leftVal: pctE, rightVal: pctI, dominant: mbtiType[0] },
                    { leftLabel: "Sensação (S)", rightLabel: "Intuição (N)", leftVal: pctS, rightVal: pctN, dominant: mbtiType[1] },
                    { leftLabel: "Pensamento (T)", rightLabel: "Sentimento (F)", leftVal: pctT, rightVal: pctF, dominant: mbtiType[2] },
                    { leftLabel: "Julgamento (J)", rightLabel: "Percepção (P)", leftVal: pctJ, rightVal: pctP, dominant: mbtiType[3] }
                  ];

                  return (
                    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-4xl mx-auto space-y-8 text-left animate-fade-in">
                      <div className="text-center">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Avaliação MBTI Concluída!</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Seu Relatório de Personalidade está pronto</p>
                      </div>

                      {/* Resumo do Perfil */}
                      <div className={`p-8 rounded-[2.5rem] border ${profile.classColor} space-y-4`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Seu Tipo de Personalidade</span>
                            <h3 className="text-3xl font-black tracking-tight mt-1">{profile.nome}</h3>
                            <p className="text-sm font-extrabold opacity-95">{profile.titulo} • Categoria: {profile.categoria}</p>
                          </div>
                          <span className="px-6 py-2 bg-white/40 border border-white/60 rounded-full text-xs font-black uppercase tracking-widest shadow-xs">
                            {profile.categoria}
                          </span>
                        </div>
                        <div className="w-full h-px bg-slate-200/20" />
                        <p className="text-xs font-semibold leading-relaxed opacity-90">{profile.desc}</p>
                      </div>

                      {/* Gráfico de Dimensões Bilaterais */}
                      <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-[2.5rem] space-y-6">
                        <h3 className="text-md font-black text-slate-900 tracking-tight">Suas Dimensões de Personalidade</h3>
                        
                        <div className="space-y-6">
                          {dimensionsList.map((dim, idx) => {
                            const isLeftDom = dim.dominant === dim.leftLabel.substring(dim.leftLabel.indexOf('(') + 1, dim.leftLabel.indexOf(')'));
                            
                            return (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                                  <span className={isLeftDom ? 'text-primary-600 font-black' : 'text-slate-400'}>
                                    {dim.leftLabel} • {dim.leftVal}%
                                  </span>
                                  <span className={!isLeftDom ? 'text-indigo-600 font-black' : 'text-slate-400'}>
                                    {dim.rightVal}% • {dim.rightLabel}
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200/70 rounded-full h-3.5 overflow-hidden flex shadow-inner border border-slate-100">
                                  <div 
                                    className={`h-full transition-all duration-500 rounded-l-full ${isLeftDom ? 'bg-[#533af6]' : 'bg-slate-300'}`} 
                                    style={{ width: `${dim.leftVal}%` }} 
                                  />
                                  <div 
                                    className={`h-full transition-all duration-500 rounded-r-full ${!isLeftDom ? 'bg-indigo-500' : 'bg-slate-300'}`} 
                                    style={{ width: `${dim.rightVal}%` }} 
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Características, Pontos Fortes e Fracos */}
                      <div className="border border-slate-100 rounded-[2.5rem] p-6 space-y-6 bg-white shadow-sm">
                        <h3 className="text-md font-black text-slate-900 tracking-tight">Detalhamento Comportamental ({profile.nome})</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Características Principais</span>
                            <div className="flex flex-wrap gap-1.5">
                              {profile.caracteristicas.map((c, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Pontos Fortes</span>
                            <ul className="space-y-1.5">
                              {profile.pontosFortes.map((pf, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                                  <span className="text-emerald-500 font-extrabold mt-0.5">•</span>
                                  <span>{pf}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Pontos de Atenção</span>
                            <ul className="space-y-1.5">
                              {profile.pontosAtencao.map((pa, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-600 leading-snug">
                                  <span className="text-amber-500 font-extrabold mt-0.5">•</span>
                                  <span>{pa}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setMbtiState('none');
                            setMbtiResult(null);
                            setSelectedMbtiResult(null);
                          }}
                          className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-200"
                        >
                          Voltar para Testes
                        </button>
                      </div>
                    </div>
                  );
                }

                if (temperamentosState === 'initial') {
                  return (
                    <div className="bg-white p-10 rounded-[3rem] shadow-sleek border border-white max-w-2xl mx-auto text-center animate-fade-in">
                      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xs text-primary-600" style={{ color: '#533af6', backgroundColor: 'rgba(83, 58, 246, 0.08)' }}>
                        <Compass size={44} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Teste de Temperamentos e Perfil Comportamental</h2>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-md mx-auto">
                        Este teste mapeia suas preferências e estilo comportamental predominante com base em 4 perfis fundamentais:
                        Idealista/Criativo (I), Comunicador/Relacional (C), Organizador/Analítico (O) e Executor/Dominante (A).
                      </p>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-10 space-y-3">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Instruções Importantes:</h4>
                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-5 font-semibold">
                          <li>O teste é composto por <strong>25 perguntas</strong> divididas em <strong>5 etapas</strong> (5 perguntas por etapa).</li>
                          <li>Para cada pergunta, escolha <strong>apenas UMA</strong> alternativa que melhor descreve seu comportamento.</li>
                          <li>Não há respostas certas ou erradas. Responda de forma sincera e espontânea para obter um resultado fiel ao seu estilo natural!</li>
                        </ul>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => setTemperamentosState('none')}
                          className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTemperamentosAnswers({});
                            setCurrentTemperamentosStageIndex(0);
                            setTemperamentosState('taking');
                          }}
                          className="px-10 py-3.5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5 active:scale-95"
                          style={{ backgroundColor: '#533af6', boxShadow: '0 8px 16px rgba(83, 58, 246, 0.15)' }}
                        >
                          Começar Avaliação
                        </button>
                      </div>
                    </div>
                  );
                }

                if (temperamentosState === 'taking') {
                  const stageQuestions = TEMPERAMENTOS_QUESTIONS.slice(currentTemperamentosStageIndex * 5, (currentTemperamentosStageIndex + 1) * 5);
                  const progressPercent = Math.round(((currentTemperamentosStageIndex + 1) / 5) * 100);

                  const isStageCompleted = stageQuestions.every(q => temperamentosAnswers[q.id]);

                  const handleSelectTemperamentosAnswer = (qId: number, profileKey: string) => {
                    setTemperamentosAnswers(prev => ({
                      ...prev,
                      [qId]: profileKey
                    }));
                  };

                  return (
                    <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-sleek border border-white max-w-3xl mx-auto animate-fade-in text-left">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest" style={{ backgroundColor: '#533af6' }}>
                            Etapa {currentTemperamentosStageIndex + 1} de 5
                          </span>
                          <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-2">
                            Avaliação de Temperamentos e Perfil Comportamental
                          </h3>
                        </div>
                        <span className="text-xs font-black text-slate-400">
                          {progressPercent}% Concluído
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%`, backgroundColor: '#533af6' }}
                        />
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 text-[11px] font-semibold leading-relaxed mb-6">
                        Selecione <strong>uma alternativa</strong> para cada uma das perguntas abaixo representativas do seu perfil.
                      </div>

                      {temperamentosErrorMessage && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold mb-6">
                          {temperamentosErrorMessage}
                        </div>
                      )}

                      <div className="space-y-6 mb-8">
                        {stageQuestions.map((q) => {
                          const selectedAnswer = temperamentosAnswers[q.id];
                          return (
                            <div key={q.id} className="p-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 space-y-4">
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: '#533af6' }}>
                                  {q.id}
                                </span>
                                <p className="font-extrabold text-slate-800 text-sm leading-snug">
                                  {q.text}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(q.options).map(([profileKey, optionText]) => {
                                  const isSelected = selectedAnswer === profileKey;
                                  return (
                                    <button
                                      key={profileKey}
                                      type="button"
                                      onClick={() => handleSelectTemperamentosAnswer(q.id, profileKey)}
                                      className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all shadow-xs flex items-center gap-3 ${
                                        isSelected 
                                          ? 'bg-gradient-to-r from-primary-50 to-indigo-50 border-[#533af6] text-slate-800 scale-[1.01] ring-2 ring-[#533af6]/10' 
                                          : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600'
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        isSelected ? 'border-[#533af6] bg-[#533af6]' : 'border-slate-300 bg-white'
                                      }`}>
                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                      </div>
                                      <span className="leading-snug">{optionText}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setTemperamentosErrorMessage(null);
                            if (currentTemperamentosStageIndex > 0) {
                              setCurrentTemperamentosStageIndex(prev => prev - 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              setTemperamentosState('initial');
                            }
                          }}
                          className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                        >
                          Anterior
                        </button>
                        
                        <button
                          type="button"
                          disabled={!isStageCompleted || isSavingTemperamentos}
                          onClick={() => {
                            if (!isStageCompleted) {
                              setTemperamentosErrorMessage("Por favor, responda a todas as perguntas desta etapa antes de avançar.");
                              return;
                            }
                            setTemperamentosErrorMessage(null);
                            if (currentTemperamentosStageIndex < 4) {
                              setCurrentTemperamentosStageIndex(prev => prev + 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              handleFinishTemperamentosTest();
                            }
                          }}
                          className="px-8 py-3.5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ 
                            backgroundColor: '#533af6', 
                            boxShadow: '0 8px 16px rgba(83, 58, 246, 0.15)' 
                          }}
                        >
                          {isSavingTemperamentos ? (
                            <>
                              <Loader2 size={12} className="animate-spin" /> Salvando...
                            </>
                          ) : (
                            currentTemperamentosStageIndex === 4 ? 'Finalizar e Enviar' : 'Próxima Etapa'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }

                if (temperamentosState === 'completed' && (temperamentosResult || selectedTemperamentosResult)) {
                  const tResult = temperamentosResult || selectedTemperamentosResult;
                  const profileType = tResult.type;
                  const scores = tResult.scores || { I: 0, C: 0, O: 0, A: 0 };
                  const profile = TEMPERAMENTOS_PROFILES[profileType] || TEMPERAMENTOS_PROFILES.I;

                  const totalAnswers = scores.I + scores.C + scores.O + scores.A;
                  const calcPercent = (val: number) => {
                    if (totalAnswers === 0) return 0;
                    return Math.round((val / totalAnswers) * 100);
                  };

                  const listProfiles = [
                    { label: "Idealista / Criativo (I)", val: scores.I, pct: calcPercent(scores.I), color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                    { label: "Comunicador / Relacional (C)", val: scores.C, pct: calcPercent(scores.C), color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
                    { label: "Organizador / Analítico (O)", val: scores.O, pct: calcPercent(scores.O), color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                    { label: "Executor / Dominante (A)", val: scores.A, pct: calcPercent(scores.A), color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
                  ];

                  return (
                    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-4xl mx-auto space-y-8 text-left animate-fade-in">
                      <div className="text-center">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Avaliação de Perfil Concluída!</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Seu Relatório de Perfil Comportamental está pronto</p>
                      </div>

                      {/* Resumo do Perfil */}
                      <div className="p-8 rounded-[2.5rem] border border-primary-100 bg-gradient-to-r from-primary-50/20 to-indigo-50/20 space-y-4 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary-600">Seu Estilo Predominante</span>
                            <h3 className="text-3xl font-black tracking-tight mt-1 text-slate-900">{profile.name}</h3>
                            <p className="text-sm font-extrabold text-indigo-600 mt-0.5">{profile.title}</p>
                          </div>
                          <span className="px-6 py-2 bg-white border border-primary-200 rounded-full text-xs font-black uppercase tracking-widest text-primary-700 shadow-2xs">
                            {profileType}
                          </span>
                        </div>
                        <div className="w-full h-px bg-slate-200/50" />
                        <p className="text-xs font-semibold leading-relaxed text-slate-600">{profile.description}</p>
                      </div>

                      {/* Gráfico de Distribuição dos Temperamentos */}
                      <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-[2.5rem] space-y-6">
                        <h3 className="text-md font-black text-slate-900 tracking-tight">Distribuição dos Estilos</h3>
                        
                        <div className="space-y-4">
                          {listProfiles.map((item, idx) => (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                                <span>{item.label}</span>
                                <span className="font-black text-slate-900">{item.val} pts ({item.pct}%)</span>
                              </div>
                              <div className="w-full bg-slate-200/50 rounded-full h-3 overflow-hidden flex border border-slate-100">
                                <div 
                                  className="h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${item.pct}%`, backgroundColor: item.color }} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Características, Pontos Fortes e Fracos */}
                      <div className="border border-slate-100 rounded-[2.5rem] p-6 space-y-6 bg-white shadow-sm">
                        <h3 className="text-md font-black text-slate-900 tracking-tight">Detalhamento Comportamental</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Pontos Fortes</span>
                            <ul className="space-y-2">
                              {profile.strengths.map((pf, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-600 leading-snug">
                                  <span className="text-emerald-500 font-extrabold mt-0.5">•</span>
                                  <span>{pf}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Pontos de Atenção</span>
                            <ul className="space-y-2">
                              {profile.weaknesses.map((pa, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-600 leading-snug">
                                  <span className="text-amber-500 font-extrabold mt-0.5">•</span>
                                  <span>{pa}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Ambiente de Trabalho Ideal</span>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {profile.environments.map((env, i) => (
                                <span key={i} className="px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                                  {env}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setTemperamentosState('none');
                            setTemperamentosResult(null);
                            setSelectedTemperamentosResult(null);
                          }}
                          className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-200"
                        >
                          Voltar para Testes
                        </button>
                      </div>
                    </div>
                  );
                }

                if (customTestState === 'initial') {
                  return (
                    <div className="bg-white p-10 rounded-[3rem] shadow-sleek border border-white max-w-2xl mx-auto text-center animate-fade-in">
                      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xs" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                        <FileText size={44} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Questionário Customizado</h2>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-md mx-auto">
                        Este questionário foi elaborado especificamente pela equipe de recrutamento para entender melhor sua adequação aos requisitos específicos desta vaga.
                      </p>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-10 space-y-3">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Informações do Questionário:</h4>
                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-5 font-semibold">
                          <li>Total de perguntas: <strong>{customTestQuestions.length}</strong>.</li>
                          <li>Responda de forma objetiva e sincera.</li>
                          <li>Todas as perguntas são de preenchimento obrigatório.</li>
                          <li>Suas respostas serão encaminhadas diretamente aos recrutadores do processo seletivo.</li>
                        </ul>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => setCustomTestState('none')}
                          className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomTestState('taking')}
                          className="px-10 py-3.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 hover:-translate-y-0.5 active:scale-95"
                        >
                          Iniciar Questionário
                        </button>
                      </div>
                    </div>
                  );
                }

                if (customTestState === 'taking') {
                  return (
                    <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-sleek border border-white max-w-3xl mx-auto animate-fade-in text-left">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest bg-emerald-600">
                            Questionário da Vaga
                          </span>
                          <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-2">
                            Responda às perguntas abaixo
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 text-[11px] font-semibold leading-relaxed mb-6">
                        Por favor, responda a todas as perguntas com atenção. Perguntas de múltipla escolha exigem que você marque uma opção, e perguntas descritivas exigem um texto.
                      </div>

                      {customTestErrorMessage && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold mb-6">
                          {customTestErrorMessage}
                        </div>
                      )}

                      <div className="space-y-6 mb-8">
                        {customTestQuestions.map((q, idx) => {
                          const selectedAnswer = customTestAnswers[q.id] || '';
                          const isChoice = q.type === 'choice';

                          return (
                            <div key={q.id || idx} className="p-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 space-y-4">
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white bg-emerald-600 shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <p className="font-extrabold text-slate-800 text-sm leading-snug">
                                  {q.question}
                                </p>
                              </div>

                              {isChoice ? (
                                <div className="grid grid-cols-1 gap-3">
                                  {(q.options || []).map((option: string, optIdx: number) => {
                                    const isSelected = selectedAnswer === option;
                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        onClick={() => {
                                          setCustomTestAnswers(prev => ({
                                            ...prev,
                                            [q.id]: option
                                          }));
                                        }}
                                        className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all shadow-xs flex items-center gap-3 ${
                                          isSelected
                                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-500 text-slate-800 scale-[1.01] ring-2 ring-emerald-500/10'
                                            : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600'
                                        }`}
                                      >
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'
                                        }`}>
                                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <span className="leading-snug">{option}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <textarea
                                  value={selectedAnswer}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomTestAnswers(prev => ({
                                      ...prev,
                                      [q.id]: val
                                    }));
                                  }}
                                  placeholder="Digite sua resposta aqui..."
                                  className="w-full min-h-[100px] p-4 bg-white border border-slate-150 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner leading-relaxed resize-y"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => setCustomTestState('initial')}
                          className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                        >
                          Voltar
                        </button>

                        <button
                          type="button"
                          disabled={isSavingCustomTest}
                          onClick={handleFinishCustomTest}
                          className="px-8 py-3.5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                        >
                          {isSavingCustomTest ? (
                            <>
                              <Loader2 size={12} className="animate-spin" /> Enviando...
                            </>
                          ) : (
                            'Finalizar e Enviar'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }

                if (customTestState === 'completed' && selectedCustomTestResult) {
                  return (
                    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sleek border border-white max-w-3xl mx-auto space-y-8 text-left animate-fade-in">
                      <div className="text-center">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Questionário Customizado Enviado!</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Suas respostas foram gravadas com sucesso</p>
                      </div>

                      <div className="space-y-4">
                        {customTestQuestions.map((q, idx) => {
                          const answerText = selectedCustomTestResult[q.id] || 'Nenhuma resposta gravada.';
                          return (
                            <div key={q.id || idx} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 space-y-3">
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center text-white bg-emerald-600 shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
                                  {q.question}
                                </h4>
                              </div>
                              <div className="p-4 bg-white border border-slate-150 rounded-2xl text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-line shadow-xs">
                                {answerText}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-center pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomTestState('none');
                            setSelectedCustomTestResult(null);
                          }}
                          className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10"
                        >
                          Voltar para Testes
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight text-left mb-4">Testes Pendentes</h3>
                      {pendingTests.length === 0 ? (
                        <div className="bg-white p-12 rounded-[2.5rem] text-center border border-slate-100 shadow-sm">
                          <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={32} />
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Você não tem avaliações pendentes.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          {pendingTests.map(item => {
                            const isDisc = item.type === 'DISC';
                            const isMbti = item.type === 'MBTI';
                            const isTemperamentos = item.type === 'TEMPERAMENTOS';
                            const isCustom = item.type === 'CUSTOM';
                            return (
                              <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sleek flex flex-col justify-between group hover:border-[#533af6]/30 transition-all">
                                <div className="mb-6">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" 
                                    style={{ 
                                      backgroundColor: isDisc ? 'rgba(99, 102, 241, 0.1)' : isMbti ? 'rgba(83, 58, 246, 0.1)' : isTemperamentos ? 'rgba(14, 165, 233, 0.1)' : isCustom ? 'rgba(16, 185, 129, 0.1)' : 'rgba(83, 58, 246, 0.1)', 
                                      color: isDisc ? '#6366f1' : isMbti ? '#533af6' : isTemperamentos ? '#0ea5e9' : isCustom ? '#10b981' : '#533af6' 
                                    }}
                                  >
                                    {isDisc ? <Brain size={20} /> : isMbti ? <Sparkles size={20} /> : isTemperamentos ? <Compass size={20} /> : isCustom ? <FileText size={20} /> : <FileText size={20} />}
                                  </div>
                                  <h4 className="font-black text-slate-900 uppercase tracking-tight text-md mb-1">
                                    {isDisc ? 'Teste de Perfil DISC 5.0' : isMbti ? 'Teste de Personalidade MBTI' : isTemperamentos ? 'Teste de Temperamentos e Perfil' : isCustom ? 'Questionário Customizado' : 'Mapeamento de Perfil'}
                                  </h4>
                                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                                    Vaga: {item.jobTitle}
                                  </p>
                                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                                    {isDisc 
                                      ? `Solicitado por ${item.companyName}. Responda para mapear seu perfil comportamental e prosseguir no processo seletivo.`
                                      : isMbti
                                        ? `Solicitado por ${item.companyName}. Responda ao teste de 64 perguntas para mapear suas dimensões de personalidade.`
                                        : isTemperamentos
                                          ? `Solicitado por ${item.companyName}. Responda ao teste de 25 perguntas para mapear seu perfil comportamental e de temperamento.`
                                          : isCustom
                                            ? `Solicitado por ${item.companyName}. Responda ao questionário específico criado para esta vaga para prosseguir no processo seletivo.`
                                            : `Solicitado por ${item.companyName}. Responda ao mapeamento de perfil de 20 perguntas para prosseguir no processo seletivo.`
                                    }
                                  </p>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isDisc) {
                                      setActiveTestApplicationId(item.app.id);
                                      setDiscTestState('initial');
                                    } else if (isMbti) {
                                      setActiveMbtiApplicationId(item.app.id);
                                      setMbtiAnswers({});
                                      setCurrentMbtiStageIndex(0);
                                      setMbtiState('initial');
                                    } else if (isTemperamentos) {
                                      setActiveTemperamentosApplicationId(item.app.id);
                                      setTemperamentosAnswers({});
                                      setCurrentTemperamentosStageIndex(0);
                                      setTemperamentosState('initial');
                                    } else if (isCustom) {
                                      handleStartCustomTest(item.app);
                                    } else {
                                      setActiveQuestionsApplicationId(item.app.id);
                                      setQuestionsAnswers({});
                                      setCurrentQuestionsCategoryIndex(0);
                                      setQuestionsState('initial');
                                    }
                                  }}
                                  className="w-full py-3.5 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                                  style={{ backgroundColor: isDisc ? '#6366f1' : isMbti ? '#533af6' : isTemperamentos ? '#0ea5e9' : isCustom ? '#10b981' : '#533af6' }}
                                >
                                  Começar Avaliação {isDisc ? <Brain size={12} /> : isMbti ? <Sparkles size={12} /> : isTemperamentos ? <Compass size={12} /> : isCustom ? <FileText size={12} /> : <FileText size={12} />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight text-left mb-4">Testes Concluídos</h3>
                      {completedTests.length === 0 ? (
                        <div className="bg-white p-12 rounded-[2.5rem] text-center border border-slate-100 shadow-sm">
                          <Award className="mx-auto text-slate-300 mb-4" size={32} />
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Nenhum teste concluído ainda.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          {completedTests.map(item => {
                            const isDisc = item.type === 'DISC';
                            const isMbti = item.type === 'MBTI';
                            const isTemperamentos = item.type === 'TEMPERAMENTOS';
                            const isCustom = item.type === 'CUSTOM';
                            return (
                              <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sleek flex flex-col justify-between group hover:border-[#533af6]/20 transition-all">
                                <div className="mb-6">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" 
                                    style={{ 
                                      backgroundColor: isDisc ? 'rgba(99, 102, 241, 0.08)' : isMbti ? 'rgba(83, 58, 246, 0.08)' : isTemperamentos ? 'rgba(14, 165, 233, 0.08)' : isCustom ? 'rgba(16, 185, 129, 0.08)' : 'rgba(83, 58, 246, 0.08)', 
                                      color: isDisc ? '#6366f1' : isMbti ? '#533af6' : isTemperamentos ? '#0ea5e9' : isCustom ? '#10b981' : '#533af6' 
                                    }}
                                  >
                                    {isDisc ? <Award size={20} /> : isMbti ? <Sparkles size={20} /> : isTemperamentos ? <Compass size={20} /> : isCustom ? <CheckCircle2 size={20} /> : <CheckCircle2 size={20} />}
                                  </div>
                                  <h4 className="font-black text-slate-900 uppercase tracking-tight text-md mb-1">
                                    {isDisc ? 'DISC 5.0 Concluído' : isMbti ? 'MBTI Concluído' : isTemperamentos ? 'Temperamentos Concluído' : isCustom ? 'Questionário Customizado Concluído' : 'Mapeamento de Perfil Concluído'}
                                  </h4>
                                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                                    Vaga: {item.jobTitle}
                                  </p>
                                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                                    {isDisc 
                                      ? `Avaliação de perfil comportamental concluída com sucesso para a vaga da ${item.companyName}.`
                                      : isMbti
                                        ? `Teste de dimensões de personalidade concluído com sucesso para a vaga da ${item.companyName}.`
                                        : isTemperamentos
                                          ? `Teste de temperamentos e perfil comportamental concluído com sucesso para a vaga da ${item.companyName}.`
                                          : isCustom
                                            ? `Questionário customizado respondido com sucesso para a vaga da ${item.companyName}.`
                                            : `Mapeamento de perfil descritivo com 20 perguntas concluído com sucesso para a vaga da ${item.companyName}.`
                                    }
                                  </p>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isDisc) {
                                      setDiscResult({ D: item.data.D, I: item.data.I, S: item.data.S, C: item.data.C });
                                      setActiveTestApplicationId(item.app.id);
                                      setDiscTestState('completed');
                                    } else if (isMbti) {
                                      setMbtiResult({ type: item.data.type, scores: item.data.scores });
                                      setActiveMbtiApplicationId(item.app.id);
                                      setSelectedMbtiResult(item.data);
                                      setMbtiState('completed');
                                    } else if (isTemperamentos) {
                                      setTemperamentosResult({ type: item.data.type, scores: item.data.scores });
                                      setActiveTemperamentosApplicationId(item.app.id);
                                      setSelectedTemperamentosResult(item.data);
                                      setTemperamentosState('completed');
                                    } else if (isCustom) {
                                      setSelectedCustomTestResult(item.data);
                                      setActiveCustomTestApplicationId(item.app.id);
                                      
                                      const customStatus = getCustomTestStatusForApp(item.app);
                                      let qList = customStatus.questions || [];
                                      if (!qList || qList.length === 0) {
                                        const jobDescription = item.app.jobs?.description || item.app.job?.description || '';
                                        qList = getCustomQuestionsFromJobDescription(jobDescription);
                                      }
                                      
                                      setCustomTestQuestions(qList);
                                      setCustomTestState('completed');
                                    } else {
                                      setSelectedQuestionsResult(item.data);
                                      setActiveQuestionsApplicationId(item.app.id);
                                      setCurrentQuestionsCategoryIndex(0);
                                      setQuestionsState('completed');
                                    }
                                  }}
                                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                  Visualizar Relatório {isDisc ? <Award size={12} /> : isMbti ? <Sparkles size={12} /> : isTemperamentos ? <Compass size={12} /> : isCustom ? <FileText size={12} /> : <FileText size={12} />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sleek relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-indigo-600" />
               <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-10">
                 <Loader2 size={40} className="text-primary-600 animate-spin" />
               </div>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Módulo em Desenvolvimento</h2>
               <p className="text-slate-500 font-medium max-w-sm text-center px-10">Estamos preparando a melhor experiência para você gerenciar suas {activeTab}.</p>
            </div>
          )}
        </div>
      </main>
    </div>

      <div 
        ref={resumePrintRef} 
        style={{ 
          display: 'none', 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px', 
          width: '210mm', 
          minHeight: '297mm', 
          backgroundColor: '#FFFFFF',
          color: '#000000'
        }}
        className="font-sans"
      >
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '297mm', width: '210mm', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif' }}>
          {/* Header Zone */}
          <div style={{ backgroundImage: 'linear-gradient(90deg, #5b36ff 0%, #8b6aff 100%)', backgroundColor: '#7044ff', width: '100%', height: '160px', position: 'relative', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
            {/* Circular Photo */}
            <div style={{ position: 'absolute', left: '50px', top: '75px', zIndex: 100 }}>
              <div style={{ width: '170px', height: '170px', borderRadius: '50%', border: '6px solid #FFFFFF', overflow: 'hidden', backgroundColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {resumeData.profilePic ? (
                  <img src={resumeData.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                    <User size={60} />
                  </div>
                )}
              </div>
            </div>

            {/* Name Header */}
            <div style={{ marginLeft: '260px', paddingRight: '40px', flex: 1, textAlign: 'left' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '2px', margin: 0, paddingBottom: '10px' }}>
                {resumeData.fullName || 'Seu Nome'}
              </h1>
              <div style={{ width: '100%', height: '2px', backgroundColor: '#FFFFFF' }} />
            </div>
          </div>

          {/* Columns Zone */}
          <div style={{ display: 'flex', flex: 1, width: '100%', boxSizing: 'border-box' }}>
            {/* Sidebar Column */}
            <div style={{ width: '240px', backgroundColor: '#f3f0ff', paddingTop: '110px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
              {/* CONTATO SECTION */}
              <div style={{ width: '100%', textAlign: 'center', marginBottom: '35px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Contato</h3>
                <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
                
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Telefone</p>
                  <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{resumeData.phone || '--'}</p>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>E-Mail</p>
                  <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{resumeData.email || '--'}</p>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Cidade</p>
                  <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{resumeData.city ? `${resumeData.city} - ${resumeData.state || ''}` : '--'}</p>
                </div>
                
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Idade</p>
                  <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{calculateAge(resumeData.birthDate) || '--'}</p>
                </div>
              </div>

              {/* HABILIDADES SECTION */}
              <div style={{ width: '100%' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0', textAlign: 'center' }}>Habilidades</h3>
                <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
                
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                  {resumeData.skills.map((skill, index) => (
                    <li key={index} style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, paddingLeft: '5px' }}>
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Content Column */}
            <div style={{ flex: 1, padding: '40px 40px 40px 35px', display: 'flex', flexDirection: 'column', textAlign: 'left', boxSizing: 'border-box' }}>
              {/* PERFIL SECTION */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Perfil</h2>
                <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#334155', margin: 0, textAlign: 'left', whiteSpace: 'pre-line' }}>
                  {resumeData.summary || 'Resumo profissional não preenchido.'}
                </p>
              </div>

              {/* EXPERIÊNCIAS SECTION */}
              {resumeData.experiences && resumeData.experiences.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Experiências</h2>
                  <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                  <div>
                    {resumeData.experiences.map((exp) => (
                      <div key={exp.id} style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>{exp.role}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{exp.company}</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{getExperienceDuration(exp.startDate, exp.endDate, exp.current)}</span>
                        </div>
                        <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#475569', margin: 0, whiteSpace: 'pre-line', textAlign: 'left' }}>
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EDUCAÇÃO SECTION */}
              {resumeData.educations && resumeData.educations.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Educação</h2>
                  <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                  <div>
                    {resumeData.educations.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{edu.course}</h4>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#334155', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                          {edu.gradYear} - {edu.status}
                        </p>
                        <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview Drawer */}
      <AnimatePresence>
        {showResumePreview && (
          <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResumePreview(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="relative w-full max-w-4xl h-full bg-white shadow-2xl overflow-hidden flex flex-col rounded-l-[10px] rounded-r-none z-10"
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Visualização do Currículo</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Este é o formato final do seu PDF</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleDownloadResume}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-full font-bold text-xs hover:bg-primary-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {isExporting ? 'Processando...' : 'Baixar agora'}
                  </button>
                  <button onClick={() => setShowResumePreview(false)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex justify-center">
                {/* The identical structure used for PDF capture */}
                <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top transform scale-[0.8] sm:scale-[0.9] mb-12">
                  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '297mm', width: '210mm', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif' }}>
                    {/* Header Zone */}
                    <div style={{ backgroundImage: 'linear-gradient(90deg, #5b36ff 0%, #8b6aff 100%)', backgroundColor: '#7044ff', width: '100%', height: '160px', position: 'relative', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
                      {/* Circular Photo */}
                      <div style={{ position: 'absolute', left: '50px', top: '75px', zIndex: 100 }}>
                        <div style={{ width: '170px', height: '170px', borderRadius: '50%', border: '6px solid #FFFFFF', overflow: 'hidden', backgroundColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                          {resumeData.profilePic ? (
                            <img src={resumeData.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                              <User size={60} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Name Header */}
                      <div style={{ marginLeft: '260px', paddingRight: '40px', flex: 1, textAlign: 'left' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '2px', margin: 0, paddingBottom: '10px' }}>
                          {resumeData.fullName || 'Seu Nome'}
                        </h1>
                        <div style={{ width: '100%', height: '2px', backgroundColor: '#FFFFFF' }} />
                      </div>
                    </div>

                    {/* Columns Zone */}
                    <div style={{ display: 'flex', flex: 1, width: '100%', boxSizing: 'border-box' }}>
                      {/* Sidebar Column */}
                      <div style={{ width: '240px', backgroundColor: '#f3f0ff', paddingTop: '110px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                        {/* CONTATO SECTION */}
                        <div style={{ width: '100%', textAlign: 'center', marginBottom: '35px' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Contato</h3>
                          <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
                          
                          <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Telefone</p>
                            <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{resumeData.phone || '--'}</p>
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>E-Mail</p>
                            <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{resumeData.email || '--'}</p>
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Cidade</p>
                            <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{resumeData.city ? `${resumeData.city} - ${resumeData.state || ''}` : '--'}</p>
                          </div>
                          
                          <div>
                            <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Idade</p>
                            <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{calculateAge(resumeData.birthDate) || '--'}</p>
                          </div>
                        </div>

                        {/* HABILIDADES SECTION */}
                        <div style={{ width: '100%' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0', textAlign: 'center' }}>Habilidades</h3>
                          <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
                          
                          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                            {resumeData.skills.map((skill, index) => (
                              <li key={index} style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, paddingLeft: '5px' }}>
                                • {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Main Content Column */}
                      <div style={{ flex: 1, padding: '40px 40px 40px 35px', display: 'flex', flexDirection: 'column', textAlign: 'left', boxSizing: 'border-box' }}>
                        {/* PERFIL SECTION */}
                        <div style={{ marginBottom: '32px' }}>
                          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Perfil</h2>
                          <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                          <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#334155', margin: 0, textAlign: 'left', whiteSpace: 'pre-line' }}>
                            {resumeData.summary || 'Resumo profissional não preenchido.'}
                          </p>
                        </div>

                        {/* EXPERIÊNCIAS SECTION */}
                        {resumeData.experiences && resumeData.experiences.length > 0 && (
                          <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Experiências</h2>
                            <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                            <div>
                              {resumeData.experiences.map((exp) => (
                                <div key={exp.id} style={{ marginBottom: '24px' }}>
                                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>{exp.role}</h4>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{exp.company}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{getExperienceDuration(exp.startDate, exp.endDate, exp.current)}</span>
                                  </div>
                                  <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#475569', margin: 0, whiteSpace: 'pre-line', textAlign: 'left' }}>
                                    {exp.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* EDUCAÇÃO SECTION */}
                        {resumeData.educations && resumeData.educations.length > 0 && (
                          <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Educação</h2>
                            <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
                            <div>
                              {resumeData.educations.map((edu) => (
                                <div key={edu.id} style={{ marginBottom: '20px' }}>
                                  <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{edu.course}</h4>
                                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#334155', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                                    {edu.gradYear} - {edu.status}
                                  </p>
                                  <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{edu.institution}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {imageToCrop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-3xl h-[80vh] rounded-[3rem] flex flex-col overflow-hidden">
              <div className="p-8 flex justify-between items-center border-b border-slate-100">
                <h3 className="text-2xl font-extrabold text-slate-900">Ajuste sua foto</h3>
                <button onClick={() => setImageToCrop(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
              </div>
              <div className="flex-1 relative bg-slate-200">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="p-10 bg-white">
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zoom</span>
                  <input 
                    type="range" 
                    min={1} 
                    max={3} 
                    step={0.1} 
                    value={zoom} 
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-primary-600"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setImageToCrop(null)} className="px-8 py-4 font-bold text-slate-500 uppercase tracking-widest text-xs">Cancelar</button>
                  <button onClick={handleApplyCrop} className="px-12 py-4 bg-primary-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary-500/20">Confirmar e Salvar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Experience Drawer */}
      <AnimatePresence>
        {showExpModal && (
          <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExpModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-[460px] h-full bg-white shadow-2xl overflow-y-auto border-l border-slate-100 flex flex-col rounded-l-[10px] rounded-r-none z-10"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {editingExp ? 'Editar Experiência' : 'Nova Jornada'}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Detalhes profissionais</p>
                  </div>
                  <button onClick={() => setShowExpModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-all cursor-pointer">
                    <X size={20} />
                  </button>
                </div>
 
                 <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  if (!tempExp) return;
 
                   if (editingExp) {
                    setResumeData({...resumeData, experiences: resumeData.experiences.map(e => e.id === editingExp.id ? tempExp : e)});
                  } else {
                    setResumeData({...resumeData, experiences: [tempExp, ...resumeData.experiences]});
                  }
                  setShowExpModal(false);
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-full">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Empresa</label>
                      <input 
                        value={tempExp?.company || ''} 
                        onChange={(e) => setTempExp(prev => prev ? {...prev, company: e.target.value} : null)}
                        required 
                        className="w-full px-5 py-3 bg-slate-50 border border-transparent rounded-[10px] outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all text-sm font-medium" 
                        placeholder="Ex: Google, Itaú, Ambev..." 
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Seu Cargo</label>
                      <input 
                        value={tempExp?.role || ''} 
                        onChange={(e) => setTempExp(prev => prev ? {...prev, role: e.target.value} : null)}
                        required 
                        className="w-full px-5 py-3 bg-slate-50 border border-transparent rounded-[10px] outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all text-sm font-medium" 
                        placeholder="Ex: Vendedor, Analista, Coordenador..." 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Data Início</label>
                      <input 
                        type="date" 
                        value={tempExp?.startDate || ''} 
                        onChange={(e) => setTempExp(prev => prev ? {...prev, startDate: e.target.value} : null)}
                        required 
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-[10px] outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 text-sm font-medium" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Data Término</label>
                      <input 
                        type="date" 
                        value={tempExp?.endDate || ''} 
                        onChange={(e) => setTempExp(prev => prev ? {...prev, endDate: e.target.value} : null)}
                        disabled={tempExp?.current} 
                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-[10px] outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 text-sm font-medium disabled:opacity-30" 
                      />
                    </div>
                    <div className="col-span-full pb-1 pl-1">
                       <label className="flex items-center gap-3 cursor-pointer group">
                        <div 
                          onClick={() => setTempExp(prev => prev ? {...prev, current: !prev.current, endDate: !prev.current ? '' : prev.endDate} : null)}
                          className={`w-9 h-5 rounded-full relative transition-colors ${tempExp?.current ? 'bg-primary-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${tempExp?.current ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trabalho atualmente aqui</span>
                      </label>
                    </div>
                    <div className="col-span-full">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Principais Atividades</label>
                      <textarea 
                        value={tempExp?.description || ''} 
                        onChange={(e) => setTempExp(prev => prev ? {...prev, description: e.target.value} : null)}
                        required 
                        className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-[10px] outline-none min-h-[100px] focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all text-sm font-medium italic" 
                        placeholder="Descreva brevemente o que você entregou..." 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={() => setShowExpModal(false)} className="px-6 py-3 font-bold text-slate-400 uppercase tracking-widest text-[9px] hover:text-slate-600 cursor-pointer">Cancelar</button>
                    <button type="submit" className="px-10 py-3.5 bg-[#533af6] hover:bg-[#4326e5] text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border-0">Salvar Registro</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Education Drawer */}
      <AnimatePresence>
        {showEduModal && (
          <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEduModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-[460px] h-full bg-white shadow-2xl overflow-y-auto border-l border-slate-100 flex flex-col rounded-l-[10px] rounded-r-none z-10"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {editingEdu ? 'Editar Formação' : 'Nova Formação'}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Educação e cursos</p>
                  </div>
                  <button onClick={() => setShowEduModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                    <X size={20} />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newEdu: Education = {
                    id: editingEdu?.id || crypto.randomUUID(),
                    institution: formData.get('institution') as string,
                    course: formData.get('course') as string,
                    status: formData.get('status') as any,
                    gradYear: formData.get('gradYear') as string,
                  };

                  if (editingEdu) {
                    setResumeData({...resumeData, educations: resumeData.educations.map(e => e.id === editingEdu.id ? newEdu : e)});
                  } else {
                    setResumeData({...resumeData, educations: [newEdu, ...resumeData.educations]});
                  }
                  setShowEduModal(false);
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-full">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Instituição</label>
                      <input name="institution" defaultValue={editingEdu?.institution} required className="w-full px-5 py-3 bg-slate-50 border border-transparent rounded-[10px] outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all text-sm font-medium" placeholder="Ex: USP, Senac, Alura..." />
                    </div>
                    <div className="col-span-full">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Curso</label>
                      <input name="course" defaultValue={editingEdu?.course} required className="w-full px-5 py-3 bg-slate-50 border border-transparent rounded-[10px] outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all text-sm font-medium" placeholder="Ex: Administração, Marketing..." />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Status Atual</label>
                      <select name="status" defaultValue={editingEdu?.status || 'Completo'} className="w-full px-5 py-3 bg-slate-50 border border-transparent rounded-[10px] outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all font-bold text-slate-700 text-sm appearance-none">
                        <option value="Completo">Completo</option>
                        <option value="Incompleto">Incompleto</option>
                        <option value="Cursando">Cursando</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block">Ano Conclusão</label>
                      <input name="gradYear" defaultValue={editingEdu?.gradYear} required className="w-full px-5 py-3 bg-slate-50 border border-transparent rounded-[10px] outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all text-sm font-medium" placeholder="Ex: 2024" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={() => setShowEduModal(false)} className="px-6 py-3 font-bold text-slate-400 uppercase tracking-widest text-[9px] hover:text-slate-600">Cancelar</button>
                    <button type="submit" className="px-10 py-3.5 bg-[#533af6] hover:bg-[#4326e5] text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-lg hover:-translate-y-0.5 transition-all">Salvar Formação</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vacancy Details Modal */}
      <AnimatePresence>
        {selectedJobForDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJobForDetails(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-[700px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-y-auto border border-white"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm inline-block mb-3">
                      {selectedJobForDetails.modality}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                      {selectedJobForDetails.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Empresa Parceira • {selectedJobForDetails.city && selectedJobForDetails.state ? `${selectedJobForDetails.city}, ${selectedJobForDetails.state}` : selectedJobForDetails.modality || 'Remoto'}
                    </p>
                  </div>
                  <button onClick={() => setSelectedJobForDetails(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Salário Proposto</p>
                      <p className="text-xs font-bold text-slate-700">{selectedJobForDetails.salary || 'A combinar'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Idade Mínima</p>
                      <p className="text-xs font-bold text-slate-700">{selectedJobForDetails.min_age || selectedJobForDetails.minAge || 18} anos</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                      <Building size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Regime</p>
                      <p className="text-xs font-bold text-slate-700">{selectedJobForDetails.contract_type || 'CLT'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Descrição da Vaga</h4>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100 font-medium">
                      {cleanDescription(selectedJobForDetails.description)}
                    </p>
                  </div>

                  {getRequirementsList(selectedJobForDetails).length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Requisitos</h4>
                      <ul className="grid grid-cols-1 gap-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        {getRequirementsList(selectedJobForDetails).map((req: string, i: number) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2 font-medium">
                            <span className="text-primary-500 font-bold shrink-0">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {getBenefitsList(selectedJobForDetails).length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Benefícios Oferecidos</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        {getBenefitsList(selectedJobForDetails).map((ben: string, i: number) => (
                          <li key={i} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                            <span>{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setSelectedJobForDetails(null)} 
                    className="px-6 py-3 font-bold text-slate-400 uppercase tracking-widest text-[9px] hover:text-slate-600"
                  >
                    Fechar
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      handleApply(selectedJobForDetails);
                      setSelectedJobForDetails(null);
                    }}
                    disabled={appliedJobIds.includes(selectedJobForDetails.id) || isApplying === selectedJobForDetails.id}
                    className={`px-10 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg transition-all ${
                      appliedJobIds.includes(selectedJobForDetails.id)
                        ? 'bg-emerald-500 text-white cursor-default shadow-emerald-100'
                        : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95'
                    }`}
                  >
                    {appliedJobIds.includes(selectedJobForDetails.id) ? 'Candidatado' : 'Confirmar Candidatura'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {customDialog.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (customDialog.type !== 'confirm') {
                setCustomDialog(prev => ({ ...prev, isOpen: false }));
              }
            }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-white rounded-[10px] shadow-2xl p-6 overflow-hidden flex flex-col z-10 text-left border border-slate-100"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                customDialog.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : customDialog.type === 'confirm'
                    ? 'bg-[#8959f5]/10 text-[#8959f5]'
                    : 'bg-amber-50 text-amber-600'
              }`}>
                {customDialog.type === 'success' ? (
                  <Check size={20} className="stroke-[2.5]" />
                ) : customDialog.type === 'confirm' ? (
                  <HelpCircle size={20} className="stroke-[2.5]" />
                ) : (
                  <AlertTriangle size={20} className="stroke-[2.5]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 select-none">
                  {customDialog.title || (customDialog.type === 'success' ? 'Sucesso' : customDialog.type === 'confirm' ? 'Confirmação' : 'Aviso')}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
                  {customDialog.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
              {customDialog.type === 'confirm' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomDialog(prev => ({ ...prev, isOpen: false }));
                      if (customDialog.onCancel) customDialog.onCancel();
                    }}
                    className="px-5 py-2.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-200/50 hover:border-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (customDialog.onConfirm) customDialog.onConfirm();
                    }}
                    className="px-5 py-2.5 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomDialog(prev => ({ ...prev, isOpen: false }))}
                  className="px-7 py-2.5 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
                >
                  Entendido
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const perguntasDISC = [
  {
    pergunta: "Tende a agir de forma...",
    opcoes: {
      D: "Assertiva",
      I: "Persuasiva",
      S: "Paciente",
      C: "Contemplativa"
    }
  },
  {
    pergunta: "Confortável com...",
    opcoes: {
      D: "Ser decisivo",
      I: "Amizade social",
      S: "Ser parte de um time",
      C: "Planejamento e ordem"
    }
  },
  {
    pergunta: "Desejo de...",
    opcoes: {
      D: "Variedade",
      I: "Menos estrutura",
      S: "Harmonia",
      C: "Lógica"
    }
  },
  {
    pergunta: "Sob estresse pode se tornar...",
    opcoes: {
      D: "Ditatorial",
      I: "Sarcástico",
      S: "Submisso",
      C: "Arredio"
    }
  },
  {
    pergunta: "Característica principal...",
    opcoes: {
      D: "Franco",
      I: "Otimista",
      S: "Serviçal",
      C: "Ordeiro"
    }
  },
  {
    pergunta: "Quando em conflito, esse estilo…",
    opcoes: {
      D: "Demanda ação",
      I: "Ataca",
      S: "Reclama",
      C: "Evita"
    }
  },
  {
    pergunta: "Força aparente...",
    opcoes: {
      D: "Solucionador de problemas",
      I: "Encorajador",
      S: "Supporter",
      C: "Organizador"
    }
  },
  {
    pergunta: "Com erros...",
    opcoes: {
      D: "Informa o erro diretamente",
      I: "Chama a pessoa e explica o erro",
      S: "Fica calado e aceita o erro",
      C: "Se incomoda e questiona"
    }
  },
  {
    pergunta: "Sob estresse pode se tornar...",
    opcoes: {
      D: "Crítico",
      I: "Superficial",
      S: "Indeciso",
      C: "Cabeça dura"
    }
  },
  {
    pergunta: "Pode ser considerado...",
    opcoes: {
      D: "Impaciente",
      I: "Inoportuno",
      S: "Indeciso",
      C: "Inseguro"
    }
  },
  {
    pergunta: "Necessita de....",
    opcoes: {
      D: "Controle",
      I: "Aprovação",
      S: "Rotina",
      C: "Padrão"
    }
  },
  {
    pergunta: "Limitação desse perfil...",
    opcoes: {
      D: "Direto",
      I: "Desorganizado",
      S: "Indireto",
      C: "Detalhista"
    }
  },
  {
    pergunta: "Possui medo de...",
    opcoes: {
      D: "Perder",
      I: "Rejeição",
      S: "Mudanças bruscas",
      C: "Estar errado"
    }
  },
  {
    pergunta: "Mensura desempenho com...",
    opcoes: {
      D: "Resultados",
      I: "Reconhecimento",
      S: "Compatibilidade",
      C: "Precisão"
    }
  },
  {
    pergunta: "Com subalternos, costuma ser...",
    opcoes: {
      D: "Orgulhoso",
      I: "Permissivo",
      S: "Humilde",
      C: "Cauteloso"
    }
  },
  {
    pergunta: "Abordagem primária...",
    opcoes: {
      D: "Independente",
      I: "Interativo",
      S: "Estável",
      C: "Corretivo"
    }
  },
  {
    pergunta: "Outra limitação desse perfil...",
    opcoes: {
      D: "Intenso",
      I: "Não tradicional",
      S: "Indeciso",
      C: "Impessoal"
    }
  },
  {
    pergunta: "Ponto cego...",
    opcoes: {
      D: "Ser responsabilizado",
      I: "Realizar compromissos",
      S: "Necessidade de mudança",
      C: "Tomada de decisão "
    }
  },
  {
    pergunta: "Mensura desempenho com...",
    opcoes: {
      D: "Histórico",
      I: "Elogios",
      S: "Contribuição",
      C: "Qualidade dos resultados"
    }
  },
  {
    pergunta: "Prefere tarefas....",
    opcoes: {
      D: "Desafiadoras",
      I: "Relacionada a pessoas",
      S: "Agendadas",
      C: "Estruturadas"
    }
  },
  {
    pergunta: "Com atrasos...",
    opcoes: {
      D: "Se irrita e confronta",
      I: "Nem liga, está distraído",
      S: "Sabe do atraso, mas aceita",
      C: "Reclama e analisa a situação"
    }
  },
  {
    pergunta: "Em situações extremas...",
    opcoes: {
      D: "Se preocupa demais com metas",
      I: "Fala sem pensar",
      S: "Procrastina ao invés de fazer",
      C: "Analisa demais"
    }
  },
  {
    pergunta: "Precisa melhorar...",
    opcoes: {
      D: "Empatia e Paciência",
      I: "Contole emocional",
      S: "Ser assertivo sob pressão",
      C: "Se preocupar menos sobre tudo"
    }
  },
  {
    pergunta: "Em uma discussão...",
    opcoes: {
      D: "Busca ter a razão",
      I: "Busca diminuir o conflito",
      S: "Busca concordância",
      C: "Busca comprovar sua opinião"
    }
  },
  {
    pergunta: "Quando vai às compras...",
    opcoes: {
      D: "Sabe o que quer",
      I: "Se diverte",
      S: "Fica indeciso",
      C: "Busca ofertas"
    }
  }
];

export const perfisDISC = {
  D: {
    nome: "DOMINÂNCIA (Executor/Direto)",
    desc: "Enfatiza a obtenção de resultados, competitividade e iniciativa. Características principais: Focado, determinado, motivado por desafios, prefere liderar e agir de forma rápida.",
    caracteristicas: ["Assertivo", "Competitivo", "Direto", "Focado em resultados", "Decidido"],
    pontosFortes: ["Foco em metas", "Liderança", "Rápido na tomada de decisão", "Independência"],
    pontosAtencao: ["Impaciente", "Autoritário", "Dificuldade em ouvir", "Pode ser agressivo sob pressão"],
    motivadores: ["Desafios e metas difíceis", "Autonomia e poder de decisão", "Resultados rápidos", "Status e prestígio"],
    sobPressao: ["Torna-se ditatorial", "Foca excessivamente em metas e esquece das pessoas", "Pode ser ríspido ou impaciente"],
    classColor: "text-rose-600 bg-rose-50 border-rose-100",
    barColor: "bg-rose-500",
    label: "Dominância"
  },
  I: {
    nome: "INFLUÊNCIA (Comunicador/Sociável)",
    desc: "Enfatiza o relacionamento, otimismo e persuasão. Características principais: Comunicativo, carismático, gosta de trabalhar em equipe, foca em conexões interpessoais e entusiasmo.",
    caracteristicas: ["Persuasivo", "Otimista", "Sociável", "Comunicativo", "Entusiasmado"],
    pontosFortes: ["Habilidade interpessoal", "Persuasão e vendas", "Clima organizacional positivo", "Criatividade"],
    pontosAtencao: ["Falta de foco e desorganização", "Dificuldade em dar feedback negativo", "Responsabilidade em cumprir prazos", "Impulsividade"],
    motivadores: ["Reconhecimento social e elogios", "Ambientes dinâmicos e colaborativos", "Liberdade para expressar ideias", "Variedade de tarefas"],
    sobPressao: ["Fala excessivamente sem pensar", "Pode se tornar superficial ou desorganizado", "Evita conflitos a qualquer custo"],
    classColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    barColor: "bg-indigo-500",
    label: "Influência"
  },
  S: {
    nome: "ESTABILIDADE (Planejador/Constante)",
    desc: "Enfatiza a cooperação, paciência e lealdade. Características principais: Bom ouvinte, calmo, confiável, prefere ambientes previsíveis, processos estruturados e segurança.",
    caracteristicas: ["Paciente", "Bom ouvinte", "Confiável", "Constante", "Leal"],
    pontosFortes: ["Cooperação e trabalho em equipe", "Organização e consistência", "Paciência com pessoas e processos", "Mediação de conflitos"],
    pontosAtencao: ["Resistência a mudanças rápidas", "Dificuldade em dizer não", "Evita confrontos diretos", "Pode acumular tarefas por indecisão"],
    motivadores: ["Ambiente seguro e estável", "Processos claros e rotinas", "Reconhecimento pela lealdade e dedicação", "Cooperação mútua"],
    sobPressao: ["Procrastina ou fica indeciso", "Submete-se às decisões dos outros mesmo discordando", "Guarda as frustrações para si"],
    classColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    barColor: "bg-emerald-500",
    label: "Estabilidade"
  },
  C: {
    nome: "CONFORMIDADE (Analítico/Exato)",
    desc: "Enfatiza a qualidade, precisão, lógica e competência. Características principais: Detalhista, focado em regras e fatos, preza pela organização, ordem e excelência técnica.",
    caracteristicas: ["Analítico", "Organizado", "Detalhista", "Estratégico", "Preciso", "Cauteloso"],
    pontosFortes: ["Qualidade", "Planejamento", "Organização", "Precisão"],
    pontosAtencao: ["Perfeccionismo", "Excesso de análise", "Rigidez", "Dificuldade em delegar"],
    motivadores: ["Processos claros", "Qualidade", "Segurança", "Controle"],
    sobPressao: ["Super analisa", "Fica crítico", "Se distancia emocionalmente"],
    classColor: "text-amber-600 bg-amber-50 border-amber-100",
    barColor: "bg-amber-500",
    label: "Conformidade"
  }
};
