import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatTime, getRoleColor, getUserAvatarColor } from ".";
import { Badge } from "@/components/ui/badge";
import { ChatFile, MessageListType } from "@/index";
import { RootState } from "@/components/store/store";
import { useSelector } from "react-redux";
import { MediaPreviewPopup } from "./Preview";
import { useState } from "react";

interface RegularMessagesProps {
  messageList: MessageListType[];
}

export function FilePreview({
  file,
  setIsOpen,
}: {
  file: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // IMAGE PREVIEW
  if (file.file_type.startsWith("image/")) {
    return (
      <img
        src={file.file_url}
        className="w-full rounded-lg border cursor-pointer"
        onClick={() => setIsOpen(true)}
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
        onClick={() => setIsOpen(true)}
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

const RegularMessages = ({ messageList }: RegularMessagesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [attachment, setAttachment] = useState<ChatFile | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const onDownload = (media: any) => {
    window.open(media.file_url, "_blank");
  };

  const onShare = (media: any) => {
    navigator.clipboard.writeText(media.file_url);
  };

  return (
    <>
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
                            isCurrentUser
                              ? "bg-primary/10 ml-auto"
                              : "bg-muted",
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

                      {/* Message Actions */}
                      {/* <div
                      className={cn(
                        "absolute -top-3 opacity-0 group-hover:opacity-100 transition-opacity",
                        isCurrentUser ? "left-0" : "right-0"
                      )}
                    >
                      <div className="flex items-center gap-0.5 border rounded-lg p-0.5 shadow-lg bg-background">
                        {quickEmojis.map((emoji) => (
                          <Tooltip key={emoji.key}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/20"
                              >
                                <emoji.icon className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{emoji.key}</TooltipContent>
                          </Tooltip>
                        ))}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/20"
                            >
                              <Reply className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reply</TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/20"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Pin className="h-4 w-4" /> Pin message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Bookmark className="h-4 w-4" /> Save message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Copy className="h-4 w-4" /> Copy text
                            </DropdownMenuItem>
                            {isCurrentUser && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2">
                                  <Edit3 className="h-4 w-4" /> Edit message
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 focus:text-red-400 gap-2">
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                  Delete message
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div> */}
                    </div>
                    {message.files && message.files.length > 0 && (
                      <div
                        className={cn(
                          "rounded-xl px-3 py-2 max-w-[75%] w-fit mt-2 space-y-2",
                          isCurrentUser ? " ml-auto" : "",
                        )}
                      >
                        {message.files.map((attachment, i) => (
                          <div
                            key={i}
                            className={cn(
                              "rounded-lg border overflow-hidden w-60",
                            )}
                            onClick={() => setAttachment(attachment)}
                          >
                            <FilePreview
                              file={attachment}
                              setIsOpen={setIsOpen}
                            />
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
      <MediaPreviewPopup
        media={attachment}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onDownload={() => onDownload(attachment)}
        onShare={() => onShare(attachment)}
      />
    </>
  );
};

export default RegularMessages;
