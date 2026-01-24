import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileIcon,
  Download,
  ImageIcon as ImageIconComponent,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChatMessage } from "@/index";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { getRoleColor, getUserAvatarColor } from "../chatChannel";
import { Badge } from "@/components/ui/badge";

interface MessageBubbleProps {
  messageList: ChatMessage[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return ImageIconComponent;
  if (type.includes("pdf")) return FileText;
  return FileIcon;
}

export function FilePreview({ file }: { file: any }) {
  // IMAGE PREVIEW
  if (file.file_type.startsWith("image/")) {
    return (
      <img
        src={file.file_url}
        className="w-full rounded-lg border cursor-pointer"
        onClick={() => window.open(file.file_url, "_blank")}
      />
    );
  }

  // PDF PREVIEW
  if (file.file_type === "application/pdf") {
    const pdfThumb = file.file_url
      .replace("/raw/upload/", "/image/upload/")
      .replace(".pdf", ".jpg");
    return (
      <img
        src={pdfThumb}
        className="w-full h-40 object-cover rounded cursor-pointer"
        onClick={() => window.open(file.file_url)}
      />
    );
  }

  // OTHER FILES
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted">
      <p className="text-sm">{file.file_name}</p>
      <a href={file.file_url} target="_blank">
        Download
      </a>
    </div>
  );
}

function isCodeMessage(text: string) {
  if (!text) return false;
  if (text.startsWith("```")) return true;

  const codeRegex =
    /(function|const|let|var|class|import|export|def|return|=>|\{|\}|\(|\)|;)/;
  const multiline = text.split("\n").length > 2;

  return codeRegex.test(text) && multiline;
}

export function MessageBubble({ messageList }: MessageBubbleProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="space-y-4 h-full">
      {messageList.length === 0 ? (
        <p className="text-sm my-auto text-muted-foreground flex justify-center items-center w-full h-full">
          No messages yet
        </p>
      ) : (
        <>
          {messageList.map((message) => {
            const isCurrentUser = user?.id === message.sender_id;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "group flex gap-3",
                  isCurrentUser && "flex-row-reverse",
                )}
              >
                <Avatar className="h-9 w-9 mt-0.5 flex-shrink-0">
                  <AvatarImage
                    src={message.sender_avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback
                    className={cn(
                      "text-white text-sm",
                      getUserAvatarColor(message.sender_role),
                    )}
                  >
                    {(message.sender_name || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "flex items-center gap-2 mb-1",
                      isCurrentUser && "flex-row-reverse",
                    )}
                  >
                    <span
                      className={cn(
                        "font-medium text-sm capitalize",
                        getRoleColor(message.sender_role),
                      )}
                    >
                      {message.sender_name}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 h-4 capitalize",
                        message.sender_role === "mentor"
                          ? "border-cyan-500/30 text-cyan-400"
                          : message.sender_role === "user"
                            ? "border-amber-500/30 text-amber-400"
                            : "border-zinc-600 text-zinc-400",
                      )}
                    >
                      {message.sender_role === "mentor" ? "Mentor" : "Intern"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {message.created_at
                        ? formatTime(new Date(message.created_at))
                        : ""}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="relative">
                    {message.files.length <= 0 && (
                      <div
                        className={cn(
                          "rounded-xl px-3 py-2 max-w-[75%] w-fit",
                          isCurrentUser ? "bg-primary/10 ml-auto" : "bg-muted",
                        )}
                      >
                        {isCodeMessage(message.message) ? (
                          <pre className="bg-black text-green-400 text-xs p-3 rounded-lg overflow-x-auto">
                            <code>{message.message}</code>
                          </pre>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.message}
                          </p>
                        )}
                      </div>
                    )}

                   
                  </div>
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.files.map((attachment, i) => (
                        <div
                          key={i}
                          className={cn(
                            "rounded-lg border overflow-hidden w-60",
                          )}
                        >
                          <FilePreview file={attachment} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
}
