import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
const SearchPage = ({ searchQuery, setSearchQuery }: SearchPageProps) => {
  return (
    <div className="p-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 border placeholder:text-muted-foreground h-9"
        />
      </div>
    </div>
  );
};

export default SearchPage;
