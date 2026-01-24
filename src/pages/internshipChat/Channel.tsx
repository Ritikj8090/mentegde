import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getActiveChannelIcons, getChannelColor } from ".";
import { ChannelListType } from "@/index";

interface ChannelProps {
  channels: ChannelListType[];
  activeChannel: ChannelListType;
  setActiveChannel: React.Dispatch<React.SetStateAction<ChannelListType>>;
  unreadCounts: Record<string, number>;
}
const ChannelPage = ({
  channels,
  activeChannel,
  setActiveChannel,
  unreadCounts = { general: 1, tech: 2, management: 3 },
}: ChannelProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
        Channels
      </p>
      {channels.map((channel) => {
        const Icon = getActiveChannelIcons(channel.domain_name || "general");
        const isActive = activeChannel.id === channel.id;
        const unread = unreadCounts[channel.id];

        return (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              isActive
                ? " bg-muted-foreground/20"
                : " text-muted-foreground hover:bg-muted-foreground/10",
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-md border",
                isActive
                  ? getChannelColor(channel.domain_name || "general")
                  : " bg-muted-foreground/10 border-muted-foreground/10",
              )}
            >
              {Icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{channel.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {channel.domain_name === "tech"
                  ? "Technical discussions & coding help"
                  : channel.domain_name === "management"
                    ? "Project updates & coordination"
                    : "General chat & announcements"}
              </p>
            </div>
            {unread > 0 && (
              <Badge className="bg-emerald-500 text-white text-xs px-1.5 min-w-[20px] h-5">
                {unread}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChannelPage;
