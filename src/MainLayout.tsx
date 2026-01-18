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

const MainLayout = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const { isLoading } = useAuth(); // Use the custom hook
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Show loading state while verifying user
  if (isLoading) {
    console.log("MainLayout: Loading authentication state..."); // Debug log
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <SidebarProvider defaultOpen={false} open={menuToggle}>
        <Navbar setMenuToggle={setMenuToggle} menuToggle={menuToggle} />
        {isAuthenticated && <AppSidebar />}
        <main className="pt-16 flex w-full min-h-screen">
          <Outlet /> {/* Child components will be rendered here */}
          <Toaster />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
