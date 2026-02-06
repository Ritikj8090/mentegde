import { AtSign, FileText, ImageIcon, PlusCircle, Send, Smile, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatUser } from "@/index";
import { useCallback, useRef, useState } from "react";
import { formatFileSize } from "@/constant/HelperFunctions";

interface ChannelInputProps {
  activeConversation: ChatUser | null;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleSendMessage: (msg: string, files: File[]) => Promise<void>;
}

interface FilePreview {
  id: string;
  file: File;
  preview?: string;
}

const ChannelInput = ({
  activeConversation,
  newMessage,
  setNewMessage,
  inputRef,
  handleSendMessage,
}: ChannelInputProps) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Select Files
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || isUploading) return;

    const newFiles: FilePreview[] = Array.from(selectedFiles).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, [isUploading]);

  // Remove file
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // SEND MESSAGE
  const handleSend = useCallback(async () => {
    if (isUploading) return;
    if (!newMessage.trim() && files.length === 0) return;

    try {
      setIsUploading(true);

      await handleSendMessage(
        newMessage.trim(),
        files.map((f) => f.file),
      );

      setNewMessage("");
      setFiles([]);
    } finally {
      setIsUploading(false);
    }
  }, [newMessage, files, handleSendMessage, isUploading]);

  // Drag Drop
  const handleDragOver = (e: React.DragEvent) => {
    if (isUploading) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isUploading) return;
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div
      className="p-4 border-t relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* FILE PREVIEW BAR */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file) => (
            <div key={file.id} className="relative group flex items-center gap-2 rounded-lg border bg-secondary p-2">
              {file.preview ? (
                <img src={file.preview} className="h-12 w-12 rounded object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center bg-primary/10 rounded">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              )}

              <div className="max-w-[120px]">
                <p className="text-xs font-medium truncate">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.file.size)}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 h-5 w-5 bg-destructive text-white opacity-0 group-hover:opacity-100"
                onClick={() => removeFile(file.id)}
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* INPUT BAR */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          {/* LEFT ICON */}
          <div className="absolute left-2 bottom-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* FILE INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            disabled={isUploading}
          />

          {/* TEXT INPUT */}
          <Input
            ref={inputRef}
            placeholder={`Type a message...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isUploading}
            className="pl-12 pr-24 py-6 rounded-xl"
          />

          {/* RIGHT ICONS */}
          {/* <div className="absolute right-2 bottom-2 flex gap-1">
            <Button variant="ghost" size="icon" disabled={isUploading}>
              <AtSign className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled={isUploading}>
              <Smile className="h-4 w-4" />
            </Button>
          </div> */}
        </div>

        {/* SEND BUTTON */}
        <Button
          onClick={handleSend}
          disabled={isUploading || (!newMessage.trim() && files.length === 0)}
          className="h-12 w-12 rounded-xl"
        >
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>

      {/* DRAG OVER UI */}
      {isDragging && !isUploading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur flex items-center justify-center rounded-lg">
          <div className="text-center">
            <ImageIcon className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Drop files here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelInput;
