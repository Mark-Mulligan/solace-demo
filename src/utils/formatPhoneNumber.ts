export function formatPhoneNumber(phone: number): string {
  const phoneString = phone.toString();
  const cleaned = phoneString.replace(/\D/g, "");
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    const [, area, prefix, line] = match;
    return `(${area}) ${prefix}-${line}`;
  }

  return phoneString;
}
