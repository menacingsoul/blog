/**
 * Estimate reading time for HTML content.
 * Strips HTML tags and counts words, assuming ~200 words per minute.
 */
export const estimateReadingTime = (htmlContent: string): number => {
  const text = htmlContent.replace(/<[^>]*>/g, '').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
};
