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
import { Switch } from "@/components/ui/switch";
import { internshipSchema } from "./schema";
import DomainSection from "./DomainSection";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Internship, UserProfile } from "@/index";
import { findMentors } from "@/utils/mentorAuth";
import { editInternship } from "@/utils/internship";
import { UPLOAD_PHOTOS_URL } from "@/components/config/CommonBaseUrl";
import { Toaster } from "@/components/Toaster";

export function EditInternship({
  open,
  setOpen,
  internship,
  setWorkflowData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internship: Internship;
  setWorkflowData: React.Dispatch<React.SetStateAction<Internship[]>>;
}) {
  const { addToast } = Toaster();
  const [openCoHost, setOpenCoHost] = useState(false);
  const [mentors, setMentors] = useState<UserProfile[] | null>(null);
  const [selectedCoHost, setSelectedCoHost] = useState<UserProfile | null>(
    null,
  );
  const demo: z.infer<typeof internshipSchema> = {
    internship_title: internship.internship_title ?? "",
    description: internship.description ?? "",
    price: Number(internship.price) || 0,

    approval_required: internship.approval_required ?? false,
    host_domain: internship.my_role.domain ?? "tech",

    co_host_name: internship.co_host?.[0]?.full_name ?? "",

    tech:
      internship.my_role.domain === "tech"
        ? {
            domain_name: internship.domains.tech?.domain_name ?? "",
            domain_description:
              internship.domains.tech?.domain_description ?? "",
            skills_required: internship.domains.tech?.skills_required ?? [],
            tools_used: internship.domains.tech?.tools_used ?? [],
            tags: internship.domains.tech?.tags ?? [],
            start_date: new Date(
              internship.domains.tech?.start_date ?? Date.now(),
            ),
            end_date: new Date(internship.domains.tech?.end_date ?? Date.now()),
            application_deadline: new Date(
              internship.domains.tech?.application_deadline ?? Date.now(),
            ),
            weekly_hours: Number(internship.domains.tech?.weekly_hours) || 0,
            duration: internship.domains.tech?.duration ?? "",
            difficulty_level:
              internship.domains.tech?.difficulty_level ?? "Beginner",
            marketplace_category:
              internship.domains.tech?.marketplace_category ?? "",
            max_seats: Number(internship.domains.tech?.max_seats) || 0,
            certificate_provided:
              internship.domains.tech?.certificate_provided ?? false,
          }
        : undefined,

    management:
      internship.my_role.domain === "management"
        ? {
            domain_name: internship.domains.management?.domain_name ?? "",
            domain_description:
              internship.domains.management?.domain_description ?? "",
            skills_required:
              internship.domains.management?.skills_required ?? [],
            tools_used: internship.domains.management?.tools_used ?? [],
            tags: internship.domains.management?.tags ?? [],
            start_date: new Date(
              internship.domains.management?.start_date ?? Date.now(),
            ),
            end_date: new Date(
              internship.domains.management?.end_date ?? Date.now(),
            ),
            application_deadline: new Date(
              internship.domains.management?.application_deadline ?? Date.now(),
            ),
            weekly_hours:
              Number(internship.domains.management?.weekly_hours) || 0,
            duration: internship.domains.management?.duration ?? "",
            difficulty_level:
              internship.domains.management?.difficulty_level ?? "Beginner",
            marketplace_category:
              internship.domains.management?.marketplace_category ?? "",
            max_seats: Number(internship.domains.management?.max_seats) || 0,
            certificate_provided:
              internship.domains.management?.certificate_provided ?? false,
          }
        : undefined,
  };
  const form = useForm<z.infer<typeof internshipSchema>>({
    resolver: zodResolver(internshipSchema),
    defaultValues: demo,
  });

  const hostDomain = form.watch("host_domain");

  const search = async (value: string) => {
    form.setValue("co_host_name", value);
    if (value && value.length < 2) return;
    setOpenCoHost(true);
    const res = await findMentors({ full_name: value });
    setMentors(res.data);
  };

  const onSubmit = async (data: z.infer<typeof internshipSchema>) => {
    const res = await editInternship(data, internship.id);
    if (res) {
      addToast({
        type: "success",
        title: "Success",
        description: "Internship Updated",
        duration: 3000,
      });
      setWorkflowData((prev: Internship[]) =>
        prev.map((item) => {
          if (item.id === internship.id) {
            return res;
          }
          return item;
        }),
      );
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
                        <Input
                          placeholder="Price"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            form.setValue("price", parseInt(e.target.value))
                          }
                        />
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
                    {(form.watch("co_host_name") || "").length >= 2 &&
                      openCoHost && (
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
                                    form.setValue("co_host_id", mentor.id);
                                  }}
                                >
                                  <CardContent>
                                    <div className="flex items-center gap-2">
                                      <Avatar>
                                        <AvatarImage
                                          src={
                                            mentor.avatar
                                          }
                                        />
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
                        <AvatarImage
                          src={selectedCoHost.avatar}
                        />
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
                  Save changes
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
