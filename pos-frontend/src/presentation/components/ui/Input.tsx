import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Input({ label, error, icon, iconRight, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <div className="input-inner">
        {icon && <span className="input-icon-left" aria-hidden="true">{icon}</span>}
        <input
          id={inputId}
          className={`input ${icon ? 'input-has-icon-left' : ''} ${iconRight ? 'input-has-icon-right' : ''} ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {iconRight && <span className="input-icon-right" aria-hidden="true">{iconRight}</span>}
      </div>
      {error && <span className="input-error-msg" role="alert">{error}</span>}
    </div>
  )
}
