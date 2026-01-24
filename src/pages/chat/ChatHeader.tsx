import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatUser } from "@/index";

interface ChatHeaderProps {
  selectedConversation: ChatUser | null;
  onBack?: () => void;
}

export function ChatHeader({ onBack, selectedConversation }: ChatHeaderProps) {

  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 w-full">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 md:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={selectedConversation?.avatar || "/placeholder.svg"}
              alt={selectedConversation?.name}
            />
            <AvatarFallback className="bg-primary/20 text-primary">
              AA
            </AvatarFallback>
          </Avatar>
          {/* {participant.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
          )} */}
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{selectedConversation?.name}</h2>
          {/* <p className="text-xs text-muted-foreground">
            {participant.role === "mentor" ? "Mentor" : "Student"} •{" "}
            {participant.isOnline ? (
              <span className="text-emerald-500">Online</span>
            ) : (
              "Offline"
            )}
          </p> */}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Video className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Search Messages</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
