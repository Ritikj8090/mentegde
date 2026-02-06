import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TextQuestion } from "@/index";
import { cn } from "@/lib/utils";
import { submitTaskTextSolution } from "@/utils/internship";
import { Check, Send } from "lucide-react";
import { useState } from "react";

const TaskTextQuestion = ({
  filterTextQuestions,
  role,
}: {
  filterTextQuestions: TextQuestion[];
  role: string;
}) => {
  const [textInput, setTextInput] = useState("");
  const wordCount = textInput.trim().split(/\s+/).filter(Boolean).length;

  const onSubmit = async () => {
    const res = await submitTaskTextSolution(
      filterTextQuestions[0].task_id,
      textInput,
    );
    console.log(res);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-lg border ">
        <span className="text-sm text-muted-foreground">
          Word limit: {filterTextQuestions[0].word_limit_min} -{" "}
          {filterTextQuestions[0].word_limit_max} words
        </span>
        <span
          className={cn(
            "text-sm font-medium",
            wordCount < filterTextQuestions[0].word_limit_min
              ? "text-amber-400"
              : wordCount > filterTextQuestions[0].word_limit_max
                ? "text-red-400"
                : "text-emerald-400",
          )}
        >
          {wordCount} words
        </span>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Guidelines</label>
        <ul className="space-y-1">
          {filterTextQuestions[0].guidelines.map((g, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              {g}
            </li>
          ))}
        </ul>
      </div>

      {role === "user" && (
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Your Response
          </label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Write your response here..."
            className="min-h-[200px] placeholder:text-muted-foreground"
          />
        </div>
      )}

      {role === "user" && (
        <Button
          className="w-full bg-amber-600 hover:bg-amber-600/80 text-white"
          onClick={onSubmit}
        >
          <Send className="h-4 w-4 mr-2" />
          Submit Response
        </Button>
      )}
    </div>
  );
};

export default TaskTextQuestion;
