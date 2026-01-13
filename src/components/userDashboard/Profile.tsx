import { Star, BookOpen, Briefcase, Mail, Phone, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { defaultAvatars } from "@/constant";
import { Input } from "../ui/input";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

import React from "react";

import { useRef, useEffect } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  CalendarIcon,
  Camera,
  PlusCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constant";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "../store/store";
import apis from "@/services/api";
import { setUser } from "../features/auth/authSlice";

const educationSchema = z.object({
  institution: z.string().min(2, "Institution name is required"),
  degree: z.string().min(2, "Degree is required"),
  field_of_study: z.string().min(2, "Field of study is required"),
  startYear: z.string().min(4, "Start year is required"),
  endYear: z.string().min(4, "End year is required"),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().default(false),
  description: z.string().optional(),
});

const formSchema = z.object({
  //Personal Information
  //Personal Information
  firstName: z
    .string()
    .min(2, { message: "First Name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone_number number." }),
  bio: z.string(),
  profilePicture: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files.length === 1,
      "Please upload only one file"
    )
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .nullable(),
  location: z.string().min(1, { message: "Location is required." }),
  dob: z.coerce.date({ required_error: "Please select your date of birth." }),
  working: z.boolean().optional().default(false),

  //Professional Information
  experiences: z.array(experienceSchema).optional(),

  //Education Background
  educations: z.array(educationSchema),

  //Additional Information
  additionalInfo: z.string().optional(),
  // socialMedia: z.array(SocialMediaSchema),
});

type FormValues = z.infer<typeof formSchema>;

type FormProps = {
  form: UseFormReturn<FormValues>;
  children: React.ReactNode;
};

const Profile = (mentorProfile: any, users: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone_number: "",
      location: "",
      dob: new Date(),
      bio: "",
      working: false,
      educations: [
        {
          institution: "",
          degree: "",
          field_of_study: "",
          startYear: "",
          endYear: "",
          description: "",
        },
      ],
      experiences: [],
      additionalInfo: "",
      // socialMedia: [
      //   {
      //     platform: "GitHub",
      //     link: "",
      //   },
      //   {
      //     platform: "LinkedIn",
      //     link: "",
      //   },
      //   {
      //     platform: "Twitter",
      //     link: "",
      //   },
      // ],
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
      });
    }
  }, [user, form]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("🔥 Form submission triggered");
    console.log("🔥 Form errors:", form.formState.errors);
    console.log("🔥 Form data:", data);

    const isValid = await form.trigger();
    if (!isValid) {
      console.log("❌ Form validation failed");
      return;
    }

    try {
      console.log("🔥 Submitting form...", data);
      const payload = {
        ...data,
        dob: data.dob.toISOString().split("T")[0],
        profilePicture: null, // Handle upload separately
      };

      const response = await apis.onboardUser(payload);

      const { user, token } = response;

      dispatch(
        setUser({
          user: {
            ...user,
            is_active: true,
          },
          token,
          role: user.role,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding submission failed", error);
      alert("Failed to submit onboarding. Please try again.");
    }
  };
  const [edit, setEdit] = useState(false);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setEdit(true)}
          >
            <Pen size={15} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src="/placeholder.svg?height=80&width=80"
                alt="Mentor"
              />
              <AvatarFallback>
                <img src="https://github.com/shadcn.png" alt="@shadcn" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{user?.username}</h2>
              <div className="flex items-center mt-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-lg">
                  {mentorProfile?.rating
                    ? parseFloat(mentorProfile.rating).toFixed(1)
                    : "N/A"}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({mentorProfile?.review_count || 0} reviews)
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold flex items-center mb-2">
                <BookOpen className="mr-2 h-5 w-5" /> Education
              </h3>
              {mentorProfile?.educations?.length ? (
                mentorProfile.educations.map((edu: any, index: number) => (
                  <p key={index}>
                    {edu.degree} in {edu.field_of_study}, {edu.institution}
                  </p>
                ))
              ) : (
                <p>No education data available.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold flex items-center mb-2">
                <Briefcase className="mr-2 h-5 w-5" /> Experience
              </h3>
              {mentorProfile?.experiences?.length ? (
                mentorProfile.experiences.map((exp: any, index: number) => (
                  <p key={index}>
                    {exp.position} at {exp.company} ({exp.years} years)
                  </p>
                ))
              ) : (
                <p>No experience listed.</p>
              )}
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-4">
              {mentorProfile?.expertise?.length ? (
                mentorProfile.expertise.map((skill: string, index: number) => (
                  <Badge key={index}>{skill}</Badge>
                ))
              ) : (
                <p>No skills listed.</p>
              )}
            </div>
          </div>

          <Separator className="my-4" />
          <div>
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p className="flex items-center">
              <Mail className="mr-2 h-5 w-5" /> {mentorProfile?.email}
            </p>
            <p className="flex items-center mt-1">
              <Phone className="mr-2 h-5 w-5" />{" "}
              {mentorProfile?.phone_number || "Not provided"}
            </p>
          </div>
        </CardContent>
      </Card>
      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  console.log("🔥 Form onSubmit triggered");
                  console.log("🔥 Form errors:", form.formState.errors);
                  console.log("🔥 Form values:", form.getValues());
                  return form.handleSubmit(onSubmit)(e);
                }}
              >
                <div className="space-y-8">
                  <PersonalInformation form={form} />
                  <ProfessionalInformation form={form} />
                  <EducationBackground form={form} />
                </div>
                <div className=" px-5 pb-5">

                <Button
                  type="submit"
                  className="w-full"
                  onClick={(e) => {
                    console.log("🔥 Button clicked");
                    console.log("🔥 Button type:", e.currentTarget.type);
                  }}
                  >
                  Complete Profile
                </Button>
                  </div>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;

const ProfilePicture = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePreview, setProfilePreview] = useState("");

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files;
    if (file) {
      form.setValue("profilePicture", file); // Store the actual file in RHF
      setProfilePreview(URL.createObjectURL(file[0]));
    }
  };

  const clearProfilePicture = () => {
    form.setValue("profilePicture", null);
    setProfilePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <FormField
        control={form.control}
        name="profilePicture"
        render={() => (
          <FormItem className="flex flex-col items-center">
            <FormLabel className="text-center">Profile Picture</FormLabel>
            <FormControl>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profilePreview || ""} />
                    <AvatarFallback className="bg-muted">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleProfilePictureChange(e)}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {profilePreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                  {profilePreview && (
                    <Button
                      type="button"
                      variant={"destructive"}
                      size="icon"
                      onClick={clearProfilePicture}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Upload a profile picture (JPG, PNG, WebP, max 5MB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const PersonalInformation: React.FC<{ form: UseFormReturn<FormValues> }> = ({
  form,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfilePicture form={form} />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Hopkin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+91 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="New York, US" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={` pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1950}
                      toYear={2025}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ProfessionalInformation = ({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) => {
  const [experiences, setExperiences] = useState([{ id: 1 }]);

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now() }]);
    const existingExperiences = form.getValues().experiences || []; // fallback
    form.setValue("experiences", [
      ...existingExperiences,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const newExperiences = [...experiences];
      newExperiences.splice(index, 1);
      setExperiences(newExperiences);

      const formExperiences = form.getValues().experiences || []; // Fallback
      const newFormExperiences = [...formExperiences];
      newFormExperiences.splice(index, 1);
      form.setValue("experiences", newFormExperiences);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "working") {
        if (value.working) {
          const experiences = form.getValues("experiences") || [];
          if (experiences.length === 0) {
            // Only add if none exist
            setExperiences([{ id: Date.now() }]);
            form.setValue("experiences", [
              {
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false,
                description: "",
              },
            ]);
          }
        } else {
          // If user unchecks 'working', reset experiences
          setExperiences([{ id: 1 }]);
          form.setValue("experiences", []);
        }
      }
    });

    return () => subscription.unsubscribe(); // clean up
  }, [form]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Professional Background</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name={`working`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-1">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Are you working professional?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {form.watch("working") && (
            <>
              {experiences.map((experience, index) => (
                <div
                  key={experience.id}
                  className="p-4 border rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    {experiences.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Google" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Senior Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div></div>
                    </div>

                    <div className=" space-y-2">
                      {!form.watch(`experiences.${index}.currentlyWorking`) && (
                        <FormField
                          control={form.control}
                          name={`experiences.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.currentlyWorking`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-1 space-y-0 mb-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>I currently work here</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your responsibilities and achievements"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addExperience}
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Another Experience
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

const EducationBackground = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const [educations, setEducations] = useState([{ id: 1 }]);

  const addEducation = () => {
    setEducations([...educations, { id: Date.now() }]);
    form.setValue("educations", [
      ...form.getValues().educations,
      {
        institution: "",
        degree: "",
        field_of_study: "",
        startYear: "",
        endYear: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      const newEducations = [...educations];
      newEducations.splice(index, 1);
      setEducations(newEducations);

      const newFormEducations = [...form.getValues().educations];
      newFormEducations.splice(index, 1);
      form.setValue("educations", newFormEducations);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education Background</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {educations.map((education, index) => (
          <div key={education.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Education {index + 1}</h3>
              {educations.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`educations.${index}.institution`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="University of California" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`educations.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bachelor">Bachelor's</SelectItem>
                        <SelectItem value="master">Master's</SelectItem>
                        <SelectItem value="phd">Ph.D.</SelectItem>
                        <SelectItem value="associate">Associate</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`educations.${index}.field_of_study`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`educations.${index}.startYear`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2018" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`educations.${index}.endYear`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Year (or Expected)</FormLabel>
                    <FormControl>
                      <Input placeholder="2022" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`educations.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your studies, achievements, etc."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Another Education
        </Button>
      </CardContent>
    </Card>
  );
};
