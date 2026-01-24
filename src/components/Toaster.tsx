import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X, AlertCircle, Info, PartyPopper } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastData {
  id: string
  type: ToastType
  title: string
  href?: string
  description?: string
  duration?: number
  showConfetti?: boolean
}

interface ToastContextType {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, "id">) => string
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

/* ------------------ HOOK ------------------ */
export function Toaster() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useCustomToast must be used within CustomToastProvider")
  }
  return context
}

/* ------------------ PROVIDER ------------------ */
export function CustomToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const addToast = React.useCallback((toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

/* ------------------ CONTAINER ------------------ */
function ToastContainer() {
  const { toasts, removeToast } = Toaster()
  const isActive = toasts.length > 0

  // 🔒 Lock background
  React.useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden"
      document.body.style.cursor = "default"
    } else {
      document.body.style.overflow = ""
      document.body.style.cursor = ""
    }
  }, [isActive])

  return (
    <>
      {/* 🔒 BACKDROP */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* TOAST */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <AnimatePresence mode="wait">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

/* ------------------ TOAST ITEM ------------------ */
function ToastItem({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  const [progress, setProgress] = React.useState(100)
  const duration = toast.duration ?? 5000

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - 100 / (duration / 50)
        if (next <= 0) {
          clearInterval(interval)
          {toast.href && window.location.replace(toast.href)}
          onClose()
          return 0
        }
        return next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration, onClose, toast.href])

  const Icon = {
    success: Check,
    error: X,
    info: Info,
    warning: AlertCircle,
  }[toast.type]

  const iconColors = {
    success: "text-emerald-400",
    error: "text-red-400",
    info: "text-blue-400",
    warning: "text-amber-400",
  }

  const progressColors = {
    success: "bg-emerald-400",
    error: "bg-red-400",
    info: "bg-blue-400",
    warning: "bg-amber-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl shadow-black/40"
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 opacity-10 blur-2xl ${
          toast.type === "success"
            ? "bg-emerald-500"
            : toast.type === "error"
            ? "bg-red-500"
            : toast.type === "info"
            ? "bg-blue-500"
            : "bg-amber-500"
        }`}
      />

      <div className="relative p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`rounded-full p-1 ${iconColors[toast.type]}`}>
            <Icon className="h-8 w-8" strokeWidth={3} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            {toast.title}
            {toast.showConfetti && (
              <PartyPopper className="h-6 w-6 text-amber-400" />
            )}
          </h3>
          {toast.description && (
            <p className="text-zinc-400">{toast.description}</p>
          )}
        </div>

        {/* Progress */}
        <div className="mt-6 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${progressColors[toast.type]}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        </div>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  )
}
