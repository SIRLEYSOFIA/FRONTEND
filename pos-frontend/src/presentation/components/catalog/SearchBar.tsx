import React, { useRef } from 'react'
import { Input } from '@presentation/components/ui/Input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onBarcodeScanned?: (barcode: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, onBarcodeScanned, placeholder = 'Search by name, SKU or barcode...' }: SearchBarProps) {
  const barcodeBuffer = useRef('')
  const barcodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Barcode scanners typically send characters very fast followed by Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeBuffer.current.length > 4) {
      onBarcodeScanned?.(barcodeBuffer.current)
      barcodeBuffer.current = ''
      return
    }
    if (e.key.length === 1) {
      barcodeBuffer.current += e.key
      if (barcodeTimer.current) clearTimeout(barcodeTimer.current)
      barcodeTimer.current = setTimeout(() => { barcodeBuffer.current = '' }, 100)
    }
  }

  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      icon={<span>🔍</span>}
      aria-label="Search products"
      autoComplete="off"
      autoFocus
    />
  )
}
