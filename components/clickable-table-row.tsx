'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TableRow } from '@/components/ui/table'

interface ClickableTableRowProps extends React.ComponentProps<typeof TableRow> {
  href: string
}

export function ClickableTableRow({ href, children, className, ...props }: ClickableTableRowProps) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch(href)
  }, [href, router])

  return (
    <TableRow
      onClick={() => router.push(href)}
      className={`cursor-pointer ${className || ''}`}
      {...props}
    >
      {children}
    </TableRow>
  )
}
