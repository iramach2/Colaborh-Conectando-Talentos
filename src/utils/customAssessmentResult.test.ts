import assert from 'node:assert/strict';
import test from 'node:test';
import type { CustomQuestionnaire } from '../services/customQuestionnaireService';
import { findCustomQuestionnaireByResponseIds } from './customAssessmentResult';

const gerencialTemplate: CustomQuestionnaire = {
  id: 'template-gerencial',
  companyId: 'company-id',
  title: 'Gerencial',
  createdAt: '2026-08-18T00:00:00.000Z',
  questions: [
    { id: 'question-1', type: 'text', question: 'Pergunta 1' },
    { id: 'question-2', type: 'choice', question: 'Pergunta 2', options: ['A', 'B'] },
  ],
};

test('recupera o questionario quando todos os IDs das respostas coincidem', () => {
  const result = findCustomQuestionnaireByResponseIds(
    { 'question-1': 'Resposta', 'question-2': 'A' },
    [gerencialTemplate],
  );

  assert.equal(result?.id, gerencialTemplate.id);
});

test('nao associa um questionario parcial ao resultado antigo', () => {
  const result = findCustomQuestionnaireByResponseIds(
    { 'question-1': 'Resposta' },
    [gerencialTemplate],
  );

  assert.equal(result, null);
});
