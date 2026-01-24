import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface SearchBarProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
const SearchBar = ({
  showSearch,
  setShowSearch,
  searchQuery,
  setSearchQuery,
}: SearchBarProps) => {
  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-b border overflow-hidden"
        >
          <div className="p-3 flex items-center gap-2">
            <Input
              placeholder="Search messages in this channel..."
              className="flex-1 border placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(false)}
              className="text-muted-foreground hover:text-primary"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
