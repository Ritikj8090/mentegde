import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodingQuestion } from "@/index";
import { submitTaskCodingSolution } from "@/utils/internship";
import { isArray } from "lodash";
import { Circle, Code, Play, Send } from "lucide-react";
import { useState } from "react";

const TaskCodingQuestion = ({
  filterCodingQuestions,
  role,
}: {
  filterCodingQuestions: CodingQuestion[];
  role: string;
}) => {
  const [codeInput, setCodeInput] = useState("");

  const onSubmit = async () => {
    const res = await submitTaskCodingSolution(
      filterCodingQuestions[0].task_id,
      codeInput,
    );
    console.log(res);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-lg  border ">
        <Code className="h-5 w-5 text-cyan-400" />
        <h4 className="">Coding Question</h4>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Starter Code</label>
        <pre className="p-4 rounded-lg  border text-sm text-muted-foreground overflow-x-auto font-mono">
          {filterCodingQuestions[0].starter_code}
        </pre>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Test Cases
        </label>
        <div className="space-y-2">
          {filterCodingQuestions[0].test_cases.map((tc, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 rounded-lg border"
            >
              <Circle className="h-3 w-3 text-muted-foreground" />
              <code className="text-xs text-muted-foreground font-mono">
                {tc}
              </code>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Test Outputs
        </label>
        <div className="space-y-2">
          {isArray(filterCodingQuestions[0].expected_output) &&
            filterCodingQuestions[0].expected_output.map((tc, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 rounded-lg border"
              >
                <Circle className="h-3 w-3 text-muted-foreground" />
                <code className="text-xs text-muted-foreground font-mono">
                  {tc}
                </code>
              </div>
            ))}
        </div>
      </div>

      {role === "user" && (
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Your Solution
          </label>
          <Textarea
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Write your code here..."
            className="min-h-[200px] font-mono text-sm placeholder:text-muted-foreground"
          />
        </div>
      )}

      {role === "user" && (
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Play className="h-4 w-4 mr-2" />
            Run Tests
          </Button>
          <Button
            className="flex-1 bg-cyan-600 hover:bg-cyan-600/80 text-white"
            onClick={onSubmit}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskCodingQuestion;
