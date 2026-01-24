import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Code, Copy, Edit3, FileText, MoreHorizontal, Pin, Reply, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { emojiMap, formatTime, getRoleColor, Message, quickEmojis, User } from ".";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Channel from "./Channel";

interface PinnedMessagesProps {
  activeChannel: Channel;
  messages: Record<Channel, Message[]>;
  currentUser: User;
  handleReaction: (messageId: string, emoji: string) => void;
  setReplyingTo: (message: Message | null) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;

}

const PinnedMessages = ({ activeChannel, messages, currentUser, handleReaction, setReplyingTo, messagesEndRef }: PinnedMessagesProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {/* Pinned Messages */}
        {messages[activeChannel].filter((m) => m.isPinned).length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
              <Pin className="h-3 w-3" />
              <span>Pinned Messages</span>
            </div>
            {messages[activeChannel]
              .filter((m) => m.isPinned)
              .map((message) => (
                <div
                  key={message.id}
                  className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-2"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={message.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs">
                        {message.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white">
                          {message.user.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 h-4 border-amber-500/30 text-amber-400"
                        >
                          Pinned
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-300 mt-1">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Regular Messages */}
        {messages[activeChannel]
          .filter((m) => !m.isPinned)
          .map((message, index, arr) => {
            const showAvatar =
              index === 0 || arr[index - 1]?.user.id !== message.user.id;
            const isCurrentUser = message.user.id === currentUser.id;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("group flex gap-3", !showAvatar && "pl-12")}
              >
                {showAvatar && (
                  <Avatar className="h-9 w-9 mt-0.5 flex-shrink-0">
                    <AvatarImage
                      src={message.user.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback
                      className={cn(
                        "text-white text-sm",
                        message.user.role === "mentor"
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                          : message.user.role === "admin"
                            ? "bg-gradient-to-br from-amber-500 to-orange-600"
                            : "bg-gradient-to-br from-violet-500 to-purple-600",
                      )}
                    >
                      {message.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  {showAvatar && (
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "font-medium text-sm",
                          getRoleColor(message.user.role),
                        )}
                      >
                        {message.user.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 h-4 capitalize",
                          message.user.role === "mentor"
                            ? "border-cyan-500/30 text-cyan-400"
                            : message.user.role === "admin"
                              ? "border-amber-500/30 text-amber-400"
                              : "border-zinc-600 text-zinc-400",
                        )}
                      >
                        {message.user.role}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.isEdited && (
                        <span className="text-xs text-zinc-600">(edited)</span>
                      )}
                    </div>
                  )}

                  {/* Reply Context */}
                  {message.replyTo && (
                    <div className="flex items-center gap-2 mb-1 pl-3 border-l-2 border-zinc-700">
                      <Reply className="h-3 w-3 text-zinc-500" />
                      <span className="text-xs text-zinc-500">
                        Replying to{" "}
                        <span className="text-zinc-400">
                          {message.replyTo.user}
                        </span>
                      </span>
                      <span className="text-xs text-zinc-600 truncate max-w-[200px]">
                        {message.replyTo.content}
                      </span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="relative">
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap break-words">
                      {message.content}
                    </p>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, i) => (
                          <div
                            key={i}
                            className={cn(
                              "rounded-lg border overflow-hidden",
                              attachment.type === "image"
                                ? "max-w-xs"
                                : "bg-zinc-800/50 border-zinc-700",
                            )}
                          >
                            {attachment.type === "image" ? (
                              <img
                                src={attachment.url || "/placeholder.svg"}
                                alt={attachment.name}
                                className="w-full h-auto"
                              />
                            ) : attachment.type === "code" ? (
                              <div className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Code className="h-4 w-4 text-emerald-400" />
                                  <span className="text-sm text-zinc-300">
                                    {attachment.name}
                                  </span>
                                </div>
                                <pre className="text-xs text-zinc-400 bg-zinc-900 p-2 rounded overflow-x-auto">
                                  {attachment.preview}
                                </pre>
                              </div>
                            ) : (
                              <div className="p-3 flex items-center gap-3">
                                <FileText className="h-8 w-8 text-blue-400" />
                                <div>
                                  <p className="text-sm text-zinc-300">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    Click to download
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.reactions.map((reaction) => (
                          <button
                            key={reaction.emoji}
                            onClick={() =>
                              handleReaction(message.id, reaction.emoji)
                            }
                            className={cn(
                              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors",
                              reaction.reacted
                                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                                : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600",
                            )}
                          >
                            <span>
                              {emojiMap[reaction.emoji] || reaction.emoji}
                            </span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message Actions */}
                    <div className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-0.5 bg-zinc-800 border border-zinc-700 rounded-lg p-0.5 shadow-lg">
                        {quickEmojis.map((emoji) => (
                          <Tooltip key={emoji.key}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700"
                                onClick={() =>
                                  handleReaction(message.id, emoji.key)
                                }
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
                              className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700"
                              onClick={() => setReplyingTo(message)}
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
                              className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-700"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-zinc-900 border-zinc-800"
                          >
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white gap-2">
                              <Pin className="h-4 w-4" /> Pin message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white gap-2">
                              <Bookmark className="h-4 w-4" /> Save message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white gap-2">
                              <Copy className="h-4 w-4" /> Copy text
                            </DropdownMenuItem>
                            {isCurrentUser && (
                              <>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white gap-2">
                                  <Edit3 className="h-4 w-4" /> Edit message
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400 gap-2">
                                  <Trash2 className="h-4 w-4" /> Delete message
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default PinnedMessages;
