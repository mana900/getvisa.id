"use client"

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Link, List, Hash } from 'lucide-react'
import { markdownToHtml } from '@/lib/markdown'

interface SimpleEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

export function SimpleEditor({ 
  value = '', 
  onChange, 
  placeholder = "Start writing...",
  className = "min-h-96"
}: SimpleEditorProps) {
  const [content, setContent] = useState(value)

  useEffect(() => {
    setContent(value)
  }, [value])

  const handleChange = (newContent: string) => {
    setContent(newContent)
    onChange?.(newContent)
  }

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.slice(start, end)
    
    const newText = content.slice(0, start) + before + selectedText + after + content.slice(end)
    
    handleChange(newText)
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  // Convert markdown to HTML using the marked library (same as production output)
  const convertToHtml = (markdown: string) => {
    return markdownToHtml(markdown)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('**', '**')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('*', '*')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('\n# ', '')}
          title="Heading 1"
        >
          <Hash className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('\n## ', '')}
          title="Heading 2"
        >
          H2
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('\n* ', '')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('[', '](url)')}
          title="Link"
        >
          <Link className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />

      {/* Preview */}
      {content && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">Preview:</h4>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: convertToHtml(content) }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}