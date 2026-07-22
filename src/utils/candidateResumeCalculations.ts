export function calculateCandidateAge(birthDate: string): number {
  if (!birthDate) return 0;

  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

const getValidDate = (value: string | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function formatExperiencePeriod(start: string | null | undefined, end: string | null | undefined, current: boolean): string {
  const startDate = getValidDate(start);
  const endDate = current ? new Date() : getValidDate(end);

  if (!startDate || (!current && !endDate)) return '';

  const startYear = startDate.getFullYear();
  const endLabel = current ? 'Atual' : String(endDate?.getFullYear() || '');

  return endLabel ? `${startYear} - ${endLabel}` : String(startYear);
}

export function formatExperienceDurationWithPeriod(start: string | null | undefined, end: string | null | undefined, current: boolean): string {
  const duration = calculateExperienceDuration(start || '', end || null, current);
  const period = formatExperiencePeriod(start, end, current);

  return [duration, period].filter(Boolean).join(' | ');
}

export function calculateExperienceDuration(start: string, end: string | null, current: boolean): string {
  if (!start) return '';

  const startDate = getValidDate(start);
  const endDate = current ? new Date() : getValidDate(end);

  if (!startDate || (!current && !endDate)) return '';

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const yearStr = years > 0 ? `${years} ano${years > 1 ? 's' : ''}` : '';
  const monthStr = months > 0 ? `${months} mês${months > 1 ? 'es' : ''}` : '';

  return [yearStr, monthStr].filter(Boolean).join(' e ');
}
