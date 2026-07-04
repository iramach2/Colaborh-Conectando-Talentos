import { useEffect, useState } from 'react';

export type DemoTab = 'kanban' | 'ia' | 'testes';
export type DiscLetter = 'D' | 'I' | 'S' | 'C';

export type DemoIaResult = {
  name: string;
  match: number;
  xp: string;
  skills: string;
};

export type KanbanCandidate = {
  id: number;
  name: string;
  role: string;
  stage: string;
};

export type SimulatorQuestion = {
  question: string;
  options: Array<{
    text: string;
    type: DiscLetter;
  }>;
};

export type SimulatorResult = {
  title: string;
  desc: string;
  tips: string;
};

export const simulatorQuestions: SimulatorQuestion[] = [
  {
    question: 'Como voce prefere estruturar e planejar suas tarefas diarias?',
    options: [
      { text: 'Prefiro seguir uma lista detalhada, processos claros e regras definidas.', type: 'C' },
      { text: 'Prefiro ter flexibilidade, improvisar e focar em novas ideias criativas.', type: 'I' },
    ],
  },
  {
    question: 'Em reunioes de equipe ou tomada de decisoes, qual e sua atitude?',
    options: [
      { text: 'Sou direto ao ponto, foco nos resultados e defendo o meu ponto de vista.', type: 'D' },
      { text: 'Busco a harmonia da equipe, ouco a opiniao de todos e evito conflitos.', type: 'S' },
    ],
  },
  {
    question: 'Como voce reage quando ocorrem mudancas imprevistas em um projeto?',
    options: [
      { text: 'Analiso friamente os novos dados, fatos e riscos para me reorganizar.', type: 'C' },
      { text: 'Sinto-me entusiasmado com a novidade e gosto de mobilizar as pessoas.', type: 'I' },
    ],
  },
];

const simulatorProfiles: Record<DiscLetter, SimulatorResult> = {
  D: {
    title: 'Executor Focado (Dominancia)',
    desc: 'Voce e focado em resultados, direto e motivado por desafios. Toma decisoes rapidas e gosta de liderar processos de mudanca.',
    tips: 'Ideal para posicoes de lideranca, vendas corporativas e gestao de projetos dinamicos.',
  },
  I: {
    title: 'Comunicador Inspirador (Influencia)',
    desc: 'Voce e entusiasmado, comunicativo e voltado para relacoes interpessoais. Gosta de colaborar e motivar a equipe.',
    tips: 'Ideal para areas de marketing, recursos humanos, design e relacionamento com o cliente.',
  },
  S: {
    title: 'Planejador Diplomatico (Estabilidade)',
    desc: 'Voce e paciente, excelente ouvinte e valoriza a cooperacao. Gosta de ritmo constante, processos organizados e ambientes previsiveis.',
    tips: 'Ideal para operacoes estruturadas, suporte ao cliente, consultoria e desenvolvimento continuo.',
  },
  C: {
    title: 'Analista Detalhista (Conformidade)',
    desc: 'Voce e logico, detalhista e focado na qualidade. Valoriza a precisao, fatos concretos, regras bem estabelecidas e seguranca.',
    tips: 'Ideal para tecnologia, desenvolvimento de software, financas, compliance e controle de qualidade.',
  },
};

export const useLandingDemoSimulator = () => {
  const [demoTab, setDemoTab] = useState<DemoTab>('kanban');
  const [testStep, setTestStep] = useState(0);
  const [testAnswers, setTestAnswers] = useState<DiscLetter[]>([]);
  const [kanbanCandidates, setKanbanCandidates] = useState<KanbanCandidate[]>([
    { id: 1, name: 'Ana Silva', role: 'Frontend Developer', stage: 'triagem' },
    { id: 2, name: 'Carlos Rocha', role: 'Product Manager', stage: 'testes' },
    { id: 3, name: 'Mariana Souza', role: 'UI/UX Designer', stage: 'entrevista' },
    { id: 4, name: 'Lucas Lima', role: 'QA Engineer', stage: 'aprovado' },
  ]);
  const [iaSearchQuery, setIaSearchQuery] = useState('');
  const [iaSearchStep, setIaSearchStep] = useState(0);
  const [iaResults, setIaResults] = useState<DemoIaResult[]>([]);

  useEffect(() => {
    if (demoTab !== 'kanban') return;

    const interval = setInterval(() => {
      setKanbanCandidates((previousCandidates) => {
        const updated = [...previousCandidates];
        const nextStages: Record<string, string> = {
          triagem: 'testes',
          testes: 'entrevista',
          entrevista: 'aprovado',
          aprovado: 'triagem',
        };
        const randomIndex = Math.floor(Math.random() * updated.length);
        const candidate = updated[randomIndex];
        updated[randomIndex] = {
          ...candidate,
          stage: nextStages[candidate.stage],
        };
        return updated;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [demoTab]);

  useEffect(() => {
    if (demoTab !== 'ia') return;

    setIaSearchStep(0);
    setIaSearchQuery('');
    setIaResults([]);

    let isMounted = true;
    const wait = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

    const runSimulation = async () => {
      await wait(800);
      if (!isMounted) return;

      const text = 'Buscar UX Designer Senior especializado em mobile';
      setIaSearchStep(1);
      for (let index = 1; index <= text.length; index++) {
        await wait(60);
        if (!isMounted) return;
        setIaSearchQuery(text.substring(0, index));
      }

      await wait(500);
      if (!isMounted) return;
      setIaSearchStep(2);

      await wait(1200);
      if (!isMounted) return;
      setIaSearchStep(3);
      setIaResults([
        { name: 'Beatriz M.', match: 98, xp: '6 anos de xp', skills: 'Figma, Design System, Swift' },
        { name: 'Rodrigo F.', match: 89, xp: '4 anos de xp', skills: 'Figma, UX Research, Material UI' },
      ]);
    };

    runSimulation();
    const interval = setInterval(() => {
      if (isMounted) runSimulation();
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [demoTab]);

  const getSimulatorResult = () => {
    const counts: Record<DiscLetter, number> = { D: 0, I: 0, S: 0, C: 0 };
    testAnswers.forEach((answer) => {
      counts[answer]++;
    });

    let highest: DiscLetter = 'C';
    let max = -1;
    (Object.keys(counts) as DiscLetter[]).forEach((key) => {
      if (counts[key] > max) {
        max = counts[key];
        highest = key;
      }
    });

    return simulatorProfiles[highest];
  };

  return {
    demoTab,
    setDemoTab,
    testStep,
    setTestStep,
    testAnswers,
    setTestAnswers,
    kanbanCandidates,
    iaSearchQuery,
    iaSearchStep,
    iaResults,
    getSimulatorResult,
  };
};
