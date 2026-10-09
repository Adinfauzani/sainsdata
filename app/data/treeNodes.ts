import { spmiCategories } from '@/data/spmi'
import type { TreeNode } from '@/types'

export const spmiTreeNodes: TreeNode[] = spmiCategories.map((category) => ({
  id: `spmi-${category.id}`,
  label: category.nama,
  href: `/spmi?kategori=${category.id}`,
}))
