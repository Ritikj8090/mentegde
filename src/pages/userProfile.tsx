import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  GraduationCap,
  Code2,
  Target,
  Linkedin,
  Github,
  Book,
  Earth,
  Heart,
  LetterText,
  File,
  Link,
  Clock,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/auth";
import Loading from "@/components/Loading";
import { FrontEndUserProfile } from "..";
import { format, parseISO } from "date-fns";
import { calculateAge } from "@/constant/HelperFunctions";
import { FaGenderless } from "react-icons/fa";

const UserProfilePage = () => {
  const [user, setUser] = useState<FrontEndUserProfile>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <Loading />;
  }
  return (
    <div className="mx-auto min-h-screen container py-12 md:px-4 md:py-10 space-y-5">
      {/* Header Section */}
      <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
        <CardContent className=" flex items-center justify-center flex-col">
          <Avatar className="mb-6 md:h-32 md:w-32 h-20 w-20 border-4 border-primary/20 ring-2 ring-primary/10">
            <AvatarImage src={user.avatar} alt={user.full_name} />
            <AvatarFallback className="bg-primary/10 md:text-3xl text-xl font-semibold text-primary">
              {user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h1 className="mb-3 text-2xl font-bold tracking-tight md:text-5xl">
            {user.full_name}
          </h1>

          <p className="mb-6 max-w-2xl md:text-lg leading-relaxed text-muted-foreground">
            {user.bio}
          </p>

          <div className="flex gap-2 text-sm text-muted-foreground sm:gap-4 mb-2">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              {calculateAge(user.date_of_birth) + " years old"}
            </div>
            <div>|</div>
            <div className="flex items-center justify-center gap-1">
              <FaGenderless className="h-4 w-4" />
              <span>{user.gender.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground sm:gap-4">
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${user.email}`}
                className="hover:text-foreground transition-colors"
              >
                {user.email}
              </a>
            </div>
            <div>|</div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{user.phone_number}</span>
            </div>
            <div>|</div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{user.current_city + ", " + user.current_state}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Education Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex md:h-10 md:w-10 h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <CardTitle className="md:text-xl text-lg font-semibold">Education</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="font-semibold text-foreground">
              {user.educations[0].institution}
            </div>
            <div className="text-sm text-muted-foreground">
              {user.educations[0].highest_degree}
            </div>
            <div className="text-sm text-muted-foreground">
              Graduation:{" "}
              <span className="font-medium text-foreground">
                {user.educations[0].graduation_year}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Skills Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex md:h-10 md:w-10 h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Code2 className="h-5 w-5" />
              </div>
              <CardTitle className="md:text-xl text-lg font-semibold">Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
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
        {user?.experience && (
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex md:h-10 md:w-10 h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <CardTitle className="md:text-xl text-lg font-semibold">Experience</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className=" flex items-center justify-between">
                <div className="font-semibold text-foreground">
                  {user.experience[0].title}
                </div>
                <div className="text-sm text-muted-foreground">
                  Exp:{" "}
                  <span className="font-medium text-foreground">
                    {user.experience[0].experience.split("(")[0]}
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {user.experience[0].company +
                  ", " +
                  user.experience[0].location}
              </div>
              <div className="text-sm text-muted-foreground">
                Industry:{" "}
                <span className="font-medium text-foreground">
                  {user.experience[0].industry}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Media Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex md:h-10 md:w-10 h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <CardTitle className="md:text-xl text-lg font-semibold">Social Media</CardTitle>
            </div>
          </CardHeader>
          <CardContent className=" grid grid-cols-2 space-y-2">
            <a href={user.linkedin_link} className=" flex items-center gap-1">
              <Linkedin size={17} />
              <span className=" md:text-lg text-sm font-bold">LinkedIn</span>
            </a>
            <a href={user.github_link} className=" flex items-center gap-1">
              <Github size={17} />
              <span className=" md:text-lg text-sm font-bold">Github</span>
            </a>
            <a href={user.resume_link} className=" flex items-center gap-1">
              <Book size={17} />
              <span className=" md:text-lg text-sm font-bold">Resume</span>
            </a>
            {user.portfolio_link && (
              <a
                href={user.portfolio_link}
                className=" flex items-center gap-1"
              >
                <Earth size={17} />
                <span className=" md:text-lg text-sm font-bold">Portfolio</span>
              </a>
            )}
          </CardContent>
        </Card>
        {/* Interests Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex md:h-10 md:w-10 h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Heart className="h-5 w-5" />
              </div>
              <CardTitle className="md:text-xl text-lg font-semibold">Interests</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Languages Card */}
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex md:h-10 md:w-10 h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LetterText className="h-5 w-5" />
              </div>
              <CardTitle className="md:text-xl text-lg font-semibold">Languages</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((language) => (
                <Badge
                  key={language}
                  variant="secondary"
                  className="px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {language}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {user.certificates.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex md:h-10 md:w-10 h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <File className="h-5 w-5" />
              </div>
              <CardTitle className="md:text-xl text-lg font-semibold">Certificates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className=" space-y-5 md:grid grid-cols-2 gap-5">
            {user.certificates.map((certificate) => (
              <Card
                key={certificate.link}
                className="bg-card/50 backdrop-blur-sm border-border/50 group"
              >
                <CardContent className="space-y-2">
                  <div className=" flex items-center justify-between">
                    <div className="font-semibold text-foreground">
                      {certificate.name}
                    </div>
                    <div className="text-sm text-muted-foreground hidden md:block">
                      {format(
                        parseISO(certificate.start_date.toString()),
                        "MMM dd, yyyy"
                      )}{" "}
                      -{" "}
                      {format(
                        parseISO(certificate.end_date.toString()),
                        "MMM dd, yyyy"
                      )}
                    </div>
                    <a
                      className="md:hidden flex items-center gap-2 border w-fit py-1 px-2 rounded-lg text-sm"
                      href={certificate.link}
                    >
                      <Link size={15} />
                    </a>
                  </div>
                  <div className=" flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {certificate.provider}
                    </div>
                    <a
                      className="hidden md:flex items-center gap-2 border w-fit py-1 px-2 rounded-lg text-sm"
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
export default UserProfilePage;
