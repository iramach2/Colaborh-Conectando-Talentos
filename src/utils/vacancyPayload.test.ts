import assert from 'node:assert/strict';
import test from 'node:test';
import type { CompanyJob } from '../types/companyDashboard';
import { buildJobInsertPayload, buildVacancyFormFromJob } from './vacancyPayload';

test('preenche o formulario de edicao a partir de uma vaga existente', () => {
  const job: CompanyJob = {
    id: 'job-1',
    title: 'Analista de Pessoas',
    role: 'Analista',
    modality: 'Hibrido',
    state: 'DF',
    city: 'Brasília (Plano Piloto)',
    salary: 'R$ 4.500,00 - R$ 5.500,00',
    salary_min: 'R$ 4.500,00',
    salary_max: 'R$ 5.500,00',
    remuneration_type: 'Faixa Salarial',
    has_bonus: true,
    bonus_type: 'Premiacao',
    bonus_value: 'R$ 500,00',
    contract_type: 'CLT',
    work_schedule: '5x2',
    min_age: 21,
    positions: 2,
    request_reason: 'Aumento de quadro',
    is_urgent: true,
    responsibilities: 'Conduzir os processos seletivos.',
    requirements: ['Excel', 'Recrutamento'],
    stages: ['Analise de Curriculo', 'Entrevista com RH'],
    benefits: {
      vt: { selected: true, value: 'R$ 11,00 por dia' },
      va: { selected: false, value: '' },
      healthInsurance: true,
      extraBenefits: ['Gympass'],
    },
    description: [
      'Cargo: Analista',
      'Modalidade: Hibrido',
      'Localizacao: Brasília (Plano Piloto) - DF',
      '',
      'Atuar com recrutamento e desenvolvimento.',
      '',
      'Responsabilidades e Atribuicoes:',
      'Conduzir os processos seletivos.',
      '',
      'Beneficios:',
      '- Vale Transporte: R$ 11,00 por dia',
      '- Plano de Saude',
      '- Gympass',
    ].join('\n'),
  };

  const form = buildVacancyFormFromJob(job);

  assert.equal(form.title, 'Analista de Pessoas');
  assert.equal(form.description, 'Atuar com recrutamento e desenvolvimento.');
  assert.equal(form.responsibilities, 'Conduzir os processos seletivos.');
  assert.deepEqual(form.requirements, ['Excel', 'Recrutamento']);
  assert.deepEqual(form.stages, ['Analise de Curriculo', 'Entrevista com RH']);
  assert.equal(form.benefits.vt.selected, true);
  assert.equal(form.benefits.healthInsurance, true);
  assert.deepEqual(form.extraBenefits, ['Gympass']);
});

test('mantem beneficios extras no payload depois da edicao', () => {
  const form = buildVacancyFormFromJob({
    title: 'Desenvolvedor',
    role: 'Desenvolvedor',
    description: 'Construir aplicações.',
    responsibilities: 'Desenvolver funcionalidades.',
    requirements: ['TypeScript'],
    stages: ['Analise de Curriculo'],
    benefits: {
      vt: { selected: false, value: '' },
      va: { selected: false, value: '' },
      extraBenefits: ['Auxílio home office'],
    },
  });

  const { payload } = buildJobInsertPayload(form, { id: 'company-1', nomeFantasia: 'Colaborh' }, form.stages);
  const benefits = payload.benefits as typeof form.benefits & { extraBenefits: string[] };

  assert.deepEqual(benefits.extraBenefits, ['Auxílio home office']);
});
