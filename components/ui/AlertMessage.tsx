import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

export function AlertMessage({ type, message }: { type: 'error' | 'success', message: string }) {
  if (!message) return null
  
  if (type === 'error') {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2 mb-6">
        <AlertCircle size={20} />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center space-x-2 mb-6">
      <CheckCircle size={20} />
      <span>{message}</span>
    </div>
  )
}
