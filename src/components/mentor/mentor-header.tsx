import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apis from "@/services/api";

interface MentorHeaderProps {
  mentor: any;
}

export default function MentorHeader({ mentor }: MentorHeaderProps) {
  const [followStatus, setFollowStatus] = useState<
    "follow" | "pending" | "following"
  >("follow");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mentor?.id) return;

    const checkStatus = async () => {
      try {
        const res = await apis.checkFollowStatus(mentor.id);
        if (res.isPending) {
          setFollowStatus("pending");
        } else if (res.isFollowing) {
          setFollowStatus("following");
        } else {
          setFollowStatus("follow");
        }
      } catch (error) {
        console.error("Follow status error:", error);
      }
    };

    checkStatus();
  }, [mentor?.id]);

  const handleFollow = async () => {
    try {
      setLoading(true);
      await apis.followMentor(mentor.id);
      setFollowStatus("pending"); // When you click follow, status becomes pending immediately
    } catch (error) {
      console.error("Follow request error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoading(true);
      await apis.unfollowMentor(mentor.id);
      setFollowStatus("follow"); // Back to "Follow" state
    } catch (error) {
      console.error("Unfollow request error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    if (!mentor?.id || !mentor?.username) return;
    navigate(`/chat?userId=${mentor.id}&username=${mentor.username}`);
  };

  return (
    <header className="flex flex-col md:flex-row gap-6 bg-muted p-6 rounded-lg">
      <img
        src={
          mentor?.avatar ||
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9439775.jpg-4JVJWOjPksd3DtnBYJXoWHA5lc1DU9.jpeg"
        }
        alt={mentor?.username || "Mentor"}
        width={200}
        height={250}
        className="object-cover rounded-lg shadow-md"
      />
      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground">#{mentor?.ranking || "N/A"}</p>
          <h1 className="text-2xl font-bold">
            {mentor?.username || "Unknown Mentor"}
          </h1>
          <p className="text-muted-foreground">
            {mentor?.title || "No title provided"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare size={16} />
          <p>
            Speaks: {mentor?.languages || "English"}{" "}
            <Badge variant="outline">{mentor?.languageLevel || "NATIVE"}</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          {followStatus === "follow" && (
            <Button disabled={loading} onClick={handleFollow}>
              {loading ? "Loading..." : "Follow"}
            </Button>
          )}
          {followStatus === "pending" && (
            <Button disabled variant="outline">
              Pending
            </Button>
          )}
          {followStatus === "following" && (
            <div className="flex gap-2">
              <Button disabled variant="secondary">
                Following
              </Button>
              <Button
                variant="destructive"
                disabled={loading}
                onClick={handleUnfollow}
              >
                {loading ? "Loading..." : "Unfollow"}
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            disabled={followStatus !== "following"}
            onClick={handleMessage}
          >
            Message
          </Button>
        </div>
      </div>
    </header>
  );
}
