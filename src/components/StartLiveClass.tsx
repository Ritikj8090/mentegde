import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Video, Clock, Users, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import apis from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { skillLevels } from "@/constant";
import { ScrollArea } from "./ui/scroll-area";

const liveSessionSchema = z.object({
  sessionType: z.literal("live"),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  topic: z.string().min(1, {
    message: "Please select a topic.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  skillLevel: z.array(z.string()).min(1, {
    message: "Please select at least one skill level.",
  }),
});

const scheduledSessionSchema = z.object({
  sessionType: z.literal("scheduled"),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  topic: z.string().min(1, {
    message: "Please select a topic.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string().min(1, {
    message: "Please select a time.",
  }),
  skillLevel: z.array(z.string()).min(1, {
    message: "Please select at least one skill level.",
  }),
});

export const LiveSessionSchema = z.discriminatedUnion("sessionType", [
  liveSessionSchema,
  scheduledSessionSchema,
]);

type FormValues = z.infer<typeof LiveSessionSchema>;


export default function StartLiveClass({ title }: { title: string }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"live" | "scheduled">("scheduled");
  const { user } = useSelector((state: RootState) => state.auth);

  const form = useForm<FormValues>({
    resolver: zodResolver(LiveSessionSchema),
    defaultValues: {
      sessionType: "scheduled",
      title: "",
      topic: "",
      description: "",
      time: "",
      skillLevel: [],
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    form.setValue("sessionType", activeTab);
  }, [activeTab, form]);

  async function onSubmit(data: FormValues) {
    try {
      const sessionData = {
        mentor_id: user?.id,
        title: data.title,
        description: data.description,
        topic: data.topic,
        skill_level: data.skillLevel.join(", "),
        session_type: data.sessionType,
        start_time:
          data.sessionType === "scheduled"
            ? `${format(
                parseISO(`${format(data.date, "yyyy-MM-dd")}T${data.time}:00`),
                "yyyy-MM-dd'T'HH:mm:ss"
              )}`
            : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      };
      console.log("Submitting session data:", sessionData); // Debug input
      const response = await apis.createSession(sessionData);
      console.log("API response:", response); // Debug output

      // Adjust based on actual response structure
      if (!response.token) throw new Error("Token not found in response");

      const { token } = response; // Assuming response is { token, sessionId }
      navigate(`/live-session?token=${token}`);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create session:", error);
      alert(`Failed to create session: ${(error as Error).message}`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Video className="h-4 w-4" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Create a Session</DialogTitle>
          <DialogDescription>
            Set up a live or scheduled mentoring session
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)] p-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "live" | "scheduled")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="live" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Live Session
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Scheduled Session
              </TabsTrigger>
            </TabsList>
            <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 mt-6">
              <CardHeader>
                <CardTitle>
                  {activeTab === "live"
                    ? "Live Session Details"
                    : "Scheduled Session Details"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "live"
                    ? "Fill out the information for your immediate live session"
                    : "Plan and schedule a future mentoring session"}
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      {/* Title and Topic */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Session Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter a clear title for your session"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="topic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Topic</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter a clear topic for your session"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide a detailed description of what will be covered in the session"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Scheduled Session Fields */}
                      {activeTab === "scheduled" && (
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={`w-full pl-3 text-left font-normal ${
                                            !field.value &&
                                            "text-muted-foreground"
                                          }`}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className={`w-auto p-0`}>
                                      <CalendarComponent
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date <
                                          new Date(
                                            new Date().setHours(0, 0, 0, 0)
                                          )
                                        }
                                        captionLayout="dropdown"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="time"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Time</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="time"
                                      id="time"
                                      step="1"
                                      defaultValue="10:30:00"
                                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Live Session Notice */}
                      {activeTab === "live" && (
                        <div className="rounded-md bg-primary/10 p-4">
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div className="font-medium">
                              This session will start immediately after creation
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Make sure you're ready to begin mentoring as soon as
                            you create this session. Students will be able to
                            join right away.
                          </p>
                        </div>
                      )}
                      {/* Skill Level */}
                      <FormField
                        control={form.control}
                        name="skillLevel"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Required Skill Level</FormLabel>
                              <FormDescription>
                                Select all appropriate skill levels for this
                                session
                              </FormDescription>
                            </div>
                            <div className="grid gap-2 md:grid-cols-3">
                              {skillLevels.map((level) => (
                                <FormField
                                  key={level.id}
                                  control={form.control}
                                  name="skillLevel"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={level.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              level.id
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    level.id,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== level.id
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {level.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="ml-auto mt-5">
                      {activeTab === "live"
                        ? "Start Live Session"
                        : "Schedule Session"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
