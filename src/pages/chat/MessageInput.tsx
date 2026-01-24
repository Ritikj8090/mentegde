"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, X, ImageIcon as ImageIconComponent, FileText, Smile } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilePreview {
  id: string
  file: File
  preview?: string
}

interface MessageInputProps {
  onSend: (message: string, files: File[]) => void
  disabled?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<FilePreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: FilePreview[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const handleSend = useCallback(() => {
    if (!message.trim() && files.length === 0) return

    onSend(
      message.trim(),
      files.map((f) => f.file)
    )
    setMessage("")
    setFiles([])
    textareaRef.current?.focus()
  }, [message, files, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div
      className={cn(
        "border-t border-border bg-card p-4 transition-colors",
        isDragging && "bg-primary/5 border-primary"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group flex items-center gap-2 rounded-lg border border-border bg-secondary p-2"
            >
              {file.preview ? (
                <img
                  src={file.preview || "/placeholder.svg"}
                  alt={file.file.name}
                  className="h-12 w-12 rounded object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="max-w-[120px]">
                <p className="text-xs font-medium truncate text-foreground">
                  {file.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept="image/*,.pdf,.doc,.docx,.txt,.zip"
        />
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            disabled={disabled}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            className="min-h-[44px] max-h-[120px] resize-none rounded-xl bg-secondary border-0 pr-4 focus-visible:ring-1 focus-visible:ring-primary"
            rows={1}
          />
        </div>

        <Button
          size="icon"
          className="shrink-0 rounded-xl h-11 w-11"
          onClick={handleSend}
          disabled={disabled || (!message.trim() && files.length === 0)}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <ImageIconComponent className="h-12 w-12 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Drop files here</p>
          </div>
        </div>
      )}
    </div>
  )
}
