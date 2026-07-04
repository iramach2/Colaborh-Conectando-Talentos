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

export function calculateExperienceDuration(start: string, end: string | null, current: boolean): string {
  if (!start) return '';

  const startDate = new Date(start);
  const endDate = current ? new Date() : new Date(end || '');

  if (isNaN(startDate.getTime()) || (!current && isNaN(endDate.getTime()))) return '';

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
