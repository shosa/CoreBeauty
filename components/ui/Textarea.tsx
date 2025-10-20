'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  icon?: string
  fullWidth?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, icon, fullWidth, className, ...props }, ref) => {
    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {icon && <span className="material-icons text-lg">{icon}</span>}
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'px-4 py-2.5 rounded-lg border border-gray-300 transition-all resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger flex items-center gap-1">
            <span className="material-icons text-sm">error</span>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
