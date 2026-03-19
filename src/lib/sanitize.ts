export const sanitizeInput = (str: string): string => {
  if (!str) return "";
  // Strip HTML tags
  const noHtml = str.replace(/<[^>]*>?/gm, '');
  // Optionally escape basic special chars if needed, but modern React handles XSS well.
  // We'll strip some control characters just in case.
  return noHtml.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
