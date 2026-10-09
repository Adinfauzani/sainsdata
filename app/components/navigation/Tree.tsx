'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TreeNode } from '@/types'

interface TreeItemProps {
  node: TreeNode
  depth: number
  activeId?: string
  expandedIds: Set<string>
  onToggle: (id: string) => void
  onNavigate?: () => void
}

function hasChildren(node: TreeNode): boolean {
  return !!node.children && node.children.length > 0
}

function isNodeActive(node: TreeNode, activeId?: string, pathname?: string): boolean {
  if (activeId && node.id === activeId) return true
  if (pathname && node.href && node.href === pathname) return true
  return false
}

function TreeItem({ node, depth, activeId, expandedIds, onToggle, onNavigate }: TreeItemProps) {
  const pathname = usePathname()
  const expandable = hasChildren(node)
  const expanded = expandedIds.has(node.id)
  const active = isNodeActive(node, activeId, pathname)

  const Icon = expandable ? (expanded ? FolderOpen : Folder) : FileText

  const content = (
    <>
      <span
        role="presentation"
        className={cn(
          'flex size-5 shrink-0 items-center justify-center text-muted-foreground/70 transition-transform duration-150',
          expandable && 'rounded-[4px] hover:bg-accent',
          expanded && 'rotate-90'
        )}
      >
        {expandable ? <ChevronRight className="size-3.5" /> : null}
      </span>
      <Icon
        className={cn(
          'size-3.5 shrink-0',
          expandable ? 'text-muted-foreground' : 'text-muted-foreground/70',
          active && 'text-primary'
        )}
        aria-hidden
      />
      <span className="truncate">{node.label}</span>
      {node.meta ? (
        <span className="ml-auto shrink-0 pr-1 font-mono text-[11px] tabular-nums text-muted-foreground/80">
          {node.meta}
        </span>
      ) : null}
      <span className={cn('ml-auto size-1.5 shrink-0 rounded-full', active ? 'bg-primary' : 'bg-transparent')} />
    </>
  )

  const classes = cn(
    'group flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-sm leading-none transition-colors duration-150 outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring/60',
    depth === 0 ? 'pl-1.5' : 'pl-2',
    active
      ? 'bg-primary/8 font-medium text-primary'
      : 'text-foreground/85 hover:bg-accent hover:text-foreground'
  )

  return (
    <li>
      <div className="flex">
        <span
          aria-hidden
          className={cn(
            'me-1.5 w-px shrink-0 self-stretch',
            depth === 0 ? 'bg-transparent' : 'bg-border',
            active && 'bg-primary/40'
          )}
        />
        {expandable ? (
          <button
            type="button"
            className={classes}
            aria-expanded={expanded}
            onClick={() => onToggle(node.id)}
          >
            {content}
          </button>
        ) : node.href ? (
          <Link href={node.href} className={classes} onClick={onNavigate}>
            {content}
          </Link>
        ) : (
          <button type="button" className={classes} onClick={onToggle.bind(null, node.id)}>
            {content}
          </button>
        )}
      </div>

      {expandable && expanded ? (
        <ul className="ms-2">
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              activeId={activeId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function collectExpandableIds(nodes: TreeNode[], out = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (hasChildren(node)) {
      out.add(node.id)
      collectExpandableIds(node.children ?? [], out)
    }
  }
  return out
}

function collectAncestorIds(nodes: TreeNode[], targetId: string, path = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (node.id === targetId) return path
    if (hasChildren(node)) {
      const next = new Set(path)
      next.add(node.id)
      const found = collectAncestorIds(node.children ?? [], targetId, next)
      if (found) return found
    }
  }
  return path
}

function findNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return undefined
}

interface TreeProps {
  nodes: TreeNode[]
  activeId?: string
  defaultExpandedIds?: string[]
  onNodeSelect?: (node: TreeNode) => void
  className?: string
  'aria-label'?: string
}

export function Tree({ nodes, activeId, defaultExpandedIds, onNodeSelect, className, ...props }: TreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const defaults = new Set(defaultExpandedIds ?? collectExpandableIds(nodes))
    if (activeId) collectAncestorIds(nodes, activeId).forEach((id) => defaults.add(id))
    return defaults
  })

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggle = (id: string) => {
    const node = findNode(nodes, id)
    if (node && !hasChildren(node) && onNodeSelect) {
      onNodeSelect(node)
      return
    }
    toggle(id)
  }

  return (
    <ul className={cn('space-y-0.5', className)} {...props}>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          depth={0}
          activeId={activeId}
          expandedIds={expandedIds}
          onToggle={handleToggle}
          onNavigate={onNodeSelect ? () => onNodeSelect(node) : undefined}
        />
      ))}
    </ul>
  )
}