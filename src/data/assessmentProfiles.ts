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
      A: "Fazer progresso",
      C: "Construir memórias",
      O: "Fazer sentido",
      I: "Tornar as pessoas confortáveis"
    }
  },
  {
    id: 3,
    text: "Eu gosto de chegar...",
    options: {
      A: "Na frente",
      C: "Junto",
      O: "Na hora",
      I: "Em outro lugar"
    }
  },
  {
    id: 4,
    text: "Um ótimo dia para mim é quando...",
    options: {
      A: "Consigo fazer muitas coisas",
      C: "Me divirto com meus amigos",
      O: "Tudo segue conforme planejado",
      I: "Desfruto de coisas novas e estimulantes"
    }
  },
  {
    id: 5,
    text: "Eu vejo a morte como...",
    options: {
      I: "Uma grande aventura misteriosa",
      C: "Oportunidade para rever os falecidos",
      O: "Um modo de receber recompensas",
      A: "Algo que sempre chega muito cedo"
    }
  },
  {
    id: 6,
    text: "Minha filosofia de vida é...",
    options: {
      A: "Há ganhadores e perdedores, e eu acredito ser um ganhador",
      C: "Para eu ganhar, ninguém precisa perder",
      O: "Para ganhar é preciso seguir as regras",
      I: "Para ganhar, é necessário inventar novas regras"
    }
  },
  {
    id: 7,
    text: "Para conseguir obter bons resultados é preciso...",
    options: {
      I: "Perguntas e respostas",
      O: "Ter todos os detalhes",
      A: "Vantagens a meu favor",
      C: "Que todos tenham a chance de ser ouvido"
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
      O: "Evitar Surpresas",
      A: "Focalizar na meta",
      C: "Realizar uma abordagem natural"
    }
  },
  {
    id: 15,
    text: "Eu gosto de mudanças se...",
    options: {
      A: "Me der uma vantagem competitiva",
      C: "For divertido e compartilhável",
      I: "Me der mais liberdade e variedade",
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
      O: "Autoridade no Assunto",
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
      A: "Simplesmente Fazer"
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
    weaknesses: ["F?cil distra??o", "Dificuldade com rotinas", "Mudan?as frequentes de rumo", "Pouca toler?ncia ? repeti??o"],
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
    description: "Profissionais orientados a resultados, competitivos e determinados. Tomam decis?es com rapidez e assumem posi??es de lideran?a de forma natural. Podem se mostrar impacientes ou demonstrar baixa toler?ncia com ritmos mais lentos.",
    strengths: ["Liderança assertiva", "Foco em resultados", "Agilidade de execução", "Tomada de decisão rápida"],
    weaknesses: ["Impaci?ncia", "Autoritarismo", "Pouca toler?ncia com lentid?o", "Risco de desconsiderar aspectos emocionais"],
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
    title: "Inspirador Din?mico",
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
  { id: 5, text: "Você tende ser mais:", optionA: { text: "Calculista", dimension: 'T' }, optionB: { text: "Empático", dimension: 'F' } },
  { id: 6, text: "Você prefere trabalhar:", optionA: { text: "Na última hora", dimension: 'J' }, optionB: { text: "A todo tempo", dimension: 'P' } },
  { id: 7, text: "Você tende escolher:", optionA: { text: "Cuidadosamente", dimension: 'E' }, optionB: { text: "Impulsivamente", dimension: 'I' } },
  { id: 8, text: "Nas festas você:", optionA: { text: "Fica até tarde, com muita disposição", dimension: 'S' }, optionB: { text: "Sai cedo, com pouca disposição", dimension: 'N' } },
  { id: 9, text: "Você é uma pessoa mais:", optionA: { text: "Sensível", dimension: 'T' }, optionB: { text: "Reflexiva", dimension: 'F' } },
  { id: 10, text: "Você é mais inclinado a ser:", optionA: { text: "Objetivo", dimension: 'J' }, optionB: { text: "Abstrato", dimension: 'P' } },
  { id: 11, text: "Para você é mais natural ser:", optionA: { text: "Justa com os outros", dimension: 'E' }, optionB: { text: "Agradável", dimension: 'I' } },
  { id: 12, text: "Num primeiro contato com os outros, você é:", optionA: { text: "Impessoal e desinteressado", dimension: 'S' }, optionB: { text: "Pessoal e interessado", dimension: 'N' } },
  { id: 13, text: "Normalmente você é:", optionA: { text: "Pontual", dimension: 'T' }, optionB: { text: "Sossegado", dimension: 'F' } },
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
  { id: 25, text: "Você é mais inclinado a ser uma pessoa:", optionA: { text: "Fria", dimension: 'T' }, optionB: { text: "Calorosa", dimension: 'F' } },
  { id: 26, text: "Você preferiria ser:", optionA: { text: "Mais justo que misericordioso", dimension: 'J' }, optionB: { text: "Mais misericordioso que justo", dimension: 'P' } },
  { id: 27, text: "Você se sente mais confortável:", optionA: { text: "Cumprindo um cronograma", dimension: 'E' }, optionB: { text: "Colocando-as de lado", dimension: 'I' } },
  { id: 28, text: "Você se sente mais confortável com:", optionA: { text: "Acordos escritos", dimension: 'S' }, optionB: { text: "Acordos de palavra", dimension: 'N' } },
  { id: 29, text: "Quando na companhia de alguém você:", optionA: { text: "Inicia as conversas", dimension: 'T' }, optionB: { text: "Espera ser abordado", dimension: 'F' } },
  { id: 30, text: "O senso comum tradicional é:", optionA: { text: "Normalmente confiável", dimension: 'J' }, optionB: { text: "Frequentemente enganoso", dimension: 'P' } },
  { id: 31, text: "As crianças normalmente:", optionA: { text: "Fazem-se suficientemente úteis", dimension: 'E' }, optionB: { text: "Sonham o bastante", dimension: 'I' } },
  { id: 32, text: "Você normalmente é mais:", optionA: { text: "De caráter forte", dimension: 'S' }, optionB: { text: "Gentil e simpático", dimension: 'N' } },
  { id: 33, text: "Você é mais:", optionA: { text: "Firme do que gentil", dimension: 'T' }, optionB: { text: "Gentil do que firme", dimension: 'F' } },
  { id: 34, text: "Você é mais tendencioso a manter as coisas:", optionA: { text: "Bem organizadas", dimension: 'J' }, optionB: { text: "Sem terminar", dimension: 'P' } },
  { id: 35, text: "Você dá mais valor ao que é:", optionA: { text: "Definitivo", dimension: 'J' }, optionB: { text: "Mutável", dimension: 'P' } },
  { id: 36, text: "Novas interações com outros:", optionA: { text: "O estimula e incentiva", dimension: 'E' }, optionB: { text: "Consome suas energias", dimension: 'I' } },
  { id: 37, text: "Frequentemente você é:", optionA: { text: "Uma pessoa do tipo prática", dimension: 'S' }, optionB: { text: "Um tipo de pessoa abstrata", dimension: 'N' } },
  { id: 38, text: "Qual dos itens se identifica mais com você:", optionA: { text: "Percepção exata e sem enganos", dimension: 'S' }, optionB: { text: "Formação de conceitos", dimension: 'N' } },
  { id: 39, text: "O que é mais realizador:", optionA: { text: "Discutir uma questão profundamente", dimension: 'T' }, optionB: { text: "Chegar a um acordo acerca de um assunto", dimension: 'F' } },
  { id: 40, text: "O que te conduz mais:", optionA: { text: "Sua cabeça", dimension: 'T' }, optionB: { text: "Seu coração", dimension: 'F' } },
  { id: 41, text: "Você se sente mais confortável com um trabalho:", optionA: { text: "Contratado", dimension: 'J' }, optionB: { text: "Feito de forma casual", dimension: 'P' } },
  { id: 42, text: "Você prefere que as coisas sejam:", optionA: { text: "Certas e ordenadas", dimension: 'J' }, optionB: { text: "Opcionais", dimension: 'P' } },
  { id: 43, text: "Você prefere:", optionA: { text: " Muitos amigos com breves contatos", dimension: 'E' }, optionB: { text: "Poucos amigos com contato longo", dimension: 'I' } },
  { id: 44, text: "Você é mais atraído a:", optionA: { text: "Informações substanciais", dimension: 'S' }, optionB: { text: "Suposições confiáveis", dimension: 'N' } },
  { id: 45, text: "Você se interessa mais em:", optionA: { text: "Produção", dimension: 'T' }, optionB: { text: "Pesquisas", dimension: 'F' } },
  { id: 46, text: "Você se sente mais confortável quando está sendo:", optionA: { text: "Objetivo", dimension: 'J' }, optionB: { text: "Pessoal", dimension: 'P' } },
  { id: 47, text: "Você se avalia como uma pessoa que é mais:", optionA: { text: "Indisposta", dimension: 'E' }, optionB: { text: "Dedicada, esforçada.", dimension: 'I' } },
  { id: 48, text: "Você fica mais confortável com uma:", optionA: { text: "Opinião final", dimension: 'S' }, optionB: { text: "Opinião incerta", dimension: 'N' } },
  { id: 49, text: "Você fica mais confortável:", optionA: { text: "Após uma decisão", dimension: 'T' }, optionB: { text: "Antes de uma decisão", dimension: 'F' } },
  { id: 50, text: "Você:", optionA: { text: "Fala fácil e longamente com desconhecidos", dimension: 'J' }, optionB: { text: "Não tem muito que dizer a desconhecidos", dimension: 'P' } },
  { id: 51, text: "Você normalmente é mais interessado em:", optionA: { text: "Um fato isolado", dimension: 'E' }, optionB: { text: "Um caso geral", dimension: 'I' } },
  { id: 52, text: "Você se sente:", optionA: { text: "Mais prático do que engenhoso", dimension: 'S' }, optionB: { text: "Mais engenhoso do que prático", dimension: 'N' } },
  { id: 53, text: "Você tipicamente é uma pessoa com:", optionA: { text: "Claros propósitos", dimension: 'T' }, optionB: { text: "Sentimentos fortes", dimension: 'F' } },
  { id: 54, text: "Você se inclina mais a ser:", optionA: { text: "Justo", dimension: 'J' }, optionB: { text: "Compreensivo", dimension: 'P' } },
  { id: 55, text: "É mais preferível:", optionA: { text: "Certificar-se de que as coisas estão certas", dimension: 'E' }, optionB: { text: "Apenas deixar que as coisas aconteçam", dimension: 'I' } },
  { id: 56, text: "É mais do seu jeito:", optionA: { text: "Deixar as coisas ajeitadas", dimension: 'S' }, optionB: { text: "Acomodar-se", dimension: 'N' } },
  { id: 57, text: "Quando o telefone toca você:", optionA: { text: "Corre para atender", dimension: 'T' }, optionB: { text: "Espera que alguém atenda", dimension: 'F' } },
  { id: 58, text: "Você acha que tem mais:", optionA: { text: "Um bom senso de realidade", dimension: 'J' }, optionB: { text: "Uma boa imaginação", dimension: 'P' } },
  { id: 59, text: "Você é mais atraído a:", optionA: { text: "Fundamentos", dimension: 'E' }, optionB: { text: "Insinuações", dimension: 'I' } },
  { id: 60, text: "Ao julgar você é mais:", optionA: { text: "Neutro", dimension: 'S' }, optionB: { text: "Cuidadoso", dimension: 'N' } },
  { id: 61, text: "Você considera a si mesmo uma pessoa:", optionA: { text: "Capaz de pensar claramente", dimension: 'T' }, optionB: { text: "De boa intenção", dimension: 'F' } },
  { id: 62, text: "Você é mais tendencioso a:", optionA: { text: "Organizar as atividades", dimension: 'J' }, optionB: { text: "Pegar as coisas quando elas vêm", dimension: 'P' } },
  { id: 63, text: "Você é uma pessoa mais:", optionA: { text: "Sistemática", dimension: 'J' }, optionB: { text: "Imprevisível", dimension: 'P' } },
  { id: 64, text: "Você é mais inclinado a ser:", optionA: { text: "De fácil acesso", dimension: 'E' }, optionB: { text: "De certa forma reservado", dimension: 'I' } }
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
    pontosAtencao: ["Sobrecarga por n?o saber dizer n?o", "Relut?ncia a inova??es", "Guarda sentimentos para si"],
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
    caracteristicas: ["Pr?tico", "Adapt?vel", "Racional", "Espont?neo", "Resoluto"],
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
    desc: "Animadores espont?neos, en?rgicos e entusiasmados - a vida nunca ? entediante perto deles. Adoram a intera??o social.",
    caracteristicas: ["Soci?vel", "Espont?neo", "Alegre", "Expressivo", "Colaborativo"],
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

export const perfisDISC = {
  D: {
    nome: "DOMIN?NCIA (Executor/Direto)",
    desc: "Enfatiza a obtenção de resultados, competitividade e iniciativa. Características principais: Focado, determinado, motivado por desafios, prefere liderar e agir de forma rápida.",
    caracteristicas: ["Assertivo", "Competitivo", "Direto", "Focado em resultados", "Decidido"],
    pontosFortes: ["Foco em metas", "Liderança", "Rápido na tomada de decisão", "Independência"],
    pontosAtencao: ["Impaciente", "Autoritário", "Dificuldade em ouvir", "Pode ser agressivo sob pressão"],
    motivadores: ["Desafios e metas difíceis", "Autonomia e poder de decisão", "Resultados rápidos", "Status e prestígio"],
    sobPressao: ["Torna-se ditatorial", "Foca excessivamente em metas e esquece das pessoas", "Pode ser ríspido ou impaciente"],
    classColor: "text-rose-600 bg-rose-50 border-rose-100",
    barColor: "bg-rose-500",
    label: "Domin?ncia"
  },
  I: {
    nome: "INFLUÊNCIA (Comunicador/Sociável)",
    desc: "Enfatiza o relacionamento, otimismo e persuasão. Características principais: Comunicativo, carismático, gosta de trabalhar em equipe, foca em conexões interpessoais e entusiasmo.",
    caracteristicas: ["Persuasivo", "Otimista", "Sociável", "Comunicativo", "Entusiasmado"],
    pontosFortes: ["Habilidade interpessoal", "Persuasão e vendas", "Clima organizacional positivo", "Criatividade"],
    pontosAtencao: ["Falta de foco e desorganização", "Dificuldade em dar feedback negativo", "Responsabilidade em cumprir prazos", "Impulsividade"],
    motivadores: ["Reconhecimento social e elogios", "Ambientes din?micos e colaborativos", "Liberdade para expressar ideias", "Variedade de tarefas"],
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
