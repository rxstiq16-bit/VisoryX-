"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

// Simple syntax highlighting using regex patterns
const tokenize = (code: string, language: string) => {
  const patterns: Record<string, { pattern: RegExp; className: string }[]> = {
    javascript: [
      { pattern: /(\/\/.*$)/gm, className: "text-muted-foreground" },
      { pattern: /(\/\*[\s\S]*?\*\/)/g, className: "text-muted-foreground" },
      { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, className: "text-green-400" },
      { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|super|extends|static|get|set|typeof|instanceof|in|of)\b/g, className: "text-purple-400" },
      { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: "text-orange-400" },
      { pattern: /\b(\d+\.?\d*)\b/g, className: "text-orange-400" },
      { pattern: /\b(console|Math|JSON|Object|Array|String|Number|Boolean|Date|Promise|Map|Set|Error)\b/g, className: "text-cyan-400" },
      { pattern: /(\{|\}|\[|\]|\(|\))/g, className: "text-foreground" },
      { pattern: /(=>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~])/g, className: "text-pink-400" },
    ],
    typescript: [
      { pattern: /(\/\/.*$)/gm, className: "text-muted-foreground" },
      { pattern: /(\/\*[\s\S]*?\*\/)/g, className: "text-muted-foreground" },
      { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, className: "text-green-400" },
      { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|super|extends|static|get|set|typeof|instanceof|in|of|type|interface|enum|namespace|declare|as|implements|readonly|private|public|protected|abstract)\b/g, className: "text-purple-400" },
      { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: "text-orange-400" },
      { pattern: /\b(\d+\.?\d*)\b/g, className: "text-orange-400" },
      { pattern: /:\s*(string|number|boolean|any|void|never|unknown|object)\b/g, className: "text-cyan-400" },
      { pattern: /\b(console|Math|JSON|Object|Array|String|Number|Boolean|Date|Promise|Map|Set|Error)\b/g, className: "text-cyan-400" },
    ],
    css: [
      { pattern: /(\/\*[\s\S]*?\*\/)/g, className: "text-muted-foreground" },
      { pattern: /([.#]?[\w-]+)(?=\s*\{)/g, className: "text-yellow-400" },
      { pattern: /([\w-]+)(?=\s*:)/g, className: "text-cyan-400" },
      { pattern: /:\s*([^;{}]+)/g, className: "text-green-400" },
      { pattern: /(@[\w-]+)/g, className: "text-purple-400" },
    ],
    html: [
      { pattern: /(&lt;!--[\s\S]*?--&gt;)/g, className: "text-muted-foreground" },
      { pattern: /(&lt;\/?)([\w-]+)/g, className: "text-pink-400" },
      { pattern: /([\w-]+)(?==)/g, className: "text-yellow-400" },
      { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, className: "text-green-400" },
    ],
    sql: [
      { pattern: /(--.*$)/gm, className: "text-muted-foreground" },
      { pattern: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|IS|NULL|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|DISTINCT|UNION|ALL|VALUES|SET|INTO)\b/gi, className: "text-purple-400" },
      { pattern: /('(?:[^'\\]|\\.)*')/g, className: "text-green-400" },
      { pattern: /\b(\d+\.?\d*)\b/g, className: "text-orange-400" },
    ],
    json: [
      { pattern: /("(?:[^"\\]|\\.)*")(?=\s*:)/g, className: "text-cyan-400" },
      { pattern: /:\s*("(?:[^"\\]|\\.)*")/g, className: "text-green-400" },
      { pattern: /:\s*(true|false|null)\b/g, className: "text-orange-400" },
      { pattern: /:\s*(\d+\.?\d*)/g, className: "text-orange-400" },
    ],
    bash: [
      { pattern: /(#.*$)/gm, className: "text-muted-foreground" },
      { pattern: /\b(sudo|npm|npx|yarn|pnpm|git|cd|ls|mkdir|rm|cp|mv|cat|echo|export|source|chmod|chown|curl|wget)\b/g, className: "text-green-400" },
      { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, className: "text-yellow-400" },
      { pattern: /(\$[\w]+)/g, className: "text-cyan-400" },
    ],
  }

  const lang = language?.toLowerCase() || "javascript"
  const rules = patterns[lang] || patterns.javascript

  let result = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  rules.forEach(({ pattern, className }) => {
    result = result.replace(pattern, (match) => `<span class="${className}">${match}</span>`)
  })

  return result
}

export function CodeBlock({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split("\n")
  const highlightedCode = tokenize(code, language)
  const highlightedLines = highlightedCode.split("\n")

  return (
    <div className={cn("group relative rounded-lg border bg-muted/50", className)}>
      {filename && (
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">{filename}</span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>

        <pre className="overflow-x-auto p-4 text-sm">
          <code>
            {highlightedLines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  highlightLines.includes(i + 1) && "bg-primary/10 -mx-4 px-4"
                )}
              >
                {showLineNumbers && (
                  <span className="mr-4 inline-block w-8 select-none text-right text-muted-foreground">
                    {i + 1}
                  </span>
                )}
                <span dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

// Markdown code block renderer
export function MarkdownCodeBlock({ children, className }: { children: string; className?: string }) {
  const match = /language-(\w+)/.exec(className || "")
  const language = match?.[1] || "text"
  
  return <CodeBlock code={children.trim()} language={language} />
}
