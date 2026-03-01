import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe HTML tags (from rich text editors) while stripping dangerous ones.
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'strong', 'em', 'u', 's', 'del', 'ins',
      'a', 'img', 'video', 'iframe',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'sub', 'sup',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title',
      'width', 'height', 'class', 'style',
      'colspan', 'rowspan',
      'frameborder', 'allowfullscreen',
    ],
    ALLOW_DATA_ATTR: false,
  });
};
