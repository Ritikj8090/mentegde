import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Lightbulb, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AddConcepts } from "./AddConcepts";
import { Concept } from "@/index";

interface WorkboardSectionProps {
  concepts: Concept[];
  milestoneId: string;
  role: string;
}

const MilestonesConcept = ({
  concepts,
  milestoneId,
  role,
}: WorkboardSectionProps) => {
  const [showAddConcepts, setShowAddConcepts] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount = concepts.filter(
    (concept) => concept.progress.status === "completed"
  ).length;
  return (
    <>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        {/* Section Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-amber-500/10")}>
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-foreground">
                Concepts
              </span>
              {role === "user" && (
                <span className="text-xs text-muted-foreground">
                  {completedCount} / {concepts.length} completed
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {concepts.length} items
            </Badge>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Section Content */}
        {isExpanded && (
          <div className="border-t border-border">
            {concepts.length > 0 ? (
              <div className="divide-y divide-border">
                {concepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="flex justify-between items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer capitalize"
                  >
                    <p>{concept.title}</p>

                    <Badge variant="secondary" className="text-xs">
                      {role === "user" ? concept.progress.status : concept.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No items yet</p>
              </div>
            )}
            {role === "mentor" && (
              <button
                className="p-3 flex items-center justify-center border-t border-border w-full text-muted-foreground hover:text-foreground hover:bg-muted/30"
                onClick={() => setShowAddConcepts(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a concept
              </button>
            )}
          </div>
        )}
      </div>
      {showAddConcepts && (
        <AddConcepts
          open={showAddConcepts}
          setOpen={setShowAddConcepts}
          milestoneId={milestoneId}
        />
      )}
    </>
  );
};

export default MilestonesConcept;
