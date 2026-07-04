const hasStringField = <TField extends string>(
  value: unknown,
  field: TField
): value is Record<TField, string> =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Record<TField, unknown>)[field] === 'string';

export const getReadableErrorMessage = (error: unknown) => {
  if (!error) return 'Erro desconhecido.';
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (hasStringField(error, 'message')) return error.message;
  if (hasStringField(error, 'error_description')) return error.error_description;
  if (hasStringField(error, 'details')) return error.details;

  try {
    return JSON.stringify(error);
  } catch {
    return 'Erro desconhecido.';
  }
};
