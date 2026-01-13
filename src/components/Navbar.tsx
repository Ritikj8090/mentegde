import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useSidebar } from "@/components/ui/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/components/store";
import { logout } from "@/components/features/auth/authSlice";
import SearchBar from "./Search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import apis from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useLiveMentorsSocket } from "@/hooks/useLiveMentors";
import {
  setLiveMentors,
  fetchLiveMentors,
} from "@/components/store/slices/mentorSlice";
import { useEffect } from "react";
import type { AppDispatch } from "@/components/store";
import StartLiveClass from "./StartLiveClass";
import { userLogout } from "@/utils/auth";
import { UPLOAD_PHOTOS_URL } from "./config/CommonBaseUrl";

export default function Navbar({
  setMenuToggle,
  menuToggle,
}: {
  setMenuToggle: React.Dispatch<React.SetStateAction<boolean>>;
  menuToggle: boolean;
}) {
  useLiveMentorsSocket();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const liveMentors = useSelector(
    (state: RootState) => state.mentors.liveMentors
  );
  const liveCount = liveMentors.length;
  useEffect(() => {
    if (user?.is_active) {
      dispatch(fetchLiveMentors());
    }
  }, [user?.is_active, dispatch]);

  const handleLogout = async () => {
    try {
      await userLogout();
      dispatch(logout());
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // const { toggleSidebar } = useSidebar();
  // const login = false;
  return (
    <nav className="bg-background/80 backdrop-blur-lg border-b fixed left-0 right-0 top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ml-0 md:ml-8">
          <div className="flex items-center">
            {/* <Button
              variant="ghost"
              size="icon"
              // onClick={toggleSidebar}
              className="mr-2 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button> */}
            {isAuthenticated && <Button
              variant="ghost"
              onClick={() => setMenuToggle(!menuToggle)}
              className="mr-2 absolute left-3 hidden md:flex"
            >
              <Menu size={25} className="" />
            </Button>}
            <a href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold">Logo</span>
            </a>
            <div className="ml-10">
              <div className="flex items-baseline space-x-4">
                <div className="flex items-center space-x-1">
                  {liveCount > 0 ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-semibold">{liveCount}</span>
                      <span>Live</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No mentors live
                    </div>
                  )}
                </div>
                {isAuthenticated && <a
                  href="/top-mentors"
                  className="text-foreground hover:text-primary transition-colors hidden md:block"
                >
                  Top Mentors
                </a>}
              </div>
            </div>
          </div>
          {isAuthenticated  && <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end gap-2">
            <SearchBar />
            {isAuthenticated && user?.role === "mentor" && user.is_active && (
              <StartLiveClass title="" />
            )}
          </div>}
          {!isAuthenticated ? (
            <>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Button variant="outline" asChild className="mr-2">
                    <a href="/sign-up">Create Account</a>
                  </Button>
                  <Button asChild>
                    <a href="/sign-in">Login</a>
                  </Button>
                </div>
              </div>
              <div className="flex md:hidden">
                <Button>Login</Button>
              </div>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                        UPLOAD_PHOTOS_URL + user?.avatar
                        }
                        alt={""}
                      />
                      <AvatarFallback>
                        {user?.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a
                      href={
                        user?.role === "mentor"
                          ? "/mentor/profile"
                          : "/user/profile"
                      }
                    >
                      Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings">Settings</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
