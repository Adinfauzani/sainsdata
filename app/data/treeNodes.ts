import type { TreeNode } from '@/types'
import { bpmExternalLinks, bpmNavigation, type BpmRouteNode } from '@/data/bpm'

export interface MainNavLink {
  href: string
  label: string
}

/**
 * Top-level site navigation shared by the desktop navbar and the mobile drawer.
 * The BPM entry opens the BPM information architecture tree.
 */
export const mainNavLinks: MainNavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/profile', label: 'Profile' },
  { href: '/bpm/profile', label: 'BPM' },
  { href: '/akreditasi', label: 'Akreditasi' },
  { href: '/contact', label: 'Contact' },
]

function toTreeNodes(nodes: BpmRouteNode[]): TreeNode[] {
  return nodes.map((node) => ({
    id: node.id,
    label: node.navLabel,
    href: node.pathname,
    children: node.children?.length ? toTreeNodes(node.children) : undefined,
  }))
}

/** BPM navigation tree derived from the centralized route registry. */
export const bpmTreeNodes: TreeNode[] = [
  ...toTreeNodes(bpmNavigation),
  ...bpmExternalLinks.map((link) => ({
    id: link.id,
    label: link.navLabel,
    href: link.url,
    external: true,
  })),
]
