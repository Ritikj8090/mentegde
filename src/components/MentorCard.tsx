import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Crown, Star } from "lucide-react";

interface MentorCardProps {
  id: string;
  name: string;
  bio: string;
  image: string;
  expertise: string[];
  title: string;
  hourlyRate: number;
  rating: number;
  domain?: string;
  topic?: string;
  experience?: string;
  ranking?: number;
  isLive?: boolean;
}

const MentorCard = ({
  id,
  name,
  bio,
  image,
  expertise,
  title,
  hourlyRate,
  rating,
  ranking,
  isLive = false,
}: MentorCardProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col group hover:shadow-lg transition-shadow pb-0 overflow-hidde h-96">
      <CardHeader>
        <a href={`/mentor-profile/${id}`} className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9439775.jpg-4JVJWOjPksd3DtnBYJXoWHA5lc1DU9.jpeg"
                }
                alt={name}
              />
              <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            {isLive && (
              <span
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"
                aria-label="Currently teaching live"
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-green-500 animate-ping" />
              </span>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold capitalize">{name}</h3>
                {ranking && ranking <= 10 && (
                  <div
                    className="flex items-center gap-1 text-amber-500"
                    aria-label={`Ranked ${ranking} among top mentors`}
                  >
                    <Crown className="h-4 w-4 fill-current" />
                    <span className="text-xs font-medium">#{ranking}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm">{rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              {isLive && (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 hover:bg-green-50"
                >
                  Live Now
                </Badge>
              )}
            </div>
          </div>
        </a>
      </CardHeader>
      <CardContent className="flex-1 relative px-0">
        <a
          href={`/mentor/${id}`}
          className="relative block w-full h-full overflow-hidden rounded-lg"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9439775.jpg-4JVJWOjPksd3DtnBYJXoWHA5lc1DU9.jpeg"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-3 z-10 flex flex-col justify-between text-white">
            <div className="flex justify-between">
              <p>domain</p>
              <p>topic</p>
            </div>
            <div className="flex justify-between">
              <p>experience</p>
            </div>
          </div>
        </a>
      </CardContent>

      {/* <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">${hourlyRate}/hour</div>
        <Button className="group-hover:bg-primary/90 transition-colors" asChild>
          <Link to={`/mentor/${id}`}>Book Session</Link>
        </Button>
      </CardFooter> */}
    </Card>
  );
};

export default MentorCard;