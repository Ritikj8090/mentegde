import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reply, X } from "lucide-react";

interface ReplyPreviewProps {
  replyingTo: any;
  setReplyingTo: any;
}

const ReplyPreview = ({ replyingTo, setReplyingTo }: ReplyPreviewProps) => {
  return (
    <AnimatePresence>
      {replyingTo && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-2 overflow-hidden"
        >
          <div className="flex items-center justify-between p-2 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-2 min-w-0">
              <Reply className="h-4 w-4 text-zinc-500 flex-shrink-0" />
              <span className="text-xs text-zinc-500">Replying to</span>
              <span className="text-xs text-cyan-400 font-medium">
                {replyingTo.user.name}
              </span>
              <span className="text-xs text-zinc-600 truncate">
                {replyingTo.content}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-500 hover:text-white flex-shrink-0"
              onClick={() => setReplyingTo(null)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReplyPreview;
