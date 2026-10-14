'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DocumentCategoryOption {
  id: string
  label: string
}

interface DocumentSearchProps {
  query: string
  onQueryChange: (value: string) => void
  placeholder?: string
  /** Optional category filter. Hidden when fewer than two options are provided. */
  category?: string
  categories?: DocumentCategoryOption[]
  onCategoryChange?: (value: string) => void
}

export function DocumentSearch({
  query,
  onQueryChange,
  placeholder = 'Cari dokumen…',
  category = 'all',
  categories = [],
  onCategoryChange,
}: DocumentSearchProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Cari dokumen"
          className="ps-9"
        />
      </div>

      {categories.length > 1 && onCategoryChange ? (
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-56" aria-label="Filter kategori">
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kategori</SelectItem>
            {categories.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  )
}
