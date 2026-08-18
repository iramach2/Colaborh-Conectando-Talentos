export type AssessmentMarkerStatus = 'NONE' | 'PENDING' | 'COMPLETED';

const PENDING_MARKER = 'PENDING';
const PENDING_SNAPSHOT_MARKER = 'PENDING:::';
const COMPLETED_MARKERS = ['COMPLETED===', 'COMPLETED:::'];

export const getAssessmentMarkerStatus = (value?: string | null): AssessmentMarkerStatus => {
  const normalizedValue = (value || '').trim();
  if (!normalizedValue) return 'NONE';

  if (normalizedValue === PENDING_MARKER || normalizedValue.startsWith(PENDING_SNAPSHOT_MARKER)) {
    return 'PENDING';
  }

  if (COMPLETED_MARKERS.some((marker) => normalizedValue.startsWith(marker))) {
    return 'COMPLETED';
  }

  return 'NONE';
};

export const getCompletedAssessmentBody = (value: string): string => {
  const valueWithoutDate = value.split('===DATE===')[0].trim();
  const marker = COMPLETED_MARKERS.find((candidate) => valueWithoutDate.startsWith(candidate));
  return marker ? valueWithoutDate.slice(marker.length).trim() : valueWithoutDate;
};

export const isCompletedAssessmentValue = (value?: string | null): boolean => (
  getAssessmentMarkerStatus(value) === 'COMPLETED'
);
