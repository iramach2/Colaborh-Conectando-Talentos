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
