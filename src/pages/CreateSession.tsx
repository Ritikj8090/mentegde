import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apis from "@/services/api";

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
  duration: z.string().min(1, {
    message: "Please select session duration.",
  }),
  maxParticipants: z.string().min(1, {
    message: "Please select maximum participants.",
  }),
  format: z.enum(["virtual", "inPerson"], {
    required_error: "Please select a session format.",
  }),
  prerequisites: z.string().optional(),
  materials: z.string().optional(),
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
  duration: z.string().min(1, {
    message: "Please select session duration.",
  }),
  maxParticipants: z.string().min(1, {
    message: "Please select maximum participants.",
  }),
  format: z.enum(["virtual", "inPerson"], {
    required_error: "Please select a session format.",
  }),
  prerequisites: z.string().optional(),
  materials: z.string().optional(),
  skillLevel: z.array(z.string()).min(1, {
    message: "Please select at least one skill level.",
  }),
});

const formSchema = z.discriminatedUnion("sessionType", [
  liveSessionSchema,
  scheduledSessionSchema,
]);

type FormValues = z.infer<typeof formSchema>;

const topics = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "devops", label: "DevOps" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "blockchain", label: "Blockchain" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "product-management", label: "Product Management" },
];

const timeSlots = Array.from({ length: 24 * 2 }).map((_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const time = `${hour.toString().padStart(2, "0")}:${minute}`;
  return { value: time, label: time };
});

const durations = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

const participantLimits = [
  { value: "1", label: "1 student (1:1)" },
  { value: "5", label: "Up to 5 students" },
  { value: "10", label: "Up to 10 students" },
  { value: "15", label: "Up to 15 students" },
  { value: "20", label: "Up to 20 students" },
];

const skillLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export default function CreateSession() {
  const [activeTab, setActiveTab] = useState<"live" | "scheduled">("scheduled");
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionType: "scheduled",
      title: "",
      topic: "",
      description: "",
      time: "",
      duration: "",
      maxParticipants: "",
      format: "virtual",
      prerequisites: "",
      materials: "",
      skillLevel: [],
    },
  });

  // Update form values when tab changes
  useEffect(() => {
    form.setValue("sessionType", activeTab);
  }, [activeTab, form]);

  async function onSubmit(data: FormValues) {
    if (data.sessionType === "live") {
      try {
        const sessionResult = await apis.createSession({
          mentor_id: "dd3cde25-4a8e-43a0-a446-5317b66c35db",
          title: data.title,
          description: data.description,
          topic: data.topic,
          duration: parseInt(data.duration),
          max_participants: parseInt(data.maxParticipants),
          format: data.format,
          prerequisites: data.prerequisites,
          materials: data.materials,
          skill_level: data.skillLevel.join(", "),
          session_type: data.sessionType,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + parseInt(data.duration) * 60000).toISOString(),
        });
  
        await apis.updateMentorLiveStatus({
          mentorId: "dd3cde25-4a8e-43a0-a446-5317b66c35db",
          isLive: true,
        });
  
        navigate(`/live-session?token=${sessionResult.token}`);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    }
  }  

  return (
    <div className="container flex min-h-screen flex-col py-6 md:py-12">
      <a
        href="/mentor/dashboard"
        className="mb-4 flex items-center text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </a>

      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Create a Session</h1>
          <p className="text-muted-foreground">
            Set up a live or scheduled mentoring session
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "live" | "scheduled")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Live Session
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select the main topic" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {topics.map((topic) => (
                                  <SelectItem
                                    key={topic.value}
                                    value={topic.value}
                                  >
                                    {topic.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <CalendarComponent
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date < new Date() ||
                                        date < new Date("1900-01-01")
                                      }
                                      initialFocus
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
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {timeSlots.map((slot) => (
                                      <SelectItem
                                        key={slot.value}
                                        value={slot.value}
                                      >
                                        {slot.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
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
                          you create this session. Students will be able to join
                          right away.
                        </p>
                      </div>
                    )}

                    {/* Duration and Participants */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {durations.map((duration) => (
                                  <SelectItem
                                    key={duration.value}
                                    value={duration.value}
                                  >
                                    {duration.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Participants</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select limit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {participantLimits.map((limit) => (
                                  <SelectItem
                                    key={limit.value}
                                    value={limit.value}
                                  >
                                    {limit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Session Format */}
                    <FormField
                      control={form.control}
                      name="format"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Session Format</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="virtual" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Virtual (Online)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="inPerson" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  In-Person
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                    {/* Prerequisites and Materials */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="prerequisites"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prerequisites (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List any prerequisites or requirements for participants"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="materials"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Materials Needed (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List any materials participants should have ready"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="ml-auto">
                    {activeTab === "live"
                      ? "Start Live Session"
                      : "Schedule Session"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
