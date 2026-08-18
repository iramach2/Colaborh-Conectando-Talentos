import type { CustomQuestionnaire } from '../services/customQuestionnaireService';

export const findCustomQuestionnaireByResponseIds = (
  responses: Record<string, unknown>,
  templates: CustomQuestionnaire[],
) => {
  const responseIds = new Set(Object.keys(responses).map(String));
  if (responseIds.size === 0) return null;

  return templates.find((template) => {
    const questionIds = template.questions.map((question) => String(question.id));
    return questionIds.length === responseIds.size
      && questionIds.every((questionId) => responseIds.has(questionId));
  }) || null;
};
