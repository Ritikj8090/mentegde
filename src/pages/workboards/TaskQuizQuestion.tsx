import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/index";
import { cn } from "@/lib/utils";
import { submitTaskQuizAnswers } from "@/utils/internship";
import { Check, Send, Target, Timer } from "lucide-react";
import { useEffect, useState } from "react";

const TaskQuizQuestion = ({
  filterQuizQuestions,
  role,
}: {
  filterQuizQuestions: QuizQuestion[];
  role: string;
}) => {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialAnswers: Record<string, number> = {};
    filterQuizQuestions.forEach((q) => {
      initialAnswers[q.id] = -1;
    });
    setQuizAnswers(initialAnswers);
  }, [filterQuizQuestions]);

  const onSubmit = async () => {
    const unanswered = Object.values(quizAnswers).some((v) => v === -1);

    if (unanswered) {
      alert("Please answer all questions");
      return;
    }

    const answers = Object.entries(quizAnswers).map(
      ([questionId, selectedOption]) => ({
        [questionId]: selectedOption,
      }),
    );

    const res = await submitTaskQuizAnswers(
      filterQuizQuestions[0].task_id,
      answers,
    );

    console.log(res);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-lg">
        <div className="flex items-center gap-3">
          <Timer className="h-5 w-5 text-amber-400" />
          <span className="text-sm text-muted-foreground">
            Time Limit: 30 minutes
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-emerald-400" />
          <span className="text-sm text-muted-foreground">
            {filterQuizQuestions.length} Questions
          </span>
        </div>
      </div>

      {filterQuizQuestions.map((q, qIndex) => (
        <div key={q.id} className="p-4 rounded-lg border">
          <p className="font-medium  mb-3">
            {qIndex + 1}. {q.question_text}
          </p>
          <div className="grid gap-2">
            {q.options.map((option, oIndex) => (
              <button
                key={oIndex}
                onClick={() =>
                  setQuizAnswers((prev) => ({ ...prev, [q.id]: oIndex }))
                }
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                  quizAnswers[q.id] === oIndex
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border hover:bg-muted/50",
                )}
                disabled={role === "mentor"}
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                    quizAnswers[q.id] === oIndex
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-2",
                  )}
                >
                  {quizAnswers[q.id] === oIndex && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {role === "user" && (
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={onSubmit}
        >
          <Send className="h-4 w-4 mr-2" />
          Submit Quiz
        </Button>
      )}
    </div>
  );
};

export default TaskQuizQuestion;
