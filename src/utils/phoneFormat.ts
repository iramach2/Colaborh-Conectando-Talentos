export const onlyPhoneDigits = (phone: string) => phone.replace(/\D/g, '').slice(0, 11);

export const formatBrazilianPhone = (phone: string) => {
  const digits = onlyPhoneDigits(phone);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
};
