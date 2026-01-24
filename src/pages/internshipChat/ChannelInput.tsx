import { AtSign, PlusCircle, Send, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReplyPreview from "./ReplyPreview";

interface ChannelInputProps {
  activeChannelData: any;
  newMessage: string;
  setNewMessage: any;
  inputRef: any;
  replyingTo: any;
  setReplyingTo: any;
  handleSendMessage: any;
}

const ChannelInput = ({
  activeChannelData,
  newMessage,
  setNewMessage,
  inputRef,
  replyingTo,
  setReplyingTo,
  handleSendMessage,
}: ChannelInputProps) => {
  return (
    <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
      {/* Reply Preview */}
      <ReplyPreview replyingTo={replyingTo} setReplyingTo={setReplyingTo} />

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <div className="flex items-center gap-1 absolute left-2 bottom-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-700"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add attachment</TooltipContent>
            </Tooltip>
          </div>
          <Input
            ref={inputRef}
            placeholder={`Message #${activeChannelData.name.toLowerCase()}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="pl-12 pr-24 py-6 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 rounded-xl"
          />
          <div className="flex items-center gap-1 absolute right-2 bottom-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-700"
                >
                  <AtSign className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mention someone</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-700"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add emoji</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="h-12 w-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChannelInput;
