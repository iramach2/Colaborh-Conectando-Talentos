import { useEffect, useState } from 'react';
import { colaborhConfirm } from '../utils/colaborhAlerts';
import { getCompanyPlanLimits, getPlanUpgradeMessage } from '../utils/companyPlans';
import {
  CustomQuestion,
  CustomQuestionnaire,
  deleteCustomQuestionnaire,
  fetchCustomQuestionnaires,
  saveCustomQuestionnaire,
} from '../services/customQuestionnaireService';

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const readLocalCustomTemplates = (): CustomQuestionnaire[] => {
  try {
    const saved = localStorage.getItem('colaborh_custom_templates');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar colaborh_custom_templates:', error);
    return [];
  }
};

export const useCompanyCustomQuestionnaires = (selectedCompanyId: string, selectedCompanyPlan?: string) => {
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomQuestionnaire[]>(readLocalCustomTemplates);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isCreatingNewTemplate, setIsCreatingNewTemplate] = useState<boolean>(false);
  const [customTestTitle, setCustomTestTitle] = useState<string>('');
  const [isLoadingCustomTemplates, setIsLoadingCustomTemplates] = useState(false);
  const planLimits = getCompanyPlanLimits(selectedCompanyPlan);

  useEffect(() => {
    let isMounted = true;

    async function loadCustomTemplates() {
      if (!selectedCompanyId || selectedCompanyId === 'new') {
        if (isMounted) setCustomTemplates([]);
        return;
      }

      setIsLoadingCustomTemplates(true);
      try {
        const localTemplates = readLocalCustomTemplates();
        const remoteTemplates = await fetchCustomQuestionnaires(selectedCompanyId);
        if (remoteTemplates.length === 0 && localTemplates.length > 0) {
          const migratedTemplates = await Promise.all(
            localTemplates.map((template) => saveCustomQuestionnaire({
              id: crypto.randomUUID(),
              companyId: selectedCompanyId,
              title: template.title,
              questions: template.questions || [],
              createdAt: template.createdAt || new Date().toISOString(),
              updatedAt: template.updatedAt || new Date().toISOString(),
            })),
          );
          if (isMounted) {
            setCustomTemplates(migratedTemplates);
            localStorage.setItem('colaborh_custom_templates', JSON.stringify(migratedTemplates));
          }
          return;
        }

        if (isMounted) {
          setCustomTemplates(remoteTemplates);
          localStorage.setItem('colaborh_custom_templates', JSON.stringify(remoteTemplates));
        }
      } catch (error) {
        console.warn('Nao foi possivel carregar questionarios customizados do Supabase:', error);
        if (isMounted) {
          setCustomTemplates(readLocalCustomTemplates());
        }
      } finally {
        if (isMounted) setIsLoadingCustomTemplates(false);
      }
    }

    loadCustomTemplates();
    return () => {
      isMounted = false;
    };
  }, [selectedCompanyId]);

  const addCustomQuestion = (type: 'text' | 'choice') => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'choice' ? ['', ''] : undefined,
      correctOptionIndex: type === 'choice' ? null : undefined,
    };
    setCustomQuestions((previous) => [...previous, newQuestion]);
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions((previous) => previous.filter((question) => question.id !== id));
  };

  const updateCustomQuestionText = (id: string, text: string) => {
    setCustomQuestions((previous) => previous.map((question) => (
      question.id === id ? { ...question, question: text } : question
    )));
  };

  const addOptionToChoice = (questionId: string) => {
    setCustomQuestions((previous) => previous.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          options: [...(question.options || []), ''],
        };
      }
      return question;
    }));
  };

  const removeOptionFromChoice = (questionId: string, optionIndex: number) => {
    setCustomQuestions((previous) => previous.map((question) => {
      if (question.id === questionId) {
        const options = [...(question.options || [])];
        options.splice(optionIndex, 1);
        const currentCorrectOption = question.correctOptionIndex;
        const correctOptionIndex = typeof currentCorrectOption === 'number'
          ? currentCorrectOption === optionIndex
            ? null
            : currentCorrectOption > optionIndex
              ? currentCorrectOption - 1
              : currentCorrectOption
          : null;
        return { ...question, options, correctOptionIndex };
      }
      return question;
    }));
  };

  const updateOptionText = (questionId: string, optionIndex: number, text: string) => {
    setCustomQuestions((previous) => previous.map((question) => {
      if (question.id === questionId) {
        const options = [...(question.options || [])];
        options[optionIndex] = text;
        return { ...question, options };
      }
      return question;
    }));
  };

  const updateCorrectOption = (questionId: string, optionIndex: number) => {
    setCustomQuestions((previous) => previous.map((question) => (
      question.id === questionId
        ? { ...question, correctOptionIndex: question.correctOptionIndex === optionIndex ? null : optionIndex }
        : question
    )));
  };

  const handleSaveCustomTemplate = async () => {
    if (!customTestTitle.trim()) {
      alert('Por favor, informe o nome do questionario.');
      return;
    }

    for (let index = 0; index < customQuestions.length; index += 1) {
      const question = customQuestions[index];
      if (!question.question.trim()) {
        alert(`A pergunta no ${index + 1} esta com o enunciado vazio.`);
        return;
      }
      if (question.type === 'choice') {
        if (!question.options || question.options.length < 2) {
          alert(`A pergunta de multipla escolha no ${index + 1} precisa ter pelo menos 2 opcoes.`);
          return;
        }
        for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
          if (!question.options[optionIndex].trim()) {
            alert(`A opcao ${optionIndex + 1} da pergunta no ${index + 1} esta vazia.`);
            return;
          }
        }
      }
    }

    if (!planLimits.canUseAssessments) {
      alert(getPlanUpgradeMessage('Criação de testes personalizados'));
      return;
    }

    if (!editingTemplateId && customTemplates.length >= planLimits.customQuestionnaires) {
      alert(`Limite de ${planLimits.customQuestionnaires} testes personalizados atingido no plano ${planLimits.label}. Faça upgrade para o plano Ilimitado.`);
      return;
    }

    const templateId = editingTemplateId && isUuid(editingTemplateId)
      ? editingTemplateId
      : crypto.randomUUID();
    const existingTemplate = customTemplates.find((template) => template.id === editingTemplateId);
    const now = new Date().toISOString();
    const draftTemplate = {
      id: templateId,
      companyId: selectedCompanyId,
      title: customTestTitle,
      questions: customQuestions,
      createdAt: existingTemplate?.createdAt || now,
      updatedAt: now,
    };

    try {
      const savedTemplate = await saveCustomQuestionnaire(draftTemplate);
      const updatedTemplates = editingTemplateId
        ? customTemplates.map((template) => template.id === editingTemplateId ? savedTemplate : template)
        : [savedTemplate, ...customTemplates];

      localStorage.setItem('colaborh_custom_templates', JSON.stringify(updatedTemplates));
      setCustomTemplates(updatedTemplates);
      setEditingTemplateId(null);
      setIsCreatingNewTemplate(false);
      setCustomTestTitle('');
      setCustomQuestions([]);
      alert(editingTemplateId ? 'Questionario atualizado com sucesso na biblioteca!' : 'Questionario salvo com sucesso na biblioteca!');
    } catch (error) {
      console.error('Erro ao salvar questionario customizado:', error);
      alert('Nao foi possivel salvar o questionario customizado. Tente novamente.');
    }
  };

  const handleEditCustomTemplate = (template: CustomQuestionnaire) => {
    setEditingTemplateId(template.id);
    setIsCreatingNewTemplate(true);
    setCustomTestTitle(template.title);
    setCustomQuestions(template.questions || []);
  };

  const handleDeleteCustomTemplate = async (templateId: string) => {
    const confirmed = await colaborhConfirm({
      title: 'Excluir questionário?',
      message: 'Tem certeza que deseja excluir este questionário da biblioteca? Candidatos que já receberam este questionário não serão afetados.',
      variant: 'danger',
      confirmLabel: 'Excluir',
    });

    if (!confirmed) return;

    try {
        await deleteCustomQuestionnaire(templateId);
        const updatedTemplates = customTemplates.filter((template) => template.id !== templateId);
        localStorage.setItem('colaborh_custom_templates', JSON.stringify(updatedTemplates));
        setCustomTemplates(updatedTemplates);
      } catch (error) {
        console.error('Erro ao excluir questionario customizado:', error);
        alert('Nao foi possivel excluir o questionario customizado. Tente novamente.');
      }
  };

  const handleStartNewTemplate = () => {
    if (!planLimits.canUseAssessments) {
      alert(getPlanUpgradeMessage('Criação de testes personalizados'));
      return;
    }

    if (customTemplates.length >= planLimits.customQuestionnaires) {
      alert(`Limite de ${planLimits.customQuestionnaires} testes personalizados atingido no plano ${planLimits.label}. Faça upgrade para o plano Ilimitado.`);
      return;
    }

    setEditingTemplateId(null);
    setIsCreatingNewTemplate(true);
    setCustomTestTitle('');
    setCustomQuestions([]);
  };

  const handleCancelTemplateEdit = () => {
    setEditingTemplateId(null);
    setIsCreatingNewTemplate(false);
    setCustomTestTitle('');
    setCustomQuestions([]);
  };

  return {
    customQuestions,
    customTemplates,
    editingTemplateId,
    isCreatingNewTemplate,
    customTestTitle,
    isLoadingCustomTemplates,
    setCustomTestTitle,
    addCustomQuestion,
    removeCustomQuestion,
    updateCustomQuestionText,
    addOptionToChoice,
    removeOptionFromChoice,
    updateOptionText,
    updateCorrectOption,
    handleSaveCustomTemplate,
    handleEditCustomTemplate,
    handleDeleteCustomTemplate,
    handleStartNewTemplate,
    handleCancelTemplateEdit,
  };
};
