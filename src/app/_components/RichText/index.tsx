import React from 'react'
import classes from './index.module.scss'

type Props = {
  content: unknown // Lexical rich text content from Payload
  className?: string
}

export const RichText: React.FC<Props> = ({ content, className }) => {
  if (!content) return null

  // Payload Lexical serialized content - render root children
  const data = content as { root?: { children?: RichTextNode[] } }
  if (!data.root?.children) return null

  return (
    <div className={`${classes.richText} ${className || ''}`}>
      {data.root.children.map((node, i) => (
        <RichTextNode key={i} node={node} />
      ))}
    </div>
  )
}

type RichTextNode = {
  type: string
  tag?: string
  text?: string
  format?: number
  children?: RichTextNode[]
  url?: string
  listType?: string
}

const RichTextNode: React.FC<{ node: RichTextNode }> = ({ node }) => {
  // Text node
  if (node.type === 'text') {
    let text: React.ReactNode = node.text || ''
    if (node.format) {
      if (node.format & 1) text = <strong>{text}</strong>
      if (node.format & 2) text = <em>{text}</em>
      if (node.format & 8) text = <u>{text}</u>
      if (node.format & 16) text = <code>{text}</code>
    }
    return <>{text}</>
  }

  // Linebreak
  if (node.type === 'linebreak') return <br />

  const children = node.children?.map((child, i) => (
    <RichTextNode key={i} node={child} />
  ))

  switch (node.type) {
    case 'paragraph':
      return <p>{children}</p>
    case 'heading':
      const Tag = (node.tag || 'h2') as keyof JSX.IntrinsicElements
      return <Tag>{children}</Tag>
    case 'list':
      return node.listType === 'number' ? (
        <ol>{children}</ol>
      ) : (
        <ul>{children}</ul>
      )
    case 'listitem':
      return <li>{children}</li>
    case 'link':
      return <a href={node.url || '#'}>{children}</a>
    case 'quote':
      return <blockquote>{children}</blockquote>
    default:
      return <>{children}</>
  }
}
