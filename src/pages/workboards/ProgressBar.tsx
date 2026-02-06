import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
    totalProgress: string;
}

const ProgressBar = ({ totalProgress }: ProgressBarProps) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl">
      <div className="h-12 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{parseInt(totalProgress)}%</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Overall Progress
          </span>
          <span className="text-sm text-muted-foreground"></span>
        </div>
        <Progress value={parseInt(totalProgress)} className="h-2" />
      </div>
    </div>
  );
};

export default ProgressBar;
