type SchemaLikeError = {
  code?: string;
  message?: string;
};

export const getMissingPayloadColumn = (
  error: unknown,
  payload: Record<string, unknown>,
) => {
  if (!error || typeof error !== 'object') return null;
  const schemaError = error as SchemaLikeError;
  const message = schemaError.message || '';
  const normalizedMessage = message.toLowerCase();
  const isColumnError = schemaError.code === 'PGRST204'
    || schemaError.code === '42703'
    || (
      normalizedMessage.includes('column')
      && (
        normalizedMessage.includes('could not find')
        || normalizedMessage.includes('does not exist')
      )
    );

  if (!isColumnError) return null;

  const match = message.match(/Could not find the '([^']+)' column/i)
    || message.match(/column ["']?([a-zA-Z0-9_]+)["']? does not exist/i);
  const column = match?.[1] || null;
  return column && column in payload ? column : null;
};
