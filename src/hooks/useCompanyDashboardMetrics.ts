import { useMemo } from 'react';

type JobLike = {
  status?: string | null;
  candidates_count?: number | null;
  created_at?: string | null;
  requirements?: string[] | string | null;
};

type ApplicationLike = {
  status?: string | null;
  created_at?: string | null;
};

const normalizeStatusLabel = (status?: string | null) =>
  (status || 'Triagem')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const isWithinLastSevenDays = (dateValue?: string | null) => {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return date >= sevenDaysAgo;
};

export const useCompanyDashboardMetrics = (
  companyJobs: JobLike[],
  companyApplications: ApplicationLike[]
) => useMemo(() => {
  const activeJobsCount = companyJobs.filter((job) => {
    const status = (job.status || '').toLowerCase();
    return status === 'active' || status === 'ativa' || status === '';
  }).length;

  const pausedJobsCount = companyJobs.filter((job) => {
    const status = (job.status || '').toLowerCase();
    return status === 'paused' || status === 'pausada';
  }).length;

  const closedJobsCount = companyJobs.filter((job) => {
    const status = (job.status || '').toLowerCase();
    return status === 'closed' || status === 'encerrada';
  }).length;

  const totalCandidatesCount = companyJobs.reduce(
    (acc, job) => acc + (job.candidates_count || 0),
    0
  );

  const totalCandidatesReal = companyApplications.length;

  const candidatesInInterview = companyApplications.filter((application) => {
    const status = (application.status || '').toLowerCase();
    return status === 'entrevista' || status === 'entrevistas';
  }).length;

  const closedOrPausedJobsCount = companyJobs.filter((job) => {
    const status = (job.status || '').toLowerCase();
    return status === 'paused' || status === 'pausada' || status === 'closed' || status === 'encerrada';
  }).length;

  const recentCandidatesCount = companyApplications.filter((application) => (
    isWithinLastSevenDays(application.created_at)
  )).length;

  const recentJobsCount = companyJobs.filter((job) => (
    isWithinLastSevenDays(job.created_at)
  )).length;

  const dynamicDistribution = (() => {
    const total = companyApplications.length;
    if (total === 0) {
      return [{ name: 'Triagem', value: 100, color: '#533af6' }];
    }

    const counts: Record<string, number> = {
      Triagem: 0,
      Entrevista: 0,
      Contratado: 0,
      Reprovado: 0,
      Outros: 0,
    };

    companyApplications.forEach((application) => {
      const status = normalizeStatusLabel(application.status);
      if (status === 'triagem' || status === 'analise de curriculo' || status.includes('curriculo')) {
        counts.Triagem += 1;
      } else if (status.includes('entrevista')) {
        counts.Entrevista += 1;
      } else if (status.includes('contrat')) {
        counts.Contratado += 1;
      } else if (status.includes('reprov')) {
        counts.Reprovado += 1;
      } else {
        counts.Outros += 1;
      }
    });

    const distribution = [
      { name: 'Triagem', value: Math.round((counts.Triagem / total) * 100), color: '#533af6' },
      { name: 'Entrevista', value: Math.round((counts.Entrevista / total) * 100), color: '#63e1a5' },
      { name: 'Contratado', value: Math.round((counts.Contratado / total) * 100), color: '#940dff' },
      { name: 'Reprovado', value: Math.round((counts.Reprovado / total) * 100), color: '#ff4b8c' },
      { name: 'Outros', value: Math.round((counts.Outros / total) * 100), color: '#ffc24b' },
    ];

    const filtered = distribution.filter((item) => item.value > 0);
    return filtered.length > 0 ? filtered : [{ name: 'Triagem', value: 100, color: '#533af6' }];
  })();

  const dynamicApplicationData = (() => {
    const formatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return {
        date,
        name: formatter.format(date),
        applications: 0,
      };
    });

    companyApplications.forEach((application) => {
      if (!application.created_at) return;
      const createdAt = new Date(application.created_at);
      createdAt.setHours(0, 0, 0, 0);
      const bucket = days.find((day) => day.date.getTime() === createdAt.getTime());
      if (bucket) bucket.applications += 1;
    });

    return days.map(({ name, applications }) => ({ name, applications }));
  })();

  const dynamicTopSkills = (() => {
    const counts = new Map<string, number>();

    companyJobs.forEach((job) => {
      const rawRequirements = Array.isArray(job.requirements)
        ? job.requirements
        : typeof job.requirements === 'string'
          ? job.requirements.split(/\n|,/)
          : [];

      rawRequirements.forEach((requirement) => {
        const normalized = requirement
          .replace(/^[\s\-\u2022]+/, '')
          .trim();

        if (normalized.length < 3) return;
        const label = normalized.length > 28 ? `${normalized.slice(0, 28).trim()}...` : normalized;
        counts.set(label, (counts.get(label) || 0) + 1);
      });
    });

    const ranked = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return ranked.length > 0 ? ranked : [{ name: 'Sem requisitos cadastrados', count: 0 }];
  })();

  return {
    activeJobsCount,
    pausedJobsCount,
    closedJobsCount,
    totalCandidatesCount,
    totalCandidatesReal,
    candidatesInInterview,
    closedOrPausedJobsCount,
    recentCandidatesCount,
    recentJobsCount,
    dynamicDistribution,
    dynamicApplicationData,
    dynamicTopSkills,
  };
}, [companyApplications, companyJobs]);
