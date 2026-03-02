import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe HTML tags (from rich text editors) while stripping dangerous ones.
 */
export const sanitizeHtml = (dirty: string): string => {
  return sanitizeHtmlLib(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'strong', 'em', 'u', 's', 'del', 'ins',
      'a', 'img', 'video', 'iframe',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'sub', 'sup',
    ],
    allowedAttributes: {
      '*': ['class', 'style'],
      'a': ['href', 'target', 'rel', 'title'],
      'img': ['src', 'alt', 'width', 'height'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      'video': ['src', 'width', 'height', 'controls', 'autoplay', 'loop', 'muted'],
      'th': ['colspan', 'rowspan'],
      'td': ['colspan', 'rowspan'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'youtube.com', 'vimeo.com'],
  });
};
