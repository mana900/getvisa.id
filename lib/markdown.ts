import { marked } from 'marked'

// Configure marked with safe defaults
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
})

/**
 * Convert markdown to HTML using the marked library
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) return ''
  
  try {
    // marked.parse is synchronous, marked() returns a promise in newer versions
    const result = marked.parse ? marked.parse(markdown) : marked(markdown)
    return typeof result === 'string' ? result : ''
  } catch (error) {
    console.error('Error parsing markdown:', error)
    // Fallback to original text with basic HTML escaping
    return markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
  }
}