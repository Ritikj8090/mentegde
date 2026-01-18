import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { defaultValues, internshipSchema } from "./schema";
import DomainSection from "./DomainSection";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { UserProfile } from "@/index";
import { findMentors } from "@/utils/mentorAuth";
import { createInternship } from "@/utils/internship";
import { UPLOAD_PHOTOS_URL } from "@/components/config/CommonBaseUrl";

export const demo: z.infer<typeof internshipSchema> = {
  internship_title: "AI Product Development Internship",
  description:
    "Work with a real startup to build, validate, and launch an AI-powered SaaS product with guidance from both technical and product mentors.",
  price: 299,

  approval_required: true,
  host_domain: "tech",

  co_host_name: "Ritika Sharma",

  tech: {
    domain_name: "tech",
    domain_description:
      "Build the backend, APIs, and AI models that power the product.",
    skills_required: ["Node.js", "PostgreSQL", "OpenAI API", "React"],
    tools_used: ["VS Code", "GitHub", "Postman", "Docker"],
    tags: ["AI", "Full Stack", "Startup"],
    start_date: new Date("2026-02-01"),
    end_date: new Date("2026-03-31"),
    application_deadline: new Date("2026-01-25"),
    weekly_hours: 10,
    duration: "8 Weeks",
    difficulty_level: "Intermediate",
    marketplace_category: "AI & SaaS",
    max_seats: 25,
    certificate_provided: true,
  },

  management: {
    domain_name: "management",
    domain_description:
      "Work on product strategy, market research, and launch planning.",
    skills_required: [
      "Product Management",
      "Market Research",
      "Business Analysis",
      "User Interviews"
    ],
    tools_used: ["Notion", "Figma", "Google Sheets"],
    tags: ["Product", "Startup", "Business"],
    start_date: new Date("2026-02-01"),
    end_date: new Date("2026-03-31"),
    application_deadline: new Date("2026-01-25"),
    weekly_hours: 5,
    duration: "8 Weeks",
    difficulty_level: "Beginner",
    marketplace_category: "Product & Strategy",
    max_seats: 25,
    certificate_provided: true,
  },
};


export function CreateInternship({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [openCoHost, setOpenCoHost] = useState(false);
  const [mentors, setMentors] = useState<UserProfile[] | null>(null);
  const [selectedCoHost, setSelectedCoHost] = useState<UserProfile | null>(
    null
  );
  const form = useForm<z.infer<typeof internshipSchema>>({
    resolver: zodResolver(internshipSchema),
    defaultValues: demo,
  });

  const hostDomain = form.watch("host_domain");
  const coHostDomain = hostDomain === "tech" ? "management" : "tech";

  const search = async (value: string) => {
    form.setValue("co_host_name", value);
    if (value && value.length < 2) return;
    setOpenCoHost(true);
    const res = await findMentors({ full_name: value });
    setMentors(res.data);
    console.log(res.data);
  };

  const onSubmit = async (data: z.infer<typeof internshipSchema>) => {
    console.log(data);
    const res = await createInternship(data);
    console.log(res);
    if (res) {
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[calc(100%-30rem)] max-h-[calc(100%-10rem)] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Create Internship</DialogTitle>
          <DialogDescription>
            Fill the details of the internship
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6 overflow-y-scroll">
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="internship_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internship Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Internship Title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Price" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="co_host_name"
                render={({ field }) => (
                  <FormItem className=" relative">
                    <FormLabel>Add Co-Host</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Co-Host Name"
                        autoComplete="off"
                        {...field}
                        onChange={(e) => search(e.target.value)}
                      />
                    </FormControl>
                    {form.watch("co_host_name")?.length >= 2 && openCoHost && (
                      <Card className=" p-2">
                        <CardContent className=" space-y-3 px-2 max-h-100 overflow-y-scroll">
                          {mentors &&
                            mentors.map((mentor) => (
                              <Card
                                key={mentor.id}
                                className=" cursor-pointer"
                                onClick={() => {
                                  setSelectedCoHost(mentor);
                                  setOpenCoHost(false);
                                  form.setValue("co_host_id", mentor.id)
                                }}
                              >
                                <CardContent>
                                  <div className="flex items-center gap-2">
                                    <Avatar>
                                      <AvatarImage src={UPLOAD_PHOTOS_URL + mentor.avatar} />
                                      <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h1 className=" text-sm font-semibold">
                                        {mentor.full_name}
                                      </h1>
                                      <p className="text-xs text-muted-foreground">
                                        Data Scientist
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </CardContent>
                      </Card>
                    )}
                  </FormItem>
                )}
              />
              {selectedCoHost && (
                <div>
                  <h1 className=" mb-3">Select Co-Host</h1>
                  <Card>
                    <CardContent className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={UPLOAD_PHOTOS_URL + selectedCoHost.avatar} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className=" text-sm font-semibold">
                          {selectedCoHost.full_name}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                          Data Scientist
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              <FormField
                control={form.control}
                name="approval_required"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Approval Required for Co-host</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="host_domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host Mentor Domain</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Co-host will be assigned to <b>{coHostDomain}</b>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TECH DOMAIN */}
              {hostDomain === "tech" && (
                <DomainSection form={form} domain="tech" title="Tech" />
              )}

              {/* MANAGEMENT DOMAIN */}
              {hostDomain === "management" && (
                <DomainSection
                  form={form}
                  domain="management"
                  title="Management"
                />
              )}
            <DialogFooter>
              <Button type="submit" className=" w-full">
                Create Internship
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
