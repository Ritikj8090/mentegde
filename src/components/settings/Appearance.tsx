import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { useTheme } from "../custom-provider";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Check,
  Moon,
  Sun,
  Leaf,
  Heart,
  Zap,
  Cloud,
  FlaskRound,
  Grape,
} from "lucide-react";
import { Button } from "../ui/button";

const themeIcons = {
  light: <Zap className="w-5 h-5" />,
  dark: <Moon className="w-5 h-5 text-black" />,
  "yellow-light": <Sun className="w-5 h-5" />,
  "green-light": <Leaf className="w-5 h-5" />,
  "red-light": <Heart className="w-5 h-5" />,
  "blue-light": <Cloud className="w-5 h-5" />,
  "orange-light": <FlaskRound className="w-5 h-5" />,
  "purple-light": <Grape className="w-5 h-5" />,
  "yellow-dark": <Sun className="w-5 h-5" />,
  "green-dark": <Leaf className="w-5 h-5" />,
  "red-dark": <Heart className="w-5 h-5" />,
  "blue-dark": <Cloud className="w-5 h-5" />,
  "orange-dark": <FlaskRound className="w-5 h-5" />,
  "purple-dark": <Grape className="w-5 h-5" />,
};

const Appearance = () => {
  const { currentTheme, themes, setTheme } = useTheme();
  return (
    <Card>
      <CardHeader className=" px-2 md:px-6">
        <div className="flex md:flex-row flex-col md:items-center items-end justify-between">
          <div className="flex md:items-center items-start gap-3">
            <div className="md:p-2 p-1 rounded-lg bg-primary">
              <Palette className="md:w-6 md:h-6 w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="md:text-2xl text-lg font-bold">Global Theme Selector</h1>
              <p className="text-muted-foreground md:text-base text-sm">
                Choose your perfect color theme for the entire app
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/70 text-accent-foreground"
          >
            {currentTheme.name}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3 mb-12 px-2 md:px-6">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              currentTheme.id === theme.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setTheme(theme.id)}
          >
            <CardHeader className="flex md:block items-center justify-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-lg bg-primary"
                    style={{
                      backgroundColor: `${theme.colors.primary}`,
                      color: `${theme.colors.primaryForeground}`,
                    }}
                  >
                    {themeIcons[theme.id as keyof typeof themeIcons]}
                  </div>
                  <div className="hidden md:block">
                    <CardTitle>{theme.name}</CardTitle>
                  </div>
                </div>
                {currentTheme.id === theme.id && (
                  <div className="p-1 rounded-full bg-primary hidden md:block">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <CardDescription className="hidden md:block">{theme.description}</CardDescription>
            </CardHeader>
            <CardContent className=" hidden md:block">
              {/* Color Palette Preview */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div
                    className="flex-1 h-8 rounded"
                    style={{ backgroundColor: `${theme.colors.primary}` }}
                  />
                  <div
                    className="flex-1 h-8 rounded"
                    style={{
                      backgroundColor: `${theme.colors.primaryForeground}`,
                    }}
                  />
                  <div
                    className="flex-1 h-8 rounded"
                    style={{
                      backgroundColor: `${theme.colors.mutedForeground}`,
                    }}
                  />
                </div>

                {/* Sample UI Elements */}
              </div>

              <Button
                className="w-full mt-4"
                variant={currentTheme.id === theme.id ? "default" : "secondary"}
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(theme.id);
                }}
              >
                {currentTheme.id === theme.id ? "Selected" : "Select Theme"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default Appearance;
