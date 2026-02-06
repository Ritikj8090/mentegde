import {  ChatUser } from "@/index";
import { UPLOAD_PHOTOS_URL } from "@/components/config/CommonBaseUrl";

interface ChannelHeaderProps {
  activeConversation: ChatUser;
}

const ChannelHeader = ({
  activeConversation,
}: ChannelHeaderProps) => {
  return (
    <div className="h-14 px-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={activeConversation.avatar} alt="" className=" h-8 w-8 rounded-full" />
        <div>
          <h3 className="font-semibold">{activeConversation.name}</h3>
          <p className="text-xs  text-muted-foreground">
            {activeConversation.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;
