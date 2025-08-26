"use client"

import { useState, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, type, message, duration }
    
    setToasts(prev => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}