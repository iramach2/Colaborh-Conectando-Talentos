import assert from 'node:assert/strict';
import test from 'node:test';
import type { CompanyApplication } from '../types/companyDashboard';
import { getCandidateAssessmentLists, getCustomTestStatusesForApp } from './candidateAssessmentStatus';

const application: CompanyApplication = {
  id: 'application-1',
  job_id: 'job-1',
  candidate_name: 'Candidata Teste',
  assessment_records: [
    {
      id: 'assessment-1',
      application_id: 'application-1',
      assessment_type: 'custom',
      assessment_key: 'template-triagem',
      status: 'completed',
      requested_at: '2026-09-20T10:00:00.000Z',
      completed_at: '2026-09-20T11:00:00.000Z',
      responses: { responses: { question_1: 'Resposta da triagem' } },
      result: {
        templateId: 'template-triagem',
        title: 'Questionário de triagem',
        questions: [{ id: 'question_1', question: 'Conte sobre sua experiência.' }],
        responses: { question_1: 'Resposta da triagem' },
      },
    },
    {
      id: 'assessment-2',
      application_id: 'application-1',
      assessment_type: 'custom',
      assessment_key: 'template-gestor',
      status: 'pending',
      requested_at: '2026-09-21T10:00:00.000Z',
      completed_at: null,
      responses: {},
      result: {
        templateId: 'template-gestor',
        title: 'Questionário do gestor',
        questions: [{ id: 'question_2', question: 'Como você prioriza tarefas?' }],
      },
    },
  ],
};

test('preserva questionários customizados diferentes na mesma candidatura', () => {
  const statuses = getCustomTestStatusesForApp(application);

  assert.equal(statuses.length, 2);
  assert.deepEqual(
    statuses.map((status) => [status.assessmentKey, status.status, status.title]),
    [
      ['template-gestor', 'PENDING', 'Questionário do gestor'],
      ['template-triagem', 'COMPLETED', 'Questionário de triagem'],
    ],
  );
  assert.equal(statuses[1].answers?.question_1, 'Resposta da triagem');
});

test('cria um item separado para cada questionário na lista do candidato', () => {
  const lists = getCandidateAssessmentLists([application], [{
    id: 'job-1',
    title: 'Analista',
    company_name: 'Colaborh',
  }]);

  assert.equal(lists.pendingTests.filter((item) => item.type === 'CUSTOM').length, 1);
  assert.equal(lists.completedTests.filter((item) => item.type === 'CUSTOM').length, 1);
  assert.match(lists.pendingTests[0].id, /template-gestor/);
  assert.match(lists.completedTests[0].id, /template-triagem/);
});
