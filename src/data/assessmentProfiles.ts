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
