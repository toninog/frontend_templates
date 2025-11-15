import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

/**
 * Card - Reusable card component
 *
 * A simple card component with optional title and description.
 * TODO: Customize styling to match your design system.
 */
export function Card({ children, className, title, description }: CardProps) {
  return (
    <div className={clsx('card', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
          {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
