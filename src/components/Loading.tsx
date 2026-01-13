import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className=" fixed inset-0 flex items-center justify-center h-screen z-50 w-full">
      <Loader2 className=" animate-spin text-secondary" size={35} />
    </div>
  );
};

export default Loading;
