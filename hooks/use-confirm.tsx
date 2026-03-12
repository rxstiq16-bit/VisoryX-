"use client"

import { useState, useCallback, createContext, useContext } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean
  resolve: ((value: boolean) => void) | null
}

const ConfirmContext = createContext<{
  confirm: (options?: ConfirmOptions) => Promise<boolean>
} | null>(null)

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider")
  }
  return context.confirm
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    resolve: null,
    title: "Are you sure?",
    description: "This action cannot be undone.",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default"
  })

  const confirm = useCallback((options: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        resolve,
        title: options.title || "Are you sure?",
        description: options.description || "This action cannot be undone.",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        variant: options.variant || "default"
      })
    })
  }, [])

  const handleConfirm = () => {
    state.resolve?.(true)
    setState(prev => ({ ...prev, isOpen: false, resolve: null }))
  }

  const handleCancel = () => {
    state.resolve?.(false)
    setState(prev => ({ ...prev, isOpen: false, resolve: null }))
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={state.isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {state.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={state.variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {state.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}
