// MainLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { ThemeProvider } from "./components/custom-provider";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/ui/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { CustomToastProvider } from "./components/Toaster";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./components/config/CommonBaseUrl";
import MobileNavbar from "./components/MobileNavbar";


const MainLayout = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const { isLoading } = useAuth(); // Use the custom hook
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Show loading state while verifying user
  if (isLoading) {
    console.log("MainLayout: Loading authentication state..."); // Debug log
    return <Loading />;
  }
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <CustomToastProvider>
          <SidebarProvider defaultOpen={false} open={menuToggle}>
            <Navbar setMenuToggle={setMenuToggle} menuToggle={menuToggle} setMobileToggle={setMobileToggle} mobileToggle={mobileToggle} />
            <MobileNavbar open={mobileToggle} onOpenChange={setMobileToggle} />
            {isAuthenticated && <AppSidebar />}
            <main className="pt-16 flex w-full min-h-screen px-2">
              <Outlet /> {/* Child components will be rendered here */}
              <Toaster />
            </main>
          </SidebarProvider>
        </CustomToastProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
