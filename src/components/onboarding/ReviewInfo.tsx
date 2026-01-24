import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  EducationSchema,
  ExperienceSchema,
  PersonalSchema,
  PreferencesSchema,
} from "../../pages/onboarding/schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Book,
  Clock,
  Code2,
  Earth,
  File,
  Github,
  GraduationCap,
  Heart,
  LetterText,
  Link,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Target,
} from "lucide-react";
import { FaGenderless } from "react-icons/fa";
import { Badge } from "../ui/badge";
import { calculateAge } from "@/constant/HelperFunctions";
import { UPLOAD_PHOTOS_URL } from "../config/CommonBaseUrl";

type ReviewProps = {
  Personalform: UseFormReturn<z.infer<typeof PersonalSchema>>;
  Educationform: UseFormReturn<z.infer<typeof EducationSchema>>;
  Experienceform: UseFormReturn<z.infer<typeof ExperienceSchema>>;
  Preferenceform: UseFormReturn<z.infer<typeof PreferencesSchema>>;
};

const ReviewInfo = ({
  Personalform,
  Educationform,
  Experienceform,
  Preferenceform,
}: ReviewProps) => {
  return (
    <div className=" space-y-5">
      <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-12 flex flex-col items-center text-center">
            <Avatar className="mb-6 h-32 w-32 border-4 border-primary/20 ring-2 ring-primary/10">
              <AvatarImage
                src={UPLOAD_PHOTOS_URL + Personalform.getValues("avatar")}
                alt={Personalform.getValues("full_name")}
              />
              <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                {Personalform.getValues("full_name")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
              {Personalform.getValues("full_name")}
            </h1>

            <p className="mb-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {Personalform.getValues("bio")}
            </p>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4 mb-2">
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-4 w-4" />

                {calculateAge(Personalform.getValues("date_of_birth"))}
              </div>
              <div>|</div>
              <div className="flex items-center justify-center gap-1">
                <FaGenderless className="h-4 w-4" />
                <span>{Personalform.getValues("gender")}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${Personalform.getValues("email")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {Personalform.getValues("email")}
                </a>
              </div>
              <div>|</div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{Personalform.getValues("phone_number")}</span>
              </div>
              <div>|</div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {Personalform.getValues("current_city") +
                    ", " +
                    Personalform.getValues("current_state")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Education Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Education</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className=" flex items-center justify-between">
              <div className="font-semibold text-foreground">
                {Educationform.getValues("educations")[0].institution}
              </div>
              <div className="text-sm text-muted-foreground">
                Graduation:{" "}
                <span className="font-medium text-foreground">
                  {Educationform.getValues("educations")[0].graduation_year}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {Educationform.getValues("educations")[0].highest_degree}
            </div>
            <div className="text-sm text-muted-foreground">
              GPA:{" "}
              <span className="font-medium text-foreground">
                {Educationform.getValues("educations")[0].gpa}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Skills Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Code2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Preferenceform.getValues("skills").map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Experience Card */}
        {(Experienceform.getValues("experience") ?? []).length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Experience</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className=" flex items-center justify-between">
                <div className="font-semibold text-foreground">
                  {"Software Engineer"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Experience:{" "}
                  <span className="font-medium text-foreground">
                    {5 + " years"}
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {"Google New York, NY"}
              </div>
              <div className="text-sm text-muted-foreground">
                Industry:{" "}
                <span className="font-medium text-foreground">
                  {"Technology"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Social Media Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Social Media</CardTitle>
            </div>
          </CardHeader>
          <CardContent className=" grid grid-cols-2">
            <p className=" flex items-center gap-1">
              <Linkedin size={17} />
              <span className=" text-lg font-bold">LinkedIn</span>
            </p>
            <p className=" flex items-center gap-1">
              <Github size={17} />
              <span className=" text-lg font-bold">Github</span>
            </p>
            <p className=" flex items-center gap-1">
              <Book size={17} />
              <span className=" text-lg font-bold">Resume</span>
            </p>
            {Preferenceform.getValues("portfolio_link") && (
              <p className=" flex items-center gap-1">
                <Earth size={17} />
                <span className=" text-lg font-bold">Portfolio</span>
              </p>
            )}
          </CardContent>
        </Card>
        {/* Interests Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Heart className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Interests</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Preferenceform.getValues("interests").map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Languages Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LetterText className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Languges</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Preferenceform.getValues("languages").map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {(Preferenceform.getValues("certificates") ?? []).length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <File className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Certificates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className=" space-y-5 grid grid-cols-2 gap-5">
            {Preferenceform?.getValues("certificates")?.map((certificate) => (
              <Card key={certificate.link}>
                <CardContent className="space-y-2">
                  <div className=" flex items-center justify-between">
                    <div className="font-semibold text-foreground">
                      {certificate.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {certificate.start_date.toISOString().split("T")[0]} -{" "}
                      {certificate.end_date.toISOString().split("T")[0]}
                    </div>
                  </div>
                  <div className=" flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {certificate.provider}
                    </div>
                    <a
                      className=" flex items-center gap-2 border w-fit py-1 px-2 rounded-lg text-sm"
                      href={certificate.link}
                    >
                      <Link size={15} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewInfo;
